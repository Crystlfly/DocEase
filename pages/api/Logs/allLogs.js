import { connectToDatabase } from "@/lib/mongodb";
import Log from "@/models/logs";
import { logger } from "@/lib/logger";

export default async function handler(req,res){
    await connectToDatabase();
    try {
        const lg = await Log.find().select("timestamp message");
        logger.success("Fetched logs successfully");
        return res.status(200).json(lg);
    } catch (error) {
        console.error("Error fetching logs:", error);
        logger.error(`Error fetching logs: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
}