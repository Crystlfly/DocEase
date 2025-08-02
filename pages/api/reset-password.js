import * as db from "@/db"; 
import bcrypt from "bcryptjs";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: "Missing token or password" });
  }

  try {
      const hashedToken= crypto.createHash("sha256").update(token).digest("hex");

    const user = await db.findUserByResetToken(hashedToken );

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and clear token
   await db.updatePassword(user.id, hashedPassword);

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
