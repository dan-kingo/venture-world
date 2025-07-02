import { Router } from "express";
import { createExperience, getApprovedExperiences, getExperienceById, getMyExperiences } from "../controllers/experience.controller";
import {  authenticate, authorize } from "../middlewares/auth.middleware";
import { upload } from "../utils/upload";
import cloudinaryUpload from "../middlewares/upload.middleware";

const router = Router();

router.post("/experiences", authenticate,  authorize(["provider"]), cloudinaryUpload.single("image"), createExperience);
router.get("/experiences", getApprovedExperiences);
router.get("/experiences/mine",authenticate, authorize(["provider"]), getMyExperiences);
router.get("/experiences/:id", getExperienceById); // Assuming this is to get a specific experience by ID

export default router;
