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
  const { name, email, role, password, expoPushToken, interests } = req.body;

  console.log("Register request body:", req.body);

  if (!name || !role || !password) {
    console.log("Missing required fields");
     res.status(400).json({ message: "Name, role, and password are required." });
     return
  }

  try {
    console.log("Checking if user already exists with email:", email);
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("User already exists:", existingUser);
       res.status(409).json({ message: "User with this email already exists." });
       return
    }

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Creating new user...");
    const user = await User.create({
      name,
      email,
      role,
      password: hashedPassword,
      expoPushToken,
      interests
    }) as typeof User.prototype;

    console.log("User created successfully:", user);

    const token = generateToken(user._id.toString(), user.role);
    console.log("JWT token generated");

    res.status(201).json({ token, user });
  } catch (err: any) {
    console.error("Registration failed:", err);
    res.status(500).json({ message: "Registration failed.", error: err.message || err });
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