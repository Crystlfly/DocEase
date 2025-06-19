import fs from "fs";
import path from "path";

const logFilePath = path.join(process.cwd(), "logs", "app.log");
const isProd = process.env.NODE_ENV === "production";

// Create logs folder (only in development)
if (!isProd) {
  const dir = path.dirname(logFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log("📁 [LOGGER] Created logs directory at:", dir);
  }
}

function log(message, type = "INFO") {
  const timestamp = new Date().toISOString();
  const fullMessage = `[${timestamp}] [${type}] ${message}\n`;

  if (!isProd) {
    // In development, write to file
    fs.appendFile(logFilePath, fullMessage, (err) => {
      if (err) {
        console.error("❌ [LOGGER] Failed to write to log file:", err.message);
      }
    });
  } else {
    // In production (like Vercel), log to console
    console.log(fullMessage);
  }
}

// Export logger functions
export const logger = {
  info: (msg) => log(msg, "INFO"),
  success: (msg) => log(msg, "SUCCESS"),
  error: (msg) => log(msg, "ERROR"),
};

// Debug environment at load
console.log(`📝 [LOGGER] Logger initialized. Environment: ${process.env.NODE_ENV}`);
