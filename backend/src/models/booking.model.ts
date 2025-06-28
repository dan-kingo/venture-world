import mongoose, { Schema, model, Document } from "mongoose";

export interface IBooking extends Document {
  experience: mongoose.Types.ObjectId; 
  traveler: mongoose.Types.ObjectId;
  status: "pending" | "confirmed";
}

const bookingSchema = new Schema<IBooking>(
  {
    experience: { type: Schema.Types.ObjectId, ref: "Experience", required: true },
    traveler: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "confirmed"], default: "pending" },
  },
  { timestamps: true }
);

const Booking = model<IBooking>("Booking", bookingSchema);

export default Booking;
