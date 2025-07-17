import mongoose from 'mongoose';

const guestUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
},
{ timestamps: true });

const GuestUser = mongoose.models.GuestUser || mongoose.model('GuestUser', guestUserSchema);
export default GuestUser;
