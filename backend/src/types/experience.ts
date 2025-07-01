import mongoose, { Document } from "mongoose";

export interface IExperience extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  image: string;
  price?: number;
  category: "AR site" | "eco-tour" | "heritage";
  provider: mongoose.Types.ObjectId; 
  status: "pending" | "approved" | "rejected";
}