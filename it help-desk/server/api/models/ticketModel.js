const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TicketSchema = new Schema(
  {
    ticketCode: {
      type: String,
      required: "Ticket code cannot be blank",
      trim: true,
      uppercase: true,
      unique: true
    },
    subject: {
      type: String,
      required: "Subject cannot be blank",
      trim: true
    },
    requesterName: {
      type: String,
      required: "Requester name cannot be blank",
      trim: true
    },
    requesterEmail: {
      type: String,
      required: "Requester email cannot be blank",
      trim: true,
      lowercase: true
    },
    category: {
      type: String,
      required: "Category cannot be blank",
      trim: true
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },
    status: {
      type: String,
      enum: ["Open", "Pending", "Resolved", "Closed"],
      default: "Open"
    },
    folder: {
      type: String,
      enum: ["Inbox", "Archive", "Spam", "Trash"],
      default: "Inbox"
    },
    assignmentType: {
      type: String,
      enum: ["agent", "team"],
      default: "agent"
    },
    assignedUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    assignedTo: {
      type: String,
      trim: true,
      default: "Unassigned"
    },
    linkedResponseCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: ""
    },
    description: {
      type: String,
      required: "Description cannot be blank",
      trim: true
    }
  },
  {
    collection: "helpdesk_tickets",
    timestamps: true
  }
);

module.exports = mongoose.model("Ticket", TicketSchema);
