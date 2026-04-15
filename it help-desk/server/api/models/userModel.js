const crypto = require("crypto");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: "Full name cannot be blank",
      trim: true
    },
    department: {
      type: String,
      required: "Department cannot be blank",
      trim: true
    },
    email: {
      type: String,
      required: "Email cannot be blank",
      trim: true,
      lowercase: true,
      unique: true
    },
    role: {
      type: String,
      trim: true,
      default: "agent",
      enum: ["agent"]
    },
    teamIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Team"
      }
    ],
    passwordHash: {
      type: String,
      required: true
    },
    passwordResetTokenHash: {
      type: String,
      default: ""
    },
    passwordResetExpiresAt: {
      type: Date,
      default: null
    }
  },
  {
    collection: "helpdesk_users",
    timestamps: true
  }
);

UserSchema.methods.verifyPassword = function verifyPassword(password) {
  const [salt, storedHash] = this.passwordHash.split(":");
  const passwordHash = crypto
    .scryptSync(password, salt, 64)
    .toString("hex");

  return storedHash === passwordHash;
};

UserSchema.statics.hashPassword = function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const passwordHash = crypto
    .scryptSync(password, salt, 64)
    .toString("hex");

  return `${salt}:${passwordHash}`;
};

module.exports = mongoose.model("User", UserSchema);
