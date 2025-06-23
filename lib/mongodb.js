import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI_1 || process.env.MONGODB_URI;
const Name = process.env.NAME;

console.log("🌍 ENV CHECK:", process.env.MONGODB_URI);

if (!MONGODB_URI) {
  console.error("❌ [DB] MONGODB_URI is not defined in environment variables!");
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Use globalThis to cache connection
let globalWithMongoose = globalThis;

if (!globalWithMongoose.mongoose) {
  console.log("🧠 [DB] No global mongoose cache found, creating new one");
  globalWithMongoose.mongoose = { conn: null, promise: null };
} else {
  console.log("📦 [DB] Using existing global mongoose cache");
}

let cached = globalWithMongoose.mongoose;

export async function connectToDatabase() {
  if (cached.conn) {
    console.log("📡 [DB] Reusing existing DB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🔌 [DB] Connecting to MongoDB...");
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongooseInstance) => {
        console.log("✅ [DB] Connection established successfully");
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("❌ [DB] Connection failed:", err.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
