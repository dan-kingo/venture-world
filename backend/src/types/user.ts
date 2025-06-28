
import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email?: string;
  phone?: string;
  role: "traveler" | "provider" | "admin";
  interests?: string[];
  status: "pending" | "approved" | "rejected";
  firebaseUid: string;
  expoPushToken?: string;
}