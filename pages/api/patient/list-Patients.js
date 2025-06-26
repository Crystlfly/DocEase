import * as db from "@/db"
import { logger } from "@/lib/logger";

export default async function handler(req,res){
    try {
        const users = await db.fetchPatients();
        logger.success("Fetched patients successfully");
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching patients:", error);
        logger.error(`Error fetching patients: ${error}`);
        return res.status(500).json({ message: "Internal server error fetching patients list" });
    }
}