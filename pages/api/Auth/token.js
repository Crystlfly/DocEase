// pages/api/auth/token.js
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.status(200).json({ token });
}
