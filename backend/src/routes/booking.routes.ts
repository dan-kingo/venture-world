import { Router } from "express";
import {  authenticate, authorize } from "../middlewares/auth.middleware";
import { createBooking, getMyBookings, confirmBooking, cancelBooking } from "../controllers/booking.controller";

const router = Router();

router.post("/bookings",authenticate,  authorize(["traveler"]), createBooking);
router.get("/bookings/mine",authenticate,  authorize(["traveler"]), getMyBookings);
router.put("/bookings/:id", authenticate, authorize(["traveler"]), cancelBooking); // Assuming this is for updating a booking
router.patch("/bookings/:id/confirm", authenticate, authorize(["admin"]), confirmBooking);

export default router;