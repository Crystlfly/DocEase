import mongoose from "mongoose";

console.log("✅ [MODEL] User1 schema file loaded");

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
      // required: true,
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
)
userSchema.index(
  { pid: 1 },
  { unique: true, partialFilterExpression: { pid: { $exists: true } } }
);
userSchema.index(
  { did: 1 },
  { unique: true, partialFilterExpression: { did: { $exists: true } } }
);
// console.log("🧪 typeof mongoose.models:", typeof mongoose.models);
// console.log("🧪 mongoose.models keys:", mongoose.models ? Object.keys(mongoose.models) : 'undefined');
// console.log("🧪 mongoose.model User exists:", !!mongoose.models.User);
// console.log("mongose model test: ", mongoose.models.User1? "exists" : "does not exist");
const User = mongoose.models.User || mongoose.model("User", userSchema);
if(User){
  console.log("🔍 [MODEL] User model already exists, using existing model") ;
}else{
  console.log("🔍 [MODEL] Creating new User model");
}
console.log("✅ [MODEL] User model registered:", !!User);

export default User;
