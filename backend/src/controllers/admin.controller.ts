import { Request, Response } from "express";
import User from "../models/user.model";
import Experience from "../models/experience.model";
import { AuthRequest } from "../middlewares/auth.middleware";

/** 
 * @desc Get all pending providers
 * @route GET /api/admin/providers
 * @access Private (admin only)
 */
export const getPendingProviders = async (req: AuthRequest, res: Response) => {
  try {
    const providers = await User.find({ role: "provider", status: "pending" });
    res.json(providers);
  } catch (err) {
    console.error("Error fetching providers:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Approve a provider
 * @route PATCH /api/admin/providers/:id/approve
 * @access Private (admin only)
 */
export const approveProvider = async (req: AuthRequest, res: Response) => {
  try {
    const provider = await User.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!provider) {
      res.status(404).json({ message: "Provider not found" });
      return;
    }

    res.json({ message: "Provider approved", provider });
  } catch (err) {
    console.error("Error approving provider:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get all pending experiences
 * @route GET /api/admin/experiences
 * @access Private (admin only)
 */
export const getPendingExperiences = async (req: AuthRequest, res: Response) => {
  try {
    const experiences = await Experience.find({ status: "pending" }).populate("provider", "name");
    res.json(experiences);
  } catch (err) {
    console.error("Error fetching experiences:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Approve an experience
 * @route PATCH /api/admin/experiences/:id/approve
 * @access Private (admin only)
 */
export const approveExperience = async (req: AuthRequest, res: Response) => {
  try {
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!experience) {
      res.status(404).json({ message: "Experience not found" });
      return;
    }

    res.json({ message: "Experience approved", experience });
  } catch (err) {
    console.error("Error approving experience:", err);
    res.status(500).json({ message: "Server error" });
  }
};