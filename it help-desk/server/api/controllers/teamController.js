const crypto = require("crypto");
const mongoose = require("mongoose");

const Team = mongoose.model("Team");
const User = mongoose.model("User");
const Invitation = mongoose.model("Invitation");
const { sendMail, isMailConfigured } = require("../../config/mailer");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8080";

const createInvitationToken = () => crypto.randomBytes(32).toString("hex");
const hashInvitationToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const sanitiseTeam = (team, invitations = []) => ({
  _id: team._id,
  name: team.name,
  description: team.description,
  memberIds: team.memberIds || [],
  members: (team.memberIds || []).map((member) => ({
    _id: member._id || member,
    name: member.name || "",
    email: member.email || "",
    department: member.department || ""
  })),
  pendingInvitations: invitations.filter((invitation) => invitation.status === "pending").length,
  createdAt: team.createdAt,
  updatedAt: team.updatedAt
});

async function sendInvitationEmail(invitation, teamName, customText) {
  if (!isMailConfigured()) {
    return false;
  }

  const inviteLink = `${FRONTEND_URL}/accept-invite?token=${invitation.rawToken}`;
  const intro = customText || `You have been invited to join the ${teamName} team.`;

  await sendMail({
    to: invitation.email,
    subject: `Join ${teamName} on the Helpdesk platform`,
    text: `${intro}\n\nOpen this link to accept the invitation:\n${inviteLink}\n\nThis invitation expires in 48 hours.`,
    html: `<p>${intro}</p><p><a href="${inviteLink}">${inviteLink}</a></p><p>This invitation expires in 48 hours.</p>`
  });

  return true;
}

exports.list_teams = async (req, res) => {
  try {
    const teams = await Team.find({}).populate("memberIds", "name email department").sort({ name: 1 });
    const teamIds = teams.map((team) => team._id);
    const invitations = await Invitation.find({ teamId: { $in: teamIds } });

    return res.json(
      teams.map((team) =>
        sanitiseTeam(
          team,
          invitations.filter((invitation) => String(invitation.teamId) === String(team._id))
        )
      )
    );
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.create_team = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Team name is required." });
    }

    const existingTeam = await Team.findOne({ name: name.trim() });
    if (existingTeam) {
      return res.status(409).json({ message: "A team with this name already exists." });
    }

    const team = await Team.create({
      name: name.trim(),
      description: (description || "").trim()
    });

    return res.status(201).json(sanitiseTeam(team, []));
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.list_invitations = async (req, res) => {
  try {
    const invitations = await Invitation.find({})
      .populate("teamId", "name")
      .sort({ createdAt: -1 });

    const now = new Date();
    const payload = invitations.map((invitation) => {
      const hasExpired = invitation.status === "pending" && invitation.expiresAt <= now;
      return {
        _id: invitation._id,
        name: invitation.name,
        department: invitation.department,
        email: invitation.email,
        role: invitation.role,
        teamId: invitation.teamId?._id || invitation.teamId,
        teamName: invitation.teamId?.name || "",
        status: hasExpired ? "expired" : invitation.status,
        expiresAt: invitation.expiresAt,
        acceptedAt: invitation.acceptedAt,
        lastSentAt: invitation.lastSentAt,
        createdAt: invitation.createdAt,
        updatedAt: invitation.updatedAt
      };
    });

    return res.json(payload);
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.invite_agent = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { name, department, email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Agent email is required." });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }

    const emailAddress = email.toLowerCase().trim();
    const existingPending = await Invitation.findOne({
      email: emailAddress,
      teamId,
      status: "pending",
      expiresAt: { $gt: new Date() }
    });

    if (existingPending) {
      return res.status(409).json({ message: "A pending invitation already exists for this email and team." });
    }

    const rawToken = createInvitationToken();
    const invitation = await Invitation.create({
      name: (name || "").trim(),
      department: (department || "").trim(),
      email: emailAddress,
      role: "agent",
      teamId,
      invitedByUserId: req.user.userId,
      tokenHash: hashInvitationToken(rawToken),
      status: "pending",
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      lastSentAt: new Date()
    });

    invitation.rawToken = rawToken;
    const emailSent = await sendInvitationEmail(invitation, team.name);

    return res.status(201).json({
      message: emailSent
        ? "Invitation sent successfully."
        : "Invitation created, but email sending is not configured.",
      invitation: {
        _id: invitation._id,
        name: invitation.name,
        department: invitation.department,
        email: invitation.email,
        role: invitation.role,
        teamId: team._id,
        teamName: team.name,
        status: invitation.status,
        expiresAt: invitation.expiresAt,
        acceptedAt: invitation.acceptedAt,
        lastSentAt: invitation.lastSentAt,
        createdAt: invitation.createdAt,
        updatedAt: invitation.updatedAt
      },
      emailSent
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.remind_invitation = async (req, res) => {
  try {
    const invitation = await Invitation.findById(req.params.invitationId).populate("teamId", "name");
    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found." });
    }

    if (invitation.status !== "pending") {
      return res.status(400).json({ message: "Only pending invitations can receive reminders." });
    }

    const rawToken = createInvitationToken();
    invitation.tokenHash = hashInvitationToken(rawToken);
    invitation.expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
    invitation.lastSentAt = new Date();
    await invitation.save();

    invitation.rawToken = rawToken;
    const emailSent = await sendInvitationEmail(
      invitation,
      invitation.teamId?.name || "your helpdesk team",
      "This is a reminder to accept your helpdesk team invitation."
    );

    return res.json({
      message: emailSent
        ? "Reminder sent successfully."
        : "Reminder saved, but email sending is not configured."
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};
