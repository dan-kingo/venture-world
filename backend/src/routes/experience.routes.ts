import { Router } from "express";
import { createExperience, getApprovedExperiences, getMyExperiences } from "../controllers/experience.controller";
import {  authenticate, authorize } from "../middlewares/auth.middleware";
import { upload } from "../utils/upload";

const router = Router();

router.post("/experiences", authenticate,  authorize(["provider"]), upload.single("image"), createExperience);
router.get("/experiences", getApprovedExperiences);
router.get("/experiences/mine",authenticate, authorize(["provider"]), getMyExperiences);

export default router;
