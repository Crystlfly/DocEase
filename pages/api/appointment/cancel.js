import { connectToDatabase } from "@/lib/mongodb";
import Appointment from "@/models/appointment";
import { logger } from "@/lib/logger";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { appointmentId } = req.body;
  if (!appointmentId) return res.status(400).json({ message: "Appointment ID required" });

  try {
    await connectToDatabase();
    await Appointment.findByIdAndUpdate(appointmentId, { status: "cancelled" });
    logger.success(`Appointment ${appointmentId} cancelled successfully`);
    return res.status(200).json({ message: "Appointment cancelled" });
  } catch (error) {
    logger.error("Error cancelling appointment: " + error.message);
    return res.status(500).json({ message: "Server error" });
  }
}
