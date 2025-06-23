// lib/dbLogger.js
import Log from "@/models/logs";
import { connectToDatabase } from "@/lib/mongodb";

export const dbLogger = async (level, message, meta = {}) => {
  try {
    await connectToDatabase();
    const logEntry = new Log({ level, message, meta });
    await logEntry.save();
  } catch (err) {
    console.error("❌ Failed to log to DB:", err.message);
  }
};
