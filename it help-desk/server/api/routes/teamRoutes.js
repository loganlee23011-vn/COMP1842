const TeamController = require("../controllers/teamController");
const { requireAuth } = require("../middleware/authMiddleware");

//route and check middleware

module.exports = (app) => {
  app
    .route("/teams")
    .get(requireAuth, TeamController.list_teams)
    .post(requireAuth, TeamController.create_team);

  app
    .route("/teams/:teamId/invite")
    .post(requireAuth, TeamController.invite_agent);

  app
    .route("/invitations")
    .get(requireAuth, TeamController.list_invitations);

  app
    .route("/invitations/:invitationId/remind")
    .post(requireAuth, TeamController.remind_invitation);
};
