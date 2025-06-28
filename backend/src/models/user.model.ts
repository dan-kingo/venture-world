import { Schema, model } from "mongoose";
import { IUser } from "../types/user";



const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    role: { type: String, enum: ["traveler", "provider", "admin"], required: true },
    interests: [{ type: String }],
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
     firebaseUid: { type: String, required: true, unique: true },
     expoPushToken: { type: String, default: null }
  },

  { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export default User;
