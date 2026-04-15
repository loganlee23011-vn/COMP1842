const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const VocabSchema = new Schema(
  {
    key: {
      type: String,
      required: "Issue code cannot be blank",
      trim: true,
      uppercase: true,
      unique: true
    },
    response: {
      type: String,
      required: "Standard response cannot be blank",
      trim: true
    },
    category: {
      type: String,
      required: "Category cannot be blank",
      trim: true
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
    agent: {
      type: String,
      trim: true,
      default: "Unassigned"
    }
  },
  {
    collection: "helpdesk_responses",
    timestamps: true
  }
);

module.exports = mongoose.model("Vocab", VocabSchema);
