import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { logger } from "@/lib/logger";


export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password, role } = req.body; // ⛔️ No need to receive profileCompleted
  console.log("Received login request:", email, role);

  try {
    await connectToDatabase();

    // Find user by email and role
    const user = await User.findOne({ email, role: role.toLowerCase() });

    if (!user) {
      logger.error(`User not found for email: ${email} and role: ${role}`);
      return res.status(401).json({ message: "User doesn't exists" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.error(`Invalid password for user: ${email}`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Send back user info (omit password)
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
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    logger.error(`Login error: ${error}`);
    return res.status(500).json({ message: "Server error" });
  }
}
