import Appointment from "@/models/appointment";
import { connectToDatabase } from "@/lib/mongodb";
import { logger } from "@/lib/logger";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { doctorId, patientId, date, time, reason } = req.body;

  try {
    await connectToDatabase();

    const alreadyBooked = await Appointment.findOne({ doctorId, date, time });
    if (alreadyBooked) {
      logger.error(`Slot already taken for doctor=${doctorId} on ${date} at ${time}`);
      return res.status(409).json({ message: "Time slot already booked" }); // changed from 400 to 409
    }

    const appointment = new Appointment({
      doctorId,
      patientId,
      date,
      time,
      reason,
      status: "upcoming",
      createdAt: new Date(),
    });

    await appointment.save();
    logger.success(`Appointment booked for doctor=${doctorId}, patient=${patientId}, at ${time}`);
    return res.status(201).json({ message: "Appointment booked successfully" });
  } catch (err) {
    logger.error("Booking failed: " + err.message);
    return res.status(500).json({ message: "Server error" });
  }
}
