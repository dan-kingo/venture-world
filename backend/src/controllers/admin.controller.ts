import { Request, Response } from "express";
import User from "../models/user.model";
import Experience from "../models/experience.model";
import Booking from "../models/booking.model";
import { AuthRequest } from "../middlewares/auth.middleware";

/** 
 * @desc Get all providers
 * @route GET /api/admin/providers
 * @access Private (admin only)
 */
export const getProviders = async (req: AuthRequest, res: Response) => {
  try {
    const providers = await User.find({ role: "provider" }).select('-password');
    res.json({ providers });
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
    ).select('-password');

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
 * @desc Reject a provider
 * @route PATCH /api/admin/providers/:id/reject
 * @access Private (admin only)
 */
export const rejectProvider = async (req: AuthRequest, res: Response) => {
  try {
    const provider = await User.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    ).select('-password');

    if (!provider) {
      res.status(404).json({ message: "Provider not found" });
      return;
    }

    res.json({ message: "Provider rejected", provider });
  } catch (err) {
    console.error("Error rejecting provider:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get all experiences
 * @route GET /api/admin/experiences
 * @access Private (admin only)
 */
export const getExperiences = async (req: AuthRequest, res: Response) => {
  try {
    const experiences = await Experience.find().populate("provider", "name email");
    res.json({ experiences });
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
    ).populate("provider", "name email");

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

/**
 * @desc Reject an experience
 * @route PATCH /api/admin/experiences/:id/reject
 * @access Private (admin only)
 */
export const rejectExperience = async (req: AuthRequest, res: Response) => {
  try {
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    ).populate("provider", "name email");

    if (!experience) {
      res.status(404).json({ message: "Experience not found" });
      return;
    }

    res.json({ message: "Experience rejected", experience });
  } catch (err) {
    console.error("Error rejecting experience:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get all users
 * @route GET /api/admin/users
 * @access Private (admin only)
 */
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get all bookings
 * @route GET /api/admin/bookings
 * @access Private (admin only)
 */
export const getBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find()
      .populate("experience", "title")
      .populate("traveler", "name email");
    res.json({ bookings });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Send notification
 * @route POST /api/admin/notifications
 * @access Private (admin only)
 */
export const sendNotification = async (req: AuthRequest, res: Response) => {
  try {
    const { title, message, type, target } = req.body;

    if (!title || !message || !type || !target) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Here you would implement your notification logic
    // For now, we'll just simulate success
    console.log("Notification sent:", { title, message, type, target });

    res.json({ message: "Notification sent successfully" });
  } catch (err) {
    console.error("Error sending notification:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Confirm a booking
 * @route PATCH /api/admin/bookings/:id/confirm
 * @access Private (admin only)
 */
export const confirmBooking = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "confirmed" },
      { new: true }
    ).populate("experience", "title")
     .populate("traveler", "name email");

    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    res.json({ message: "Booking confirmed", booking });
  } catch (err) {
    console.error("Error confirming booking:", err);
    res.status(500).json({ message: "Server error" });
  }
};