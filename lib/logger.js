import fs from "fs";
import path from "path";

const logFilePath = path.join(process.cwd(), "logs", "app.log");

// Ensure logs directory exists
if (!fs.existsSync(path.dirname(logFilePath))) {
  fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
}

// Log helper
function log(message, type = "INFO") {
  const timestamp = new Date().toISOString();
  const fullMessage = `[${timestamp}] [${type}] ${message}\n`;
  fs.appendFile(logFilePath, fullMessage, (err) => {
    if (err) console.error("Failed to write to log:", err);
  });
}

export const logger = {
  info: (msg) => log(msg, "INFO"),
  success: (msg) => log(msg, "SUCCESS"),
  error: (msg) => log(msg, "ERROR"),
};
