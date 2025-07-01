import { Router } from "express";
import {  authorize } from "../middlewares/auth.middleware";
import { createBooking, getMyBookings } from "../controllers/booking.controller";

const router = Router();

router.post("/bookings",  authorize(["traveler"]), createBooking);
router.get("/bookings/mine",  authorize(["traveler"]), getMyBookings);

export default router;
