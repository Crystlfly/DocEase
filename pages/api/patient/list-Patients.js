import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user";
import { logger } from "@/lib/logger";

export default async function handler(req,res){
    await connectToDatabase();
    try {
        const users = await User.find({ role: "patient" }).select("name email phone");
        logger.success("Fetched patients successfully");
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching patients:", error);
        logger.error(`Error fetching patients: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
}