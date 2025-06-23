import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { logger } from "@/lib/logger";
import jwt from 'jsonwebtoken';
import { dbLogger } from "@/lib/dbLogger";



export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  await dbLogger("info", "Login API hit", { ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress });
  const { email, password, role } = req.body; // ⛔️ No need to receive profileCompleted
  console.log("Received login request:", email, role);

  if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD && role.toLowerCase() === "admin") {
    logger.info("Admin login attempt with hardcoded credentials");
    await dbLogger("info", "Admin login attempt with hardcoded credentials", { email, role });
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: "admin-id",
        name: "Admin User",
        email: process.env.ADMIN_EMAIL,
        phone: "000-000-0000",
        role: "admin",
        profileCompleted: true, // Admin profile is always complete
        token: jwt.sign({ userId: "admin-id", role: "admin" }, process.env.JWT_SECRET, { expiresIn: '1d' })
      },
    });
  }

  try {
    await connectToDatabase();

    // Find user by email and role
    const user = await User.findOne({ email, role: role.toLowerCase() });

    if (!user) {
      logger.error(`User not found for email: ${email} and role: ${role}`);
      await dbLogger("error", "User not found", { email, role });
      return res.status(401).json({ message: "User doesn't exists" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.error("user's existing password", user.password);
      logger.error("Given password", password);
      logger.error(`Invalid password for user: ${email}`);
      await dbLogger("error", "Invalid password attempt", { email, role });
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Send back user info (omit password)
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    await dbLogger("info", "User logged in successfully", { email, role });
    const preId= user._id.toString();
    logger.success(`User logged in successfully and the data is returned: ${email}`);
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: preId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
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
