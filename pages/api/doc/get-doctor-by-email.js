import * as db from "@/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { email } = req.body;

  try {
    const doctor = await db.getDoctorByEmail(email);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.status(200).json({ doctor });
  } catch (error) {
    console.error("Error in get-doctor-by-email API:", error);
    res.status(500).json({ message: "Server error" });
  }
}
