import { Router } from "express";
import {
  register,
  login,
  getMyProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  savePushToken,
} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/reset-password", resetPassword);

// Protected routes
router.get("/auth/me", authenticate, getMyProfile);
router.put("/auth/profile", authenticate, updateProfile);
router.put("/auth/change-password", authenticate, changePassword);
router.post("/auth/push-token", authenticate, savePushToken);

export default router;