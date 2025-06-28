import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "traveler" | "provider" | "admin";
  interests?: string[];
  status: "pending" | "approved" | "rejected";
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  expoPushToken?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}