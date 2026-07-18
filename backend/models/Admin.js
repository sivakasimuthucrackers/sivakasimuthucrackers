import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    name: String,

    email: {
      type: String,
      unique: true,
    },

    password: String,

    role: {
      type: String,
      default: "admin",
    }
  },
  {
    timestamps: true,
  }
);

adminSchema.pre("save", async function () {

    if(!this.isModified("password")) return;

    this.password=await bcrypt.hash(this.password,10);

});

adminSchema.methods.comparePassword=function(password){

    return bcrypt.compare(password,this.password);

}

export default mongoose.model("Admin",adminSchema);