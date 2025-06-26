import * as db from "@/db";
import { logger } from "@/lib/logger";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { doctorId, date } = req.body;

  if (!doctorId || !date) {
    return res.status(400).json({ message: "Doctor ID and date are required" });
  }

  try {

    // Find all appointments for the doctor on the selected date
    const appointments = await db.getTodaysAppointmentsOnly(doctorId, date);

    // Extract the time slots that are already booked
    const bookedSlots = appointments.map((appt) => appt.time);
    logger.success(`Fetched booked slots for doctor=${doctorId} on ${date}: ${bookedSlots}`);
    return res.status(200).json({ bookedSlots });
  } catch (error) {
    console.error("Error fetching booked slots:", error);
    logger.error("Error fetching booked slots: " + error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}
