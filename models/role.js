import mongoose from "mongoose";

console.log("✅ [MODEL] roles schema file loaded");

const roleSchema = new mongoose.Schema(
  {
    role: {
      type: String,
    },
  }
)
const Role = mongoose.models.Role || mongoose.model("Role", roleSchema);
if(Role){
  console.log("🔍 [MODEL] role model already exists, using existing model") ;
}else{
  console.log("🔍 [MODEL] Creating new role model");
}
console.log("✅ [MODEL] role model registered:", !!Role);

export default Role;
