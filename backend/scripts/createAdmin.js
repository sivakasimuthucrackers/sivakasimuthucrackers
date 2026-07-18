import dotenv from "dotenv";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await Admin.findOne({
      email: "admin@sivakasimuthucrackers.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const admin = new Admin({
      name: "Admin",
      email: "admin@sivakasimuthucrackers.com",
      password: "Admin12345",
    });

    await admin.save();

    console.log("✅ Admin created successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createAdmin();