import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import { generateToken } from "../utils/jwt";
import { AuthRequest } from "../middlewares/auth.middleware";

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
    expoPushToken,
  } = req.body;

  console.log("Incoming registration:", { name, email, role });

  if (!name || !role || !password) {
     res.status(400).json({ message: "Name, role, and password are required." });
     return
  }

  if (!["traveler", "provider", "admin"].includes(role)) {
     res.status(400).json({ message: "Invalid role." });
     return
  }

  try {
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         res.status(409).json({ message: "User with this email already exists." });
         return
      }
    }

    if (role === "traveler") {
      if (!interests || !Array.isArray(interests) || interests.length === 0) {
         res.status(400).json({ message: "Interests are required for travelers." });
         return
      }
    }

    if (role === "provider") {
      if (!bio || !location || !description) {
         res.status(400).json({ message: "All provider fields are required." });
         return
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
      const photos = (req.files as Express.Multer.File[] || []).map(file => `/uploads/${file.filename}`);
      newUser.bio = bio;
      newUser.location = location;
      newUser.description = description;
      newUser.photos = photos;
      newUser.status = "pending";
    }

    const user = await User.create(newUser);
    const token = generateToken(user._id.toString(), user.role);

    res.status(201).json({ token, user });
  } catch (err: any) {
    console.error("Registration error:", err);
    if (err.code === 11000 && err.keyPattern?.email) {
       res.status(409).json({ message: "Email already exists." });
       return
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

/**
 * @desc Update user profile
 * @route PUT /api/auth/profile
 * @access Private
 */
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, interests, bio, location, description } = req.body;

    const user = await User.findById(req.user?._id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Update fields based on user role
    if (name) user.name = name;
    if (email) user.email = email;
    
    if (user.role === 'traveler' && interests) {
      user.interests = interests;
    }
    
    if (user.role === 'provider') {
      if (bio) user.bio = bio;
      if (location) user.location = location;
      if (description) user.description = description;
    }

    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get current user profile
 * @route GET /api/auth/me
 * @access Private
 */
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).select('-password');
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (err) {
    console.error("Error getting profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};