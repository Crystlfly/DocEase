// /pages/api/appointment/markDone.js
import * as db from "@/db";


export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { appointmentId } = req.body;


  try {
    const result = await db.findByIdAndUpdate(appointmentId);

    if (!result) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    return res.status(200).json({ message: "Appointment marked as done" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}
