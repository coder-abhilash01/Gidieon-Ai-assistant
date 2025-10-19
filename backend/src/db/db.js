const mongoose = require("mongoose");
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ DB connected");
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
  }
}

module.exports = connectDB;