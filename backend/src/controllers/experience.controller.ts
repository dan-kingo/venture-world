import { Request, Response } from "express";
import Experience from "../models/experience.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import User from "../models/user.model";
import getRandomRating from "../utils/generateRating";
/**
 * @desc Provider submits new experience
 * @route POST /api/experiences
 * @access Private (provider only)
 */
export const createExperience = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description,location, price, category } = req.body;
  const fileUrl = req.file?.path || null;


    if (!title || !description || !req.file || !category || !req.body.location) {
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
      image: fileUrl, // Assuming req.file.path contains the uploaded image path
      price,
      location,
      rating: getRandomRating(), // Generate a random rating
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


export const getExperienceById = async (req: Request, res: Response) => {
  try {
    const experienceId = req.params.id;
    const experience = await Experience.findById(experienceId).populate("provider", "name");

    if (!experience) {
       res.status(404).json({ message: "Experience not found" });
       return
    }

    res.json(experience);
  } catch (err) {
    console.error("Error fetching experience:", err);
    res.status(500).json({ message: "Server error" });
  }
}