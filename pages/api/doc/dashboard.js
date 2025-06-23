import { connectToDatabase } from "@/lib/mongodb";
import Appointment from "@/models/appointment";
import User from "@/models/user";
import { logger } from "@/lib/logger";
import { verifyToken } from "@/lib/auth";
import { dbLogger } from "@/lib/dbLogger";

export default async function handler(req, res) {
  console.log("[API] /api/doc/dashboard hit");
  const isVerified = await verifyToken(req, res);
  if (!isVerified) return; // 🚨 Exit early if token is invalid
  const allowedRoles= ["doctor"];
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access Denied" });
  }
  
  if (req.method !== "POST") {
      await dbLogger("info", "Dashboard API hit", { ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress });

    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;
  console.log("📥 [API] Received email:", email);

  try {
    await connectToDatabase();
    console.log("✅ [MongoDB] Connected");

    // 1. Find the doctor by email
    const doctor = await User.findOne({ email, role: "doctor" });
    console.log("🔍 [DB] Doctor fetched:", doctor?.name || "Not found");

    if (!doctor) {
      logger.error(`❌ [API] Doctor not found for email: ${email}`);
      return res.status(404).json({ message: "Doctor not found" });
    }

    // 2. Get total patients linked to this doctor
    const totalPatients = await Appointment.distinct("patientId", {
      doctorId: doctor._id,
    });
    console.log(`📊 [Stats] Total unique patients: ${totalPatients.length}`);

    // 3. Get today's and upcoming appointments
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayDateStr = `${yyyy}-${mm}-${dd}`;
    console.log("📅 [Date] Today:", todayDateStr);

    const todaysAppointments = await Appointment.find({
      doctorId: doctor._id,
      date: todayDateStr,
    }).populate("patientId");
    console.log(`📆 [Appointments] Today: ${todaysAppointments.length} appointments`);

    const upcomingAppointments = await Appointment.find({
      doctorId: doctor._id,
      date: { $gt: todayDateStr },
    }).populate("patientId");
    console.log(`📅 [Appointments] Upcoming: ${upcomingAppointments.length} appointments`);

    logger.success(`✅ Dashboard data fetched successfully for doctor: ${doctor.name}`);
    await dbLogger("success", "Dashboard data fetched successfully", { email: req.body.email });

    res.status(200).json({
      doctorName: doctor.name,
      todayAppointments: todaysAppointments,
      upcomingAppointments,
      totalPatients: totalPatients.length,
    });
  } catch (error) {
    logger.error(`🔥 [Dashboard API Error]: ${error.message}`);
    console.error("❌ [Catch Block] Dashboard error:", error);
    await dbLogger("error", "Dashboard fetch failed", { error: error.message });

    res.status(500).json({ message: "Server error", error: error.message });
  }
}
