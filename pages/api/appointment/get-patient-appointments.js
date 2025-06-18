import { connectToDatabase } from "@/lib/mongodb";
import Appointment from "@/models/appointment";
import { logger } from "@/lib/logger";
import mongoose from "mongoose";


export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
    console.log("📩 API hit - fetching appointments"); // 👈 Add this line

  const { patientId } = req.body;
  if (!patientId) return res.status(400).json({ message: "Patient ID is required" });

  try {
    await connectToDatabase();
    const objectPatientId = new mongoose.Types.ObjectId(String(patientId));
    const today = new Date().toISOString().split("T")[0]; 
    const appointments = await Appointment.find({ patientId: objectPatientId }).populate("doctorId");
    const formatted = [];
    for (let appt of appointments) {
      if(appt.status!=="cancelled"){
        if(appt.date===today){
          appt.status = "today";
          await appt.save();
        }else if(appt.date<today){
          appt.status = "completed";
          await appt.save();
        }else{
          appt.status = "upcoming";
          await appt.save();
        }
      }
      formatted.push( {
      _id: appt._id,
      doctorName: appt.doctorId.name,
      specialization: appt.doctorId.specialization,
      date: appt.date,
      time: appt.time,
      reason: appt.reason,
      status: appt.status,
    });
      
    }
   
    console.log("Received patientId:", objectPatientId);
    logger.success(`Fetched appointments for patient=${patientId}: ${appointments.length} found`);
    return res.status(200).json({ formatted });
  } catch (error) {
    logger.error("Error fetching patient appointments: " + error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}
