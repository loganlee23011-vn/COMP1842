const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const InvitationSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      default: ""
    },
    department: {
      type: String,
      trim: true,
      default: ""
    },
    email: {
      type: String,
      required: "Invitation email cannot be blank",
      trim: true,
      lowercase: true
    },
    role: {
      type: String,
      trim: true,
      default: "agent",
      enum: ["agent"]
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true
    },
    invitedByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    tokenHash: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accepted", "expired"]
    },
    expiresAt: {
      type: Date,
      required: true
    },
    acceptedAt: {
      type: Date,
      default: null
    },
    lastSentAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: "helpdesk_invitations",
    timestamps: true
  }
);

module.exports = mongoose.model("Invitation", InvitationSchema);
