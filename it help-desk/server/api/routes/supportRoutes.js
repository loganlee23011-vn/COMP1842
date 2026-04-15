const SupportController = require("../controllers/supportController");

module.exports = (app) => {
  app.route("/contact").post(SupportController.send_contact_message);
};
