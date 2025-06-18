import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user";
import { logger } from "@/lib/logger";

export default async function handler(req,res){
    await connectToDatabase();
    try {
        const users = await User.find({ role: "doctor" }).select("name email phone profileCompleted specialization experience address about,");
        logger.success("Fetched doctors successfully");
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching doctors:", error);
        logger.error(`Error fetching doctors: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
}