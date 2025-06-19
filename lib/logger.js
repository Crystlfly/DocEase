import fs from "fs";
import path from "path";

const logFilePath = path.join(process.cwd(), "logs", "app.log");

// Ensure logs directory exists (only in non-production)
if (process.env.NODE_ENV !== "production") {
  if (!fs.existsSync(path.dirname(logFilePath))) {
    fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
  }
}

function log(message, type = "INFO") {
  const timestamp = new Date().toISOString();
  const fullMessage = `[${timestamp}] [${type}] ${message}\n`;

  if (process.env.NODE_ENV !== "production") {
    fs.appendFile(logFilePath, fullMessage, (err) => {
      if (err) console.error("Failed to write to log:", err);
    });
  } else {
    console.log(fullMessage); // fallback for production (Vercel)
  }
}

export const logger = {
  info: (msg) => log(msg, "INFO"),
  success: (msg) => log(msg, "SUCCESS"),
  error: (msg) => log(msg, "ERROR"),
};
