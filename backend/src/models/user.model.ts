import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email?: string;
  phone?: string;
  role: "traveler" | "provider" | "admin";
  interests?: string[];
  status: "pending" | "approved" | "rejected";
  firebaseUid: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    role: { type: String, enum: ["traveler", "provider", "admin"], required: true },
    interests: [{ type: String }],
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
     firebaseUid: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export default User;
