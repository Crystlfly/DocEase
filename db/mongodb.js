import mongoose from "mongoose";
import User from "@/models/user";
import Appointment from "@/models/appointment";
import Role from "@/models/role";
import Userrole from "@/models/userrole";

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
//{fetch role id}
export async function fetchRoleId(role) {
  const safeRole = String(role).toLowerCase();
  console.log("🔍 Fetching role ID for:", safeRole);
  return await Role.findOne({ role: safeRole }).select("_id");
}
export async function checkexistingUserinRoleTable(roleId, userId) {
  return await Userrole.findOne({ roleId, userId }).select("userId");
}
export async function storeRole(userId, roleId) {
  await connect();
  const newUserRole = new Userrole({
    userId,
    roleId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return await newUserRole.save();
}
export async function getUserRolesByUserId(userId) {
  try {
    const userRoles = await Userrole.find({ userId }).populate("roleId");

    // Extract role names
    const roles = userRoles
      .map(entry => entry.roleId?.role) // roleId is now populated with Role doc
      .filter(Boolean); // remove undefined/null

    return roles; // ['patient', 'doctor']
  } catch (error) {
    console.error("Error fetching roles for user:", error);
    throw new Error("Could not fetch user roles");
  }
}

export async function ensureUserHasRole(userId, roleName) {
  const roleDoc = await Role.findOne({ role: roleName });
  if (!roleDoc) throw new Error("Role not found");

  const exists = await Userrole.findOne({ userId, roleId: roleDoc._id });
  if (!exists) {
    await Userrole.create({ userId, roleId: roleDoc._id });
  }
  return true;
}

//~~dashboard~~
export async function getDoctorByEmail(email) {
  await connect();
  return await User.findOne({ email });
}

// Get total patients for a doctor
export async function getPatientIdsByDoctor(doctorId) {
  await connect();
  return await Appointment.distinct("patientId", { doctorId });
}

export async function getPatientsByIds(patientIds) {
  await connect();
  const roleId = await fetchRoleId("patient");

  const userRoles = await Userrole.find({
    roleId,
    userId: { $in: patientIds },
  }).select("userId");

  // Step 3: Extract the userIds from the result
  const filteredPatientIds = userRoles.map((ur) => ur.userId);

  // Step 4: Get only those users from the User collection
  return await User.find({ _id: { $in: filteredPatientIds } }).select("name email");
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
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    console.warn("No user found with the given email");
    return null;
  }

  const role = await fetchRoleId("doctor");
  if (!role) {
    console.warn("Role 'doctor' not found in Role collection");
    return null;
  }

  const hasDoctorRole = await Userrole.findOne({
    userId: user._id,
    roleId: role._id,
  });
  if (!hasDoctorRole) {
    console.warn("User does not have doctor role");
    return null;
  }

  return await User.findOneAndUpdate(
    { _id: user._id },
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
  const role = await fetchRoleId("doctor");
  const userRoles = await Userrole.find({roleId:role._id}).select("userId");
  const userIds = userRoles.map((ur) => ur.userId);
  const doctors=await User.find({ _id: { $in: userIds } }).select("name email phone profileCompleted specialization experience address about profileImage");
  return doctors;
}

//~~list-patients~~
export async function fetchPatients(){
  await connect();
  const role = await fetchRoleId("patient");
  const userRoles = await Userrole.find({roleId:role._id}).select("userId");
  const userIds = userRoles.map((ur) => ur.userId);
  const patients=await User.find({ _id: { $in: userIds } }).select("name email phone");
  return patients;
}
//~~login~~
export async function findUserByEmail(email) {
  await connect();
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) return null;
  const userRoles = await Userrole.find({ userId: user._id }).populate("roleId", "role");
  const roles = userRoles.map((ur) => ur.roleId.role); // get role names like ['doctor', 'patient']
  return {
    ...user.toObject(),
    roles, // attach roles as an array of role names
  };
}
//~~signup~~
export async function findUserByEmailAndRole(email,role){
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return null;

  const roleObj = await fetchRoleId(role);
  const hasRole = await Userrole.findOne({
    userId: user._id,
    roleId: roleObj._id,
  });

  if (!hasRole) return null;

  return user;
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
export async function markAppointmentAsExpired(appointment) {
  appointment.status = "expired";
  await appointment.save();
}

///~~cancel-appointment~~
export async function cancelAppointment(appointmentId) {
  await connect();
  const appointment = await Appointment.findByIdAndUpdate(appointmentId, { status: "cancelled" });
  return appointment;
}

//~~markDone~~
export async function findByIdAndUpdate(appointmentId) {
  await connect();
  return await Appointment.findByIdAndUpdate(appointmentId, { status: "completed" } );
}

//~~auth
export async function getUserByEmail(email) {
  await connect();
  return await User.findOne({ email: email.toLowerCase() });
}