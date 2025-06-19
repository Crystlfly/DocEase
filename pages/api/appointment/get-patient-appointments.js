import { connectToDatabase } from "@/lib/mongodb";
import Appointment from "@/models/appointment";
import { logger } from "@/lib/logger";
import User from "@/models/user";
import mongoose from "mongoose";

// Log loaded models
console.log("✅ [BOOT] Registered models:", Object.keys(mongoose.models));

export default async function handler(req, res) {
  console.log("📩 [API] /api/patient/get-patient-appointment hit");

  if (req.method !== "POST") {
    console.warn("⚠️ [API] Invalid method:", req.method);
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { patientId } = req.body;
  console.log("📨 [API] Received patientId:", patientId);

  if (!patientId) {
    console.error("❌ [API] No patient ID provided");
    return res.status(400).json({ message: "Patient ID is required" });
  }

  try {
    await connectToDatabase();
    console.log("✅ [DB] Connected to MongoDB");

    const objectPatientId = new mongoose.Types.ObjectId(String(patientId));
    const today = new Date().toISOString().split("T")[0];
    console.log("📅 [INFO] Today's date:", today);

    console.log("🔍 [DB] Fetching appointments for:", objectPatientId);
    const appointments = await Appointment.find({ patientId: objectPatientId })
      .populate("doctorId")
      .sort({ date: 1, time: 1 });

    console.log("✅ [DB] Appointments fetched:", appointments.length);

    const formatted = [];

    for (let appt of appointments) {
      let displayStatus = appt.status;

      if (appt.status !== "cancelled") {
        if (appt.date === today) {
          console.log(`📆 [APPT] Appointment ${appt._id} is today`);
          displayStatus = "today";
        } else if (appt.date < today && appt.status !== "completed") {
          console.log(`✅ [APPT] Completing appointment ${appt._id}`);
          appt.status = "completed";
          await appt.save();
          displayStatus = "completed";
        }
      } else {
        console.log(`🚫 [APPT] Skipping cancelled appointment ${appt._id}`);
      }

      formatted.push({
        _id: appt._id,
        doctorName: appt.doctorId.name,
        specialization: appt.doctorId.specialization,
        date: appt.date,
        time: appt.time,
        reason: appt.reason,
        status: displayStatus,
      });
    }

    console.log("📝 [RESP] Formatted appointments ready:", formatted.length);
    logger.success(`Fetched appointments for patient=${patientId}`);
    return res.status(200).json({ formatted });
  } catch (error) {
    console.error("❌ [ERROR] Exception during fetch:", error.message);
    logger.error("Error fetching patient appointments: " + error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}
