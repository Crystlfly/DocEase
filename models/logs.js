// models/logs.js
import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  level: { type: String, required: true },         // e.g., "info", "error", "success"
  message: { type: String, required: true },       // Actual log message
  timestamp: { type: Date, default: Date.now },    // When the log happened
  meta: { type: mongoose.Schema.Types.Mixed },     // Optional: any other data (user, IP, etc.)
});

const Log = (mongoose.models && mongoose.models.Log) || mongoose.model("Log", logSchema);
export default Log;
