import * as db from "@/db"; // ← now uses your new interface
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
  

    // 1. Find the doctor by email
    console.log("🔍 [DB] Fetching doctor by email:", email);
    const doctor = await db.getDoctorByEmail(email);
    
    console.log("🔍 [DB] Doctor fetched:", doctor?.name || "Not found");
    // const doctor_id= localStorage.getItem("UserId");
    // const doctor_name= localStorage.getItem("UserName");
    if (!doctor) {
      logger.error(`❌ [API] Doctor not found for email: ${email}`);
      return res.status(404).json({ message: "Doctor not found" });
    }

    // 2. Get total patients linked to this doctor
    const patientIds = await db.getPatientIdsByDoctor(doctor._id);
    let patientList = [];
    if (patientIds.length > 0) {
      patientList = await db.getPatientsByIds(patientIds);
    }

    const totalPatients = patientList.length;
    console.log(`📊 [Stats] Total unique patients: ${totalPatients}`);

    // 3. Get today's and upcoming appointments
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayDateStr = `${yyyy}-${mm}-${dd}`;
    console.log("📅 [Date] Today:", todayDateStr);

    const todaysAppointments = await db.getTodaysAppointments(doctor._id, todayDateStr);

    const upcomingAppointments = await db.getUpcomingAppointments(doctor._id, todayDateStr);

    logger.success(`✅ Dashboard data fetched successfully for doctor: ${doctor.name}`);
    await dbLogger("success", "Dashboard data fetched successfully", { email: req.body.email });

    res.status(200).json({
      doctorName: doctor.name,
      todayAppointments: todaysAppointments,
      upcomingAppointments,
      totalPatients: totalPatients,
      patients: patientList,
    });
  } catch (error) {
    logger.error(`🔥 [Dashboard API Error]: ${error.message}`);
    console.error("❌ [Catch Block] Dashboard error:", error);
    await dbLogger("error", "Dashboard fetch failed", { error: error.message });

    res.status(500).json({ message: "Server error", error: error.message });
  }
}
