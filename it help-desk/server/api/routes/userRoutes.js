const UserController = require("../controllers/userController");
const { requireAuth } = require("../middleware/authMiddleware");

module.exports = (app) => {
  app.route("/auth/register").post(UserController.register);
  app.route("/auth/login").post(UserController.login);
  app.route("/auth/invitation").get(UserController.get_invitation);
  app.route("/auth/accept-invite").post(UserController.accept_invitation);
  app.route("/auth/forgot-password").post(UserController.forgot_password);
  app.route("/auth/reset-password").post(UserController.reset_password);
  app
    .route("/auth/profile")
    .get(requireAuth, UserController.get_profile)
    .put(requireAuth, UserController.update_profile);
  app
    .route("/users")
    .get(requireAuth, UserController.list_users);
};
