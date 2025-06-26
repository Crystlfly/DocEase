import * as db from "@/db"; // ← now uses your new interface

export default async function handler(req, res) {
  const doctorEmail = req.query.email; // or from token/session
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const todayAppointments = await db.StatsgetTodaysAppointments(doctorEmail, today.toISOString());

  const upcomingAppointments = await db.StatsgetUpcomingAppointments(doctorEmail, tomorrow.toISOString());

  const uniquePatients = await db.getUniquePatients(doctorEmail);

  res.json({
    todayAppointments,
    upcomingAppointments,
    totalPatients: uniquePatients.length,
  });
}
