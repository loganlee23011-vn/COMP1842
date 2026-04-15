const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = mongoose.model("User");
const Team = mongoose.model("Team");
const Invitation = mongoose.model("Invitation");
const { JWT_SECRET } = require("../middleware/authMiddleware");
const { isMailConfigured, sendMail } = require("../../config/mailer");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8080";

const sanitiseUser = (user) => ({
  _id: user._id,
  name: user.name,
  department: user.department,
  email: user.email,
  role: user.role,
  teamIds: user.teamIds || [],
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const createToken = (user) => jwt.sign(
  {
    userId: user._id,
    email: user.email,
    role: user.role
  },
  JWT_SECRET,
  { expiresIn: "1d" }
);

const createResetToken = () => crypto.randomBytes(32).toString("hex");
const hashResetToken = (token) => crypto.createHash("sha256").update(token).digest("hex");
const createInviteToken = () => crypto.randomBytes(32).toString("hex");
const hashInviteToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

exports.register = async (req, res) => {
  try {
    const { name, department, email, password } = req.body;

    if (!name || !department || !email || !password) {
      return res.status(400).json({ message: "Please complete all required fields." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const user = await User.create({
      name: name.trim(),
      department: department.trim(),
      email: email.toLowerCase().trim(),
      role: "agent",
      passwordHash: User.hashPassword(password)
    });

    let emailSent = false;
    try {
      emailSent = await sendMail({
        to: user.email,
        subject: "Your Helpdesk account is ready",
        text: `Hello ${user.name}, your helpdesk account has been created successfully.`,
        html: `<p>Hello ${user.name},</p><p>Your helpdesk account has been created successfully.</p>`
      });
    } catch (mailError) {
      emailSent = false;
    }

    return res.status(201).json({
      message: emailSent
        ? "Account created successfully. A confirmation email has been sent."
        : "Account created successfully. Email sending is not configured yet.",
      user: sanitiseUser(user),
      token: createToken(user),
      emailSent
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.get_invitation = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Invitation token is required." });
    }

    const invitation = await Invitation.findOne({
      tokenHash: hashInviteToken(token),
      status: "pending",
      expiresAt: { $gt: new Date() }
    }).populate("teamId", "name description");

    if (!invitation) {
      return res.status(400).json({ message: "Invitation link is invalid or has expired." });
    }

    const existingUser = await User.findOne({ email: invitation.email });

    return res.json({
      invitation: {
        _id: invitation._id,
        name: invitation.name,
        department: invitation.department,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
        expiresAt: invitation.expiresAt,
        team: invitation.teamId
          ? {
              _id: invitation.teamId._id,
              name: invitation.teamId.name,
              description: invitation.teamId.description
            }
          : null
      },
      existingUser: existingUser ? sanitiseUser(existingUser) : null
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.accept_invitation = async (req, res) => {
  try {
    const { token, name, department, password } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Invitation token is required." });
    }

    const invitation = await Invitation.findOne({
      tokenHash: hashInviteToken(token),
      status: "pending",
      expiresAt: { $gt: new Date() }
    });

    if (!invitation) {
      return res.status(400).json({ message: "Invitation link is invalid or has expired." });
    }

    const team = await Team.findById(invitation.teamId);
    if (!team) {
      return res.status(404).json({ message: "The team for this invitation no longer exists." });
    }

    let user = await User.findOne({ email: invitation.email });

    if (!user) {
      if (!name || !department || !password) {
        return res.status(400).json({ message: "Name, department, and password are required to activate this invitation." });
      }

      user = await User.create({
        name: name.trim(),
        department: department.trim(),
        email: invitation.email,
        role: "agent",
        teamIds: [team._id],
        passwordHash: User.hashPassword(password)
      });
    } else {
      if (!Array.isArray(user.teamIds)) {
        user.teamIds = [];
      }

      if (!user.teamIds.some((teamId) => String(teamId) === String(team._id))) {
        user.teamIds.push(team._id);
        await user.save();
      }
    }

    if (!Array.isArray(team.memberIds)) {
      team.memberIds = [];
    }

    if (!team.memberIds.some((memberId) => String(memberId) === String(user._id))) {
      team.memberIds.push(user._id);
      await team.save();
    }

    invitation.status = "accepted";
    invitation.acceptedAt = new Date();
    invitation.tokenHash = hashInviteToken(createInviteToken());
    await invitation.save();

    return res.json({
      message: `Invitation accepted. ${user.name} is now part of ${team.name}.`,
      user: sanitiseUser(user),
      token: createToken(user)
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !user.verifyPassword(password)) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.json({
      message: "Login successful.",
      user: sanitiseUser(user),
      token: createToken(user)
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.get_profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json(sanitiseUser(user));
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.update_profile = async (req, res) => {
  try {
    const { name, department, email } = req.body;

    if (!name || !department || !email) {
      return res.status(400).json({ message: "Name, department, and email are required." });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
      _id: { $ne: req.user.userId }
    });

    if (existingUser) {
      return res.status(409).json({ message: "This email address is already in use." });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        name: name.trim(),
        department: department.trim(),
        email: email.toLowerCase().trim()
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({
      message: "Profile updated successfully.",
      user: sanitiseUser(user),
      token: createToken(user)
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.forgot_password = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    if (!isMailConfigured()) {
      return res.status(500).json({ message: "Email service is not configured." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.json({ message: "If that email exists, a reset link has been sent." });
    }

    const resetToken = createResetToken();
    user.passwordResetTokenHash = hashResetToken(resetToken);
    user.passwordResetExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

    await sendMail({
      to: user.email,
      subject: "Reset your Helpdesk password",
      text: `Hello ${user.name}, use this link to reset your password: ${resetLink}`,
      html: `<p>Hello ${user.name},</p><p>Use the link below to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p><p>This link will expire in 1 hour.</p>`
    });

    return res.json({ message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.reset_password = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Reset token and new password are required." });
    }

    const user = await User.findOne({
      passwordResetTokenHash: hashResetToken(token),
      passwordResetExpiresAt: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: "Reset link is invalid or has expired." });
    }

    user.passwordHash = User.hashPassword(password);
    user.passwordResetTokenHash = "";
    user.passwordResetExpiresAt = null;
    await user.save();

    try {
      await sendMail({
        to: user.email,
        subject: "Your Helpdesk password was changed",
        text: `Hello ${user.name}, your password has been updated successfully.`,
        html: `<p>Hello ${user.name},</p><p>Your password has been updated successfully.</p>`
      });
    } catch (mailError) {
      // Password reset remains successful even if the confirmation email fails.
    }

    return res.json({ message: "Password reset successful. You can now log in." });
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.list_users = async (req, res) => {
  try {
    const query = {};
    if (req.query.role) {
      query.role = req.query.role;
    }

    const users = await User.find(query).sort({ name: 1 });
    return res.json(users.map(sanitiseUser));
  } catch (err) {
    return res.status(500).send(err);
  }
};
