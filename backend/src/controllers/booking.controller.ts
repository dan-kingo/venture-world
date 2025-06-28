import { Request, Response } from "express";
import Booking from "../models/booking.model";
import Experience from "../models/experience.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import User from "../models/user.model";
import { sendExpoNotification } from "../utils/expoNotification";

/**
 * @desc Traveler submits booking
 * @route POST /api/bookings
 * @access Private (traveler only)
 */
export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { experienceId } = req.body;

    if (!experienceId) {
      res.status(400).json({ message: "Experience ID is required" });
      return;
    }

    const experience = await Experience.findById(experienceId);

    if (!experience || experience.status !== "approved") {
      res.status(400).json({ message: "Invalid or unapproved experience" });
      return;
    }

    // Find the user by Firebase UID
    const user = await User.findOne({ firebaseUid: req.user?.uid });
    
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const booking = new Booking({
      experience: experienceId,
      traveler: user._id, // Use MongoDB ObjectId
      status: "pending",
    });

    await booking.save();

    // Notify the provider
    const provider = await User.findById(experience.provider);

    if (provider?.expoPushToken) {
      await sendExpoNotification(
        provider.expoPushToken,
        "New Booking Received",
        `Someone has submitted a booking for your experience: ${experience.title}`
      );
    }

    res.status(201).json({ message: "Booking submitted", booking });
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Traveler views their bookings
 * @route GET /api/bookings/mine
 * @access Private (traveler only)
 */
export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    // Find the user by Firebase UID
    const user = await User.findOne({ firebaseUid: req.user?.uid });
    
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const bookings = await Booking.find({ traveler: user._id })
      .populate("experience", "title category")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
};