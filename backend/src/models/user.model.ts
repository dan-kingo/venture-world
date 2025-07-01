import { Schema, model } from "mongoose";
import { IUser } from "../types/user";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ["traveler", "provider", "admin"], required: true },

    // Traveler-specific
    interests: [{ type: String }],

    // Provider-specific
    bio: { type: String },
    location: { type: String },
    description: { type: String },
    photos: [{ type: String }],

    expoPushToken: { type: String, default: null },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    delete ret.password;

    if (ret.role === "admin") {
      delete ret.name;
      delete ret.interests;
      delete ret.bio;
      delete ret.location;
      delete ret.description;
      delete ret.photos;
      delete ret.status;
    }

    if (ret.role === "traveler") {
      delete ret.bio;
      delete ret.location;
      delete ret.description;
      delete ret.photos;
      delete ret.status;
    }

    if (ret.role === "provider") {
      delete ret.interests;
    }

    return ret;
  },
});

const User = model<IUser>("User", userSchema);

export default User;
