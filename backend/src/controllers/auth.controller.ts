import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import { generateToken } from "../utils/jwt";

// Extend Express Request interface to include userId
declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}


export const register = async (req: Request, res: Response) => {
  const {
    name,
    email,
    password,
    role,
    interests,
    bio,
    location,
    description,
    photos,
    expoPushToken,
  } = req.body;

  console.log("Incoming registration:", { name, email, role });

  // Basic required fields
  if (!name || !role || !password) {
    console.warn("Missing required fields.");
     res.status(400).json({ message: "Name, role, and password are required." });
    return;
  }

  // Validate role value
  if (!["traveler", "provider", "admin"].includes(role)) {
    console.warn("Invalid role provided:", role);
     res.status(400).json({ message: "Invalid role." });
    return;
  }

  try {
    // Check for duplicate email
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.warn("Email already exists:", email);
         res.status(409).json({ message: "User with this email already exists." });
        return;
      }
    }

    // Traveler-specific validation
    if (role === "traveler") {
      if (!interests || !Array.isArray(interests) || interests.length === 0) {
        console.warn("Missing interests for traveler.");
         res.status(400).json({ message: "Interests are required for travelers." });
        return;
      }
    }

    // Provider-specific validation
    if (role === "provider") {
      if (!bio || !location || !description) {
        console.warn("Missing required fields for provider.");
         res.status(400).json({ message: "All provider fields are required." });
        return;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user object
    const newUser: any = {
      name,
      email,
      password: hashedPassword,
      role,
      expoPushToken,
    };

    if (role === "traveler") {
      newUser.interests = interests;
    }

    if (role === "provider") {
      newUser.bio = bio;
      newUser.location = location;
      newUser.description = description;
      newUser.photos = photos;
      newUser.status = "pending"; // Only providers get status
    }

    const user = await User.create(newUser);

    const token = generateToken(user._id.toString(), user.role);

    console.log("User registered successfully:", user._id);

    res.status(201).json({ token, user });
  } catch (err: any) {
    console.error("Registration error:", err);

    // Handle potential unique key errors gracefully
    if (err.code === 11000 && err.keyPattern?.email) {
       res.status(409).json({ message: "Email already exists." });
        return;
    }

    res.status(500).json({ message: "Registration failed. Please try again later." });
  }
};



export const login = async (req: Request, res: Response) => {
  const { email, password, expoPushToken } = req.body;

  if (!email || !password) {
     res.status(400).json({ message: "email and password are required." });
     return
  }

  try {
    const user = await User.findOne({ email }) as (typeof User.prototype & { _id: any, password: string, role: string, expoPushToken?: string });

    if (!user) {
       res.status(404).json({ message: "User not found." });
       return
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
       res.status(401).json({ message: "Invalid credentials." });
       return
    }

    if (expoPushToken) {
      user.expoPushToken = expoPushToken;
      await user.save();
    }

    const token = generateToken(user._id.toString(), user.role);
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Login failed.", error: err });
  }
}