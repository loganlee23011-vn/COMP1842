const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TeamSchema = new Schema(
  {
    name: {
      type: String,
      required: "Team name cannot be blank",
      trim: true,
      unique: true
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    memberIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    collection: "helpdesk_teams",
    timestamps: true
  }
);

module.exports = mongoose.model("Team", TeamSchema);
