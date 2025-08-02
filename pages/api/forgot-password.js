
import * as db from "@/db";
import crypto from "crypto";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;
  const lowerEmail = email.toLowerCase().trim();

  const user = await db.getDoctorByEmail(lowerEmail); //check for both the user doctor and as well as patient
  if (!user) {
    return res.status(404).json({ error: "No account found with this email." });
  }

  // Generate token
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken= crypto.createHash("sha256").update(token).digest("hex");
  await db.saveResetToken(user,hashedToken);

  // Send email
  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  
  const transporter = nodemailer.createTransport({
    service: "gmail", // or your service
    auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
  });
console.log("Sending email to:", user.email);
  console.log("Reset URL:", resetUrl);
  try{
    await transporter.sendMail({
    from: `"DocEase Support" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Password Reset Request",
    html: `<p>Reset link: <a href="${resetUrl}">${resetUrl}</a></p>`,
  });
} catch (err) {
  console.error("Email send error:", err);
  return res.status(500).json({ error: "Failed to send reset email." });
}


  res.status(200).json({ message: "Reset link sent! Please check your email." });
}
