import * as db from "@/db";
import { logger } from "@/lib/logger";

export default async function handler(req,res){
    try {
    const {  email, doctorId, date, time, reason } = req.body;

    // Step 1: Check if guest already exists
    let guest = await db.find_guest_user(email);

    if (!guest) {
      guest = await db.create_guest_user(email);
    }

    // Step 2: Create appointment using guestUserId
    const appointment = await db.create_guest_appointment(
      guest._id,
      doctorId,
      date,
      time,
      reason,
    );

    return res.status(200).json({ success: true, appointment });
  } catch (error) {
    console.error('Guest Booking Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}