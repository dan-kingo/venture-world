import mongoose, { Schema, model, Document } from "mongoose";

export interface IExperience extends Document {
  title: string;
  description: string;
  image: string;
  price?: number;
  category: "AR site" | "eco-tour" | "heritage";
  provider: mongoose.Types.ObjectId; 
  status: "pending" | "approved" | "rejected";
}

const experienceSchema = new Schema<IExperience>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number },
    category: { type: String, enum: ["AR site", "eco-tour", "heritage"], required: true },
    provider: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

const Experience = model<IExperience>("Experience", experienceSchema);

export default Experience;
