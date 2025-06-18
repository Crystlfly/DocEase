import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { logger } from "@/lib/logger";


export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, phone, password, role } = req.body;

  try {
    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    
    if (existingUser && existingUser.role.toLowerCase() === role.toLowerCase()) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const timestampId = Date.now().toString();

    const newUserData = {
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      profileCompleted: role.toLowerCase()==="doctor"? false:true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (role.toLowerCase() === "patient") {
      newUserData.pid = "P" + timestampId;
    } else if (role.toLowerCase() === "doctor") {
      newUserData.did = "D" + timestampId;
    }

    const newUser = new User(newUserData);
    newUser.role=role.toLowerCase();
    newUser.email = email.toLowerCase(); // Ensure email is stored in lowercase
    newUser.phone = phone.replace(/\D/g, ""); // Remove non-numeric characters from phone

    await newUser.save();
    logger.success(`User registered successfully: ${email}`);
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    logger.error(`Signup error: ${error}`);
    return res.status(500).json({ message: "Server error" });
  }
}
  