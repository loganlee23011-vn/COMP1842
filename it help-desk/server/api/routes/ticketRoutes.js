const TicketController = require("../controllers/ticketController");
const { requireAuth } = require("../middleware/authMiddleware");

module.exports = (app) => {
  app
    .route("/tickets")
    .get(requireAuth, TicketController.list_all_tickets)
    .post(requireAuth, TicketController.create_a_ticket);

  app
    .route("/tickets/:ticketId")
    .get(requireAuth, TicketController.read_a_ticket)
    .put(requireAuth, TicketController.update_a_ticket)
    .delete(requireAuth, TicketController.delete_a_ticket);
};
