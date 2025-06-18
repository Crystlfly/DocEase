// pages/api/doc/complete-profile.js

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user";
import { logger } from "@/lib/logger";

// 1. Disable default body parser (required for multer)
export const config = {
  api: {
    bodyParser: false,
  },
};

// 2. Set up multer to use memory storage
const upload = multer({ storage: multer.memoryStorage() });

// 3. Middleware wrapper
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

// 4. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 5. Main handler
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Run multer to process file
    await runMiddleware(req, res, upload.single("image"));

    const { email, specialization, experience, address, about } = req.body;

    if (!email || !specialization || !experience || !address || !about) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await connectToDatabase();

    let profileImage = "";

    // 6. Upload image to Cloudinary if present
    if (req.file) {
      const buffer = req.file.buffer;
      const base64 = buffer.toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${base64}`;

      const cloudRes = await cloudinary.uploader.upload(dataURI, {
        folder: "doctor-profiles",
      });

      profileImage = cloudRes.secure_url;
    }

    // 7. Update user
    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase(), role: "doctor" },
      {
        specialization,
        experience,
        address,
        about,
        profileImage,
        profileCompleted: true,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedUser) {
      logger.error(`Doctor not found for email: ${email}`);
      return res.status(404).json({ message: "Doctor not found" });
    }

    logger.success(`✅ Profile completed for: ${email}`);
    return res.status(200).json({ message: "Profile completed", user: updatedUser });
  } catch (error) {
    logger.error("❌ Profile completion error: " + error.message);
    return res.status(500).json({ message: "Server error" });
  }
}
