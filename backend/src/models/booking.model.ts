import { Schema, model } from "mongoose";
import { IBooking } from "../types/booking";

const bookingSchema = new Schema<IBooking>(
  {
    experience: { type: Schema.Types.ObjectId, ref: "Experience", required: true },
    traveler: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

const Booking = model<IBooking>("Booking", bookingSchema);

export default Booking;