//read env variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectDatabase } = require("./config/database");

global.Vocab = require("./api/models/vocabModel");
global.User = require("./api/models/userModel");
global.Team = require("./api/models/teamModel");
global.Invitation = require("./api/models/invitationModel");
global.Ticket = require("./api/models/ticketModel");
const User = global.User;
const Team = global.Team;
const Invitation = global.Invitation;
const Ticket = global.Ticket;
const Vocab = global.Vocab;
const routes = require("./api/routes/vocabRoutes");
const userRoutes = require("./api/routes/userRoutes");
const supportRoutes = require("./api/routes/supportRoutes");
const ticketRoutes = require("./api/routes/ticketRoutes");
const teamRoutes = require("./api/routes/teamRoutes");

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//register routes
routes(app);
userRoutes(app);
supportRoutes(app);
ticketRoutes(app);
teamRoutes(app);

app.use((req, res) => {
  res.status(404).send({ url: req.originalUrl + " not found" });
});

async function normaliseLegacyUserRoles() {
  const result = await User.updateMany(
    { role: { $ne: "agent" } },
    { $set: { role: "agent" } }
  );

  if (result.modifiedCount > 0) {
    console.log(`Updated ${result.modifiedCount} legacy user role(s) to agent.`);
  }
}

async function normaliseLegacyAssignments() {
  const [responseResult, ticketResult] = await Promise.all([
    Vocab.updateMany(
      { assignmentType: "staff" },
      { $set: { assignmentType: "agent" } }
    ),
    Ticket.updateMany(
      { assignmentType: "staff" },
      { $set: { assignmentType: "agent" } }
    )
  ]);

  if (responseResult.modifiedCount > 0) {
    console.log(`Updated ${responseResult.modifiedCount} legacy response assignment(s) to agent.`);
  }

  if (ticketResult.modifiedCount > 0) {
    console.log(`Updated ${ticketResult.modifiedCount} legacy ticket assignment(s) to agent.`);
  }
}

async function expireStaleInvitations() {
  const result = await Invitation.updateMany(
    {
      status: "pending",
      expiresAt: { $lte: new Date() }
    },
    {
      $set: { status: "expired" }
    }
  );

  if (result.modifiedCount > 0) {
    console.log(`Expired ${result.modifiedCount} stale invitation(s).`);
  }
}

connectDatabase()
  .then(() => {
    return normaliseLegacyUserRoles();
  })
  .then(() => {
    return normaliseLegacyAssignments();
  })
  .then(() => {
    return expireStaleInvitations();
  })
  .then(async () => {
    const teamlessAgents = await User.find({
      role: "agent",
      $or: [
        { teamIds: { $exists: false } },
        { teamIds: { $size: 0 } }
      ]
    });
    if (teamlessAgents.length === 0) {
      return null;
    }

    let defaultTeam = await Team.findOne({ name: "Support Heroes" });
    if (!defaultTeam) {
      defaultTeam = await Team.create({
        name: "Support Heroes",
        description: "Default team for existing agents migrated from the staff directory."
      });
    }

    const agentIds = teamlessAgents.map((agent) => agent._id);
    await User.updateMany(
      { _id: { $in: agentIds } },
      { $addToSet: { teamIds: defaultTeam._id } }
    );
    await Team.findByIdAndUpdate(defaultTeam._id, {
      $addToSet: { memberIds: { $each: agentIds } }
    });

    console.log(`Assigned ${agentIds.length} existing agent(s) to the default Support Heroes team.`);
    return null;
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed", error);
    process.exit(1);
  });
