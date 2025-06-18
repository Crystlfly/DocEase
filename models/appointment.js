import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // now pointing to User
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // also pointing to User
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time:{
    type: String,
    required: true,
  },
  reason: String,
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

const Appointment =
  mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);

export default Appointment;
