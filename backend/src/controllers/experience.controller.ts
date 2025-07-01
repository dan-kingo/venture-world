import { Request, Response } from "express";
import Experience from "../models/experience.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import User from "../models/user.model";

/**
 * @desc Provider submits new experience
 * @route POST /api/experiences
 * @access Private (provider only)
 */
export const createExperience = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, price, category } = req.body;

    if (!title || !description || !req.file || !category) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Find the user by Firebase UID
    const user = await User.findOne({ _id: req.user?._id });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const experience = new Experience({
      title,
      description,
      image: `/uploads/${req.file.filename}`, // Assuming req.file.path contains the uploaded image path
      price,
      category,
      provider: user._id, // Use MongoDB ObjectId
      status: "pending",
    });

    await experience.save();

    res.status(201).json({ message: "Experience submitted for review", experience });
  } catch (err) {
    console.error("Error creating experience:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get all approved experiences (public)
 * @route GET /api/experiences
 */
export const getApprovedExperiences = async (req: Request, res: Response) => {
  try {
    const experiences = await Experience.find({ status: "approved" }).populate("provider", "name");

    res.json(experiences);
  } catch (err) {
    console.error("Error fetching experiences:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Provider views their own experiences
 * @route GET /api/experiences/mine
 * @access Private (provider only)
 */
export const getMyExperiences = async (req: AuthRequest, res: Response) => {
  try {
    // Find the user by Firebase UID
    const user = await User.findOne({ _id: req.user?._id });
    
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const experiences = await Experience.find({ provider: user._id });

    res.json(experiences);
  } catch (err) {
    console.error("Error fetching experiences:", err);
    res.status(500).json({ message: "Server error" });
  }
};