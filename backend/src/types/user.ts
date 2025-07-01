import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  _id:mongoose.Types.ObjectId;
  email?: string;
  role: "traveler" | "provider" | "admin";
  interests?: string[];
  status?: "pending" | "approved" | "rejected";
  password: string;
  bio?: string;
  location?: string;
  description?: string;
  photos?: string[];
  expoPushToken?: string;
}