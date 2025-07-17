import mongoose from "mongoose";

console.log("✅ [MODEL] Appointment schema file loaded");

const appointmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // now pointing to User
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // also pointing to User
    required: false,
  },
  guestUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // also pointing to User
    required: false,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
  },
  status: {
    type: String,
    enum: ["upcoming", "completed", "cancelled"],
    default: "upcoming",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

console.log("🔧 [MODEL] Appointment schema defined with status enum:", appointmentSchema.path("status").enumValues);

const Appointment =
  mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);

console.log("✅ [MODEL] Appointment model registered:", !!Appointment);

export default Appointment;
