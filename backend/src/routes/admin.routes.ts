import { Router } from "express";
import {
  getProviders,
  approveProvider,
  rejectProvider,
  getExperiences,
  approveExperience,
  rejectExperience,
  getUsers,
  getBookings,
  sendNotification,
} from "../controllers/admin.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Provider routes
router.get("/providers", authenticate, authorize(["admin"]), getProviders);
router.patch("/providers/:id/approve", authenticate, authorize(["admin"]), approveProvider);
router.patch("/providers/:id/reject", authenticate, authorize(["admin"]), rejectProvider);

// Experience routes
router.get("/experiences", authenticate, authorize(["admin"]), getExperiences);
router.patch("/experiences/:id/approve", authenticate, authorize(["admin"]), approveExperience);
router.patch("/experiences/:id/reject", authenticate, authorize(["admin"]), rejectExperience);

// User routes
router.get("/users", authenticate, authorize(["admin"]), getUsers);

// Booking routes
router.get("/bookings", authenticate, authorize(["admin"]), getBookings);

// Notification routes
router.post("/notifications", authenticate, authorize(["admin"]), sendNotification);

export default router;