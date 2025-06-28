import { Request, Response } from "express";
import Experience from "../models/experience.model";
import { AuthRequest } from "../middlewares/auth.middleware";

/**
 * @desc Provider submits new experience
 * @route POST /api/experiences
 * @access Private (provider only)
 */
export const createExperience = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, image, price, category } = req.body;

    if (!title || !description || !image || !category) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const experience = new Experience({
      title,
      description,
      image,
      price,
      category,
      provider: req.user?.id,
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
    const experiences = await Experience.find({ provider: req.user?.id });

    res.json(experiences);
  } catch (err) {
    console.error("Error fetching experiences:", err);
    res.status(500).json({ message: "Server error" });
  }
};