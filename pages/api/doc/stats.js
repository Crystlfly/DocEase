import { connectToDatabase } from "@/lib/mongodb";
import Appointment from "@/models/appointment";
import User from "@/models/user";
import { logger } from "@/lib/logger";


export default async function handler(req, res) {
  await connectToDatabase();

  const doctorEmail = req.query.email; // or from token/session
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const todayAppointments = await Appointment.find({
    doctorEmail,
    date: { $gte: today, $lt: tomorrow },
  });

  const upcomingAppointments = await Appointment.find({
    doctorEmail,
    date: { $gte: tomorrow },
  });

  const uniquePatients = await Appointment.distinct("patientEmail", {
    doctorEmail,
  });

  res.json({
    todayAppointments,
    upcomingAppointments,
    totalPatients: uniquePatients.length,
  });
}
