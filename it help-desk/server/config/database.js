const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGODB_URI;

async function connectDatabase() {
  if (!MONGO_URI) {
    throw new Error("MONGODB_URI is not defined in the server .env file.");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(MONGO_URI);
  console.log(`Connected to MongoDB: ${MONGO_URI}`);
}

module.exports = {
  connectDatabase,
  MONGO_URI
};
