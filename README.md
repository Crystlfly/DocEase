# DocEase – Doctor Appointment Platform

DocEase is a full-stack doctor appointment platform built with **Next.js**.  
It allows doctors and patients to register, book appointments, manage schedules, and more.

---

## Features
- Role-based login (Doctor / Patient / Admin)
- Appointment booking & management
- Google OAuth login
- Cloudinary image uploads
- Email notifications

---

##  Tech Stack
- **Frontend & Backend**: Next.js (API routes in `pages/api`)
- **Database**: MongoDB
- **Auth**: NextAuth.js
- **Image Hosting**: Cloudinary
- **Email**: Resend API / Gmail

---

##  Installation

### 1. Clone the repository
git clone https://github.com/Crystlfly/docease.git
cd docease

###2. Install dependencies
npm install

###3. Set up environment variables
Create a file named .env.local in the root folder and copy the format from .env.example:

```
MongoDB connection string (Local or Atlas)
MONGODB_URI=your_mongodb_connection_string

Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

NextAuth configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

 Cloudinary configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

 JWT configuration
JWT_SECRET=your_jwt_secret

 Admin credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin

 Email service credentials
EMAIL_USER=youremail@example.com
EMAIL_PASS=your_email_password

 Resend API Key
RESEND_API_KEY=your_resend_api_key

 Google OAuth Refresh Token for email sending (if applicable)
REFRESH_TOKEN=your_google_refresh_token
```

### 4. Start MongoDB locally
Make sure MongoDB is running:

  mongod
Or use MongoDB Atlas and replace MONGODB_URI with your connection string.

### 5. Run the development server
npm run dev
Open http://localhost:3000 in your browser.
