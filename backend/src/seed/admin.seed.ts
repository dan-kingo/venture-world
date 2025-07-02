import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/user.model";

dotenv.config();

const seedAdmin = async () => {
  const adminEmail = "admin@example.com";
  const adminPassword = "admin123";

  try {
    await mongoose.connect(process.env.MONGO_URI_LOCAL!);
    console.log("✅ Database connected.");

    const existingAdmin = await User.findOne({ email: adminEmail, role: "admin" });
    if (existingAdmin) {
      console.log("✅ Admin user already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await User.create({
      name: "Admin User",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    console.log("🎉 Admin user created successfully.");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to seed admin user:", err);
    process.exit(1);
  }
};

seedAdmin();