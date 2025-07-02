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
    const { title, description, location, price, category } = req.body;
    const fileUrl = req.file?.path || null;

    if (!title || !description || !req.file || !category || !location) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Find the user by ID
    const user = await User.findById(req.user?._id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.status !== 'approved') {
      res.status(403).json({ message: "Provider must be approved to create experiences" });
      return;
    }

    const experience = new Experience({
      title,
      description,
      image: fileUrl,
      price: parseFloat(price),
      location,
      rating: getRandomRating(),
      category,
      provider: user._id,
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
    // Find the user by ID
    const user = await User.findById(req.user?._id);
    
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const experiences = await Experience.find({ provider: user._id });
    res.json({ experiences });
  } catch (err) {
    console.error("Error fetching experiences:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get experience by ID
 * @route GET /api/experiences/:id
 */
export const getExperienceById = async (req: Request, res: Response) => {
  try {
    const experienceId = req.params.id;
    const experience = await Experience.findById(experienceId).populate("provider", "name");

    if (!experience) {
      res.status(404).json({ message: "Experience not found" });
      return;
    }

    res.json(experience);
  } catch (err) {
    console.error("Error fetching experience:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Update experience
 * @route PUT /api/experiences/:id
 * @access Private (provider only)
 */
export const updateExperience = async (req: AuthRequest, res: Response) => {
  try {
    const experienceId = req.params.id;
    const { title, description, location, price, category } = req.body;

    const experience = await Experience.findById(experienceId);
    
    if (!experience) {
      res.status(404).json({ message: "Experience not found" });
      return;
    }

    // Check if user owns this experience
    if (experience.provider.toString() !== req.user?._id.toString()) {
      res.status(403).json({ message: "Not authorized to update this experience" });
      return;
    }

    const updatedExperience = await Experience.findByIdAndUpdate(
      experienceId,
      {
        title,
        description,
        location,
        price: parseFloat(price),
        category,
        status: "pending" // Reset to pending when updated
      },
      { new: true }
    );

    res.json({ message: "Experience updated successfully", experience: updatedExperience });
  } catch (err) {
    console.error("Error updating experience:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Delete experience
 * @route DELETE /api/experiences/:id
 * @access Private (provider only)
 */
export const deleteExperience = async (req: AuthRequest, res: Response) => {
  try {
    const experienceId = req.params.id;

    const experience = await Experience.findById(experienceId);
    
    if (!experience) {
      res.status(404).json({ message: "Experience not found" });
      return;
    }

    // Check if user owns this experience
    if (experience.provider.toString() !== req.user?._id.toString()) {
      res.status(403).json({ message: "Not authorized to delete this experience" });
      return;
    }

    await Experience.findByIdAndDelete(experienceId);

    res.json({ message: "Experience deleted successfully" });
  } catch (err) {
    console.error("Error deleting experience:", err);
    res.status(500).json({ message: "Server error" });
  }
};