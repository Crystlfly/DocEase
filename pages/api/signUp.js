import * as db from"@/db";
import bcrypt from "bcryptjs";
import { logger } from "@/lib/logger";


export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, phone, password } = req.body;

  try {
    // console.log("Checking for existing user before with email:", email);
    const existingUser = await db.getUserByEmail(email.toLowerCase());
    // console.log("Existing user found:", existingUser);
    // console.log("Checking for existing user after with email:", email);
    if(existingUser){
      console.log("if check Existing user found with email:", existingUser.email);
    }
    // console.log("Role being checked:", role.toLowerCase());
    // console.log("Existing user role:", existingUser.role.toLowerCase());
    // console.log("True/false check:", existingUser && existingUser.role.toLowerCase() === role.toLowerCase());
    if (existingUser) {
      console.log("User already exists with email:", email);
      return res.status(400).json({ message: "User already exists" });
    }
    // console.log("email does not exist, proceeding with registration...", email);
    const hashedPassword = await bcrypt.hash(password, 10);
    // const timestampId = Date.now().toString();
    const newUserData = {
      name,
      email: email.toLowerCase(), // Ensure email is stored in lowercase
      phone: phone.replace(/\D/g, ""),
      password: hashedPassword,
      // profileCompleted: role.toLowerCase() === "doctor" ? false : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // if (role.toLowerCase() === "patient") {
    //   newUserData.pid = "P" + timestampId;
    // } else if (role.toLowerCase() === "doctor") {
    //   newUserData.did = "D" + timestampId;
    // }
    const savedData=await db.createUser(newUserData);

    const guest = await db.find_guest_user( newUserData.email );
    if (guest) {
    // Migrate appointments
    await db.updateAppointmentGuest(guest._id, savedData._id);

    // Optional: remove guest entry
    await db.removeGuestUser(guest._id);

    console.log(`Migrated guest appointments to user ${savedData.email}`);
  }

    logger.success(`User registered successfully: ${email}`);
    return res.status(201).json({ message: "User registered successfully", 
        id: savedData._id,
        name: savedData.name,
        email: savedData.email,
    });
  } catch (error) {
    console.error("Signup error:", error);
    logger.error(`Signup error: ${error}`);
    return res.status(500).json({ message: "Server error" });
  }
}
  