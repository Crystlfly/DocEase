import * as db from "@/db";
import bcrypt from "bcryptjs";
import { logger } from "@/lib/logger";
import jwt from 'jsonwebtoken';
import { dbLogger } from "@/lib/dbLogger";



export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  await dbLogger("info", "Login API hit", { ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress });
  const { email, password } = req.body; // ⛔️ No need to receive profileCompleted
  console.log("Received login request:", email);

  if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD) {
    logger.info("Admin login attempt with hardcoded credentials");
    await dbLogger("info", "Admin login attempt with hardcoded credentials", { email });
    const token = jwt.sign(
      { userId: "admin-id", roles: ["admin"] },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: "admin-id",
        name: "Admin User",
        email: process.env.ADMIN_EMAIL,
        phone: "000-000-0000",
        role: ["admin"],
        profileCompleted: true, // Admin profile is always complete
        token,
      },
    });
  }

  try {
    // Find user by email and role
    const user = await db.findUserByEmail(email.toLowerCase());

    if (!user) {
      logger.error(`User not found for email: ${email}`);
      await dbLogger("error", "User not found", { email });
      return res.status(401).json({ message: "User doesn't exists" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.error("user's existing password", user.password);
      logger.error("Given password", password);
      logger.error(`Invalid password for user: ${email}`);
      await dbLogger("error", "Invalid password attempt", { email });
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const roleDocs = await db.getUserRolesByUserId(user._id);
    console.log("roleDocs",roleDocs);
    if (roleDocs.length === 0 ) {
      return res.status(403).json({ message: "No roles assigned to this user" });
    }
    // Send back user info (omit password)
    const token = jwt.sign(
      { userId: user._id, roles: roleDocs },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    await dbLogger("info", "User logged in successfully", { email, roleDocs });
    const preId= user._id.toString();
    logger.success(`User logged in successfully and the data is returned: ${email}`);
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: preId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        roles: roleDocs,
        profileCompleted: user.profileCompleted || false, // always return boolean
        token:token
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    logger.error(`Login error: ${error}`);
    return res.status(500).json({ message: "Server error" });
  }
}
