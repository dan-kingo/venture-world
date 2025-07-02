import { Router } from "express";
import {  authenticate, authorize } from "../middlewares/auth.middleware";
import { createBooking, getMyBookings, confirmBooking } from "../controllers/booking.controller";

const router = Router();

router.post("/bookings",authenticate,  authorize(["traveler"]), createBooking);
router.get("/bookings/mine",authenticate,  authorize(["traveler"]), getMyBookings);
router.patch("/bookings/:id/confirm", authenticate, authorize(["admin"]), confirmBooking);

export default router;