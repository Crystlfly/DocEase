import * as db from"@/db";
import { logger } from "@/lib/logger";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userid, role } = req.body;

  try {

    const roleid = await db.fetchRoleId(role.toLowerCase());
    console.log("Role to be fetched:", role);
    console.log("Role ID fetched:", roleid._id);
    const existingUser= await db.checkexistingUserinRoleTable(roleid._id, userid);
    if(existingUser){
      console.log("if check Existing user found with userId:", existingUser.userId);
    }
    if (existingUser) {
      console.log("User already exists with user id:", userid);
      return res.status(400).json({ success: false, message: "User already exists" });
    }
    await db.storeRole(userid, roleid._id);
    logger.success(`User role registered successfully: ${userid}`);
    return res.status(201).json({ success: true, message: "User role registered successfully", 
        roleId: roleid._id,
    });
  } catch (error) {
    console.error("User role register error:", error);
    logger.error(`User role register error: ${error}`);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}