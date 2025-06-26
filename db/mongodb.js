import mongoose from "mongoose";
import User from "@/models/user";
import Appointment from "@/models/appointment";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined");
}

// Vercel-safe global connection caching
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongoose) => {
      console.log("✅ [MongoDB] Connected");
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
//~~dashboard~~
export async function getDoctorByEmail(email) {
  await connect();
  return await User.findOne({ email, role: "doctor" });
}

// Get total patients for a doctor
export async function getPatientIdsByDoctor(doctorId) {
  await connect();
  return await Appointment.distinct("patientId", { doctorId });
}

export async function getPatientsByIds(patientIds) {
  await connect();
  return await User.find({ _id: { $in: patientIds }, role: "patient" }).select("name email"); // fetch only needed fields
}

// Get today's appointments
export async function getTodaysAppointments(doctorId, dateStr) {
  await connect();
  return await Appointment.find({ doctorId, date: dateStr }).populate("patientId");
}

// Get upcoming appointments
export async function getUpcomingAppointments(doctorId, dateStr) {
  await connect();
  return await Appointment.find({ doctorId, date: { $gt: dateStr } }).populate("patientId");
}
//~~complete-profile~~
export async function UpdateDoctorProfile(email, profileData) {
  await connect();
  return await User.findOneAndUpdate(
    { email: email.toLowerCase(), role: "doctor" },
    {
      ...profileData,
      profileCompleted: true,
      updatedAt: new Date(),
    },
    { new: true }
  );
}
//~~stats~~
export async function StatsgetTodaysAppointments(doctorEmail, todayISOString) {
  await connect();

  const today = new Date(todayISOString);
  today.setHours(0, 0, 0, 0); // 00:00:00

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // next day 00:00:00

  return await Appointment.find({
    doctorEmail,
    date: { $gte: today, $lt: tomorrow },
  });
}
export async function StatsgetUpcomingAppointments(doctorEmail, tomorrowISOString) {
  await connect();
  return await Appointment.find({
    doctorEmail,
    date: { $gte: new Date() },
  });
}
export async function getUniquePatients(doctorEmail) {
  await connect();
  return await Appointment.distinct("patientEmail", { doctorEmail });
}

//~~list-doc~~
export async function fetchDoctors(){
  await connect();
  const doctors=await User.find({ role: "doctor" }).select("name email phone profileCompleted specialization experience address about, profileImage");
  return doctors;
}

//~~list-patients~~
export async function fetchPatients(){
  await connect();
  const patients=await User.find({ role: "patient" }).select("name email phone");
  return patients;
}
//~~signup~~
export async function findUserByEmailAndRole(email,role){
  await connect();
  return await User.findOne({ email, role: role.toLowerCase() });
}
export async function createUser(userData){
  // try{
  // await connect();
  const newUser = new User(userData);
  return await newUser.save();
  // }catch(error){
  //   const errorDetail = "Error creating user:"+userData.name+" Error: "+ error.message;
  //   throw new Error(errorDetail);
  // }
}

//~~Appointment~~
// Book an appointment
export async function bookedSlot(doctorId, date, time){
  await connect();
  return await Appointment.findOne({ doctorId, date, time });
}
export async function createAppointment(appointmentData){
  await connect();
  const newAppointment = new Appointment(appointmentData);
  return await newAppointment.save();
}

//~~get-booked-slots~~
export async function getTodaysAppointmentsOnly(doctorId, date) {
  await connect();
  return await Appointment.find({ doctorId, date });
}

//~~get-patient-appointments~~
export async function getPatientAppointments(objectPatientId) {
  await connect();
  return await Appointment.find({ patientId: objectPatientId }).populate("doctorId").sort({ date: 1, time: 1 })
}
export async function markAppointmentAsCompleted(appointment) {
  appointment.status = "completed";
  await appointment.save();
}

///~~cancel-appointment~~
export async function cancelAppointment(appointmentId) {
  await connect();
  const appointment = await Appointment.findByIdAndUpdate(appointmentId, { status: "cancelled" });
  return appointment;
}