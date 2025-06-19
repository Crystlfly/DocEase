import mongoose from "mongoose";

console.log("✅ [MODEL] User schema file loaded");

const userSchema = new mongoose.Schema(
  {
    pid: {
      type: String,
      required: function () {
        const result = this.role?.toLowerCase() === "patient";
        console.log(`🔍 [User Schema] pid required? ${result}`);
        return result;
      },
    },
    did: {
      type: String,
      required: function () {
        const result = this.role?.toLowerCase() === "doctor";
        console.log(`🔍 [User Schema] did required? ${result}`);
        return result;
      },
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: true,
    },
    profileCompleted: {
      type: Boolean,
    },
    specialization: {
      type: String,
    },
    experience: {
      type: String,
    },
    address: {
      type: String,
    },
    about: {
      type: String,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

// ✅ Add partial indexes for unique pid/did
userSchema.index(
  { pid: 1 },
  { unique: true, partialFilterExpression: { pid: { $exists: true } } }
);
userSchema.index(
  { did: 1 },
  { unique: true, partialFilterExpression: { did: { $exists: true } } }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
console.log("✅ [MODEL] User model registered:", !!User);

export default User;
