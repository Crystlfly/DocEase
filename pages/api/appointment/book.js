import Appointment from "@/models/appointment";
import { connectToDatabase } from "@/lib/mongodb";
import { logger } from "@/lib/logger";

export default async function handler(req, res) {
  logger.info("📥 [API] Book Appointment - Request received");

  if (req.method !== "POST") {
    logger.warn("⛔ [API] Book Appointment - Invalid method used: " + req.method);
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { doctorId, patientId, date, time, reason } = req.body;

  logger.info(`📩 [API] Incoming data - doctorId=${doctorId}, patientId=${patientId}, date=${date}, time=${time}, reason=${reason}`);

  try {
    await connectToDatabase();
    logger.success("🔌 [DB] Database connected successfully");

    const alreadyBooked = await Appointment.findOne({ doctorId, date, time });

    if (alreadyBooked) {
      logger.error(`⛔ [Conflict] Slot already booked for doctor=${doctorId} on ${date} at ${time}`);
      return res.status(409).json({ message: "Time slot already booked" });
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
    logger.success(`✅ [Booked] Appointment created for doctor=${doctorId}, patient=${patientId} at ${date} ${time}`);
    
    return res.status(201).json({ message: "Appointment booked successfully" });
  } catch (err) {
    logger.error("🔥 [Server Error] Booking failed: " + err.message);
    return res.status(500).json({ message: "Server error" });
  }
}
