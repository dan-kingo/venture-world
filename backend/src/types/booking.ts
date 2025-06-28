import mongoose, { Document } from "mongoose";

export interface IBooking extends Document {
  experience: mongoose.Types.ObjectId; 
  traveler: mongoose.Types.ObjectId;
  status: "pending" | "confirmed";
}