import * as db from "@/db";
import { logger } from "@/lib/logger";

const timeSlots = [
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM"
];

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
    const availableSlots = timeSlots.filter(slot => !bookedSlots.includes(slot));
    logger.success(`Fetched booked slots for doctor=${doctorId} on ${date}: ${availableSlots}`);
    return res.status(200).json({ availableSlots });
  } catch (error) {
    console.error("Error fetching booked slots:", error);
    logger.error("Error fetching booked slots: " + error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}
