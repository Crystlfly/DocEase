import mongoose from "mongoose";

console.log("✅ [MODEL] userrole schema file loaded");

const userroleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  },
  { timestamps: true }
)
const Userrole = mongoose.models.Userrole || mongoose.model("Userrole", userroleSchema);
const isReused = !!mongoose.models.Userrole;
console.log(
  isReused
    ? "🔍 [MODEL] Reusing existing Userrole model"
    : "✅ [MODEL] Creating new Userrole model"
);
console.log("✅ [MODEL] userrole model registered:", !!Userrole);

export default Userrole;
