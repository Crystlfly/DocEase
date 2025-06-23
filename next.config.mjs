// next.config.mjs
import dotenv from 'dotenv';
dotenv.config();

const nextConfig = {
  env: {
    MONGODB_URI_1: process.env.MONGODB_URI || "mongodb://localhost:27017/dapp",
  },
};

export default nextConfig;
