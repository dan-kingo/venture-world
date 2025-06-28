import { Request, Response } from "express";
import User from "../models/user.model";
import { AuthRequest } from "../middlewares/auth.middleware";

/**
 * @desc Get current user's profile
 * @route GET /api/me
 * @access Private
 */
export const getMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user?.uid }).select("-__v");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Create or update user profile after first login
 * @route POST /api/auth/setup
 * @access Private
 */
export const setupProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, role, interests } = req.body;

    if (!name || !role) {
      res.status(400).json({ message: "Name and role are required" });
      return;
    }

    // Find existing user or create new
    let user = await User.findOne({ firebaseUid: req.user?.uid });

    if (!user) {
      user = new User({
        name,
        email,
        phone,
        role,
        interests,
        firebaseUid: req.user?.uid,
        status: role === "provider" ? "pending" : "approved",
      });
    } else {
      // Update existing user (optional)
      user.name = name;
      user.email = email;
      user.phone = phone;
      user.role = role;
      user.interests = interests;
    }

    await user.save();

    res.status(200).json({ message: "Profile saved", user });
  } catch (err) {
    console.error("Error setting up profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const savePushToken = async (req: AuthRequest, res: Response) => {
  try {
    const { expoPushToken } = req.body;

    if (!expoPushToken) {
      res.status(400).json({ message: "Expo push token is required" });
      return;
    }

    const user = await User.findOne({ firebaseUid: req.user?.uid });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.expoPushToken = expoPushToken;
    await user.save();

    res.json({ message: "Push token saved" });
  } catch (err) {
    console.error("Error saving push token:", err);
    res.status(500).json({ message: "Server error" });
  }
};