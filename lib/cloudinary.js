import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

(async () => {
  try {
    const uploadResult = await cloudinary.uploader.upload(
      'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg',
      {
        public_id: 'shoes',
        folder: 'test-uploads', // Optional: folder to organize your uploads
      }
    );

    console.log("✅ Upload successful:");
    console.log(uploadResult);
  } catch (error) {
    console.error("❌ Upload failed:", error);
  }
})();
