import * as db from "@/db";

// Connect to MongoDB
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {


    // Fetch all doctors
    const doctors = await db.fetchDoctors();
    const doctorNames = doctors.map(doc => doc.name).join(", ");
    const count = doctors.length;

    const reply = count === 0
      ? "Sorry, no doctors are available right now."
      : `There ${count === 1 ? "is" : "are"} ${count} doctor${count > 1 ? "s" : ""} available: ${doctorNames}`;

    return res.status(200).json({
      fulfillmentText: reply,
    });
  } catch (error) {
    console.error("❌ Error fetching doctors:", error);
    return res.status(500).json({
      fulfillmentText: "Sorry, I couldn't fetch the doctor data right now.",
    });
  }
}
