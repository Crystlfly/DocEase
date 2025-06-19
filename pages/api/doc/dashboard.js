import { connectToDatabase } from "@/lib/mongodb";
import Appointment from "@/models/appointment";
import User from "@/models/user";
import { logger } from "@/lib/logger";


export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { email } = req.body;
  console.log("API hit");
console.log("Received email:", req.body.email);

  try {
    await connectToDatabase();

    // 1. Find the doctor by email
    const doctor = await User.findOne({ email, role: "doctor" });

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // 2. Get total patients linked to this doctor
    const totalPatients = await Appointment.distinct("patientId", { doctorId: doctor._id });
    console.log(totalPatients.length) // Log the number of unique patients
    // 3. Get today's and upcoming appointments
    // const now = new Date();
    // const todayStart = new Date();
    // todayStart.setHours(0, 0, 0, 0);
    // console.log(todayStart)
    // const todayEnd = new Date();
    // todayEnd.setHours(23, 59, 59, 999);
    // console.log(todayEnd) 
    const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
const todayDateStr = `${yyyy}-${mm}-${dd}`;
    // const todayAppointments = await Appointment.find({
    //   doctorId: doctor._id,
    //   datetime: { $gte: todayStart, $lte: todayEnd },
    // }).populate("patientId");
const todaysAppointments = await Appointment.find({
  doctorId: doctor._id,
  date: todayDateStr,
}).populate("patientId");
    console.log(todaysAppointments) // Log today's appointments

    const upcomingAppointments = await Appointment.find({
      doctorId: doctor._id,
      date: { $gt: todayDateStr },
    }).populate("patientId");

    logger.success(`Dashboard data fetched successfully for doctor: ${doctor.name}`);
    res.status(200).json({
      doctorName: doctor.name,
      todayAppointments:todaysAppointments,
      upcomingAppointments,
      totalPatients: totalPatients.length,
    });
  } catch (error) {
        logger.error(`Dashboard error: ${error}`);
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
}
