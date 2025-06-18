const DoctorSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  // ... other fields
  profileCompleted: {
    type: Boolean,
    default: false,
  },
});
