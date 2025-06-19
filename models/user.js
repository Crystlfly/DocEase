import mongoose from "mongoose";
console.log("✅ User model loaded");

const userSchema = new mongoose.Schema(
  {
    pid: {
      type: String,
      required: function () {
        return this.role.toLowerCase() === "patient";
      },
    },
    did: {
      type: String,
      required: function () {
        return this.role.toLowerCase() === "doctor";
      },
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    // gender: String,
    // dateOfBirth: Date,
    profileImage: { type: String, required: true },
    profileCompleted: {type:Boolean},
  specialization: {type:String},   // ✅ must be in schema
  experience: {type:String},       // ✅
  address: {type:String},          // ✅
  about:{type: String},
  },
  {
    collection: "users",
    timestamps: true,
  }
);

// ✅ Add partial indexes for unique pid/did
userSchema.index({ pid: 1 }, { unique: true, partialFilterExpression: { pid: { $exists: true } } });
userSchema.index({ did: 1 }, { unique: true, partialFilterExpression: { did: { $exists: true } } });

export default mongoose.models.User || mongoose.model("User", userSchema);
