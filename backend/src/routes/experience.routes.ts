import { Router } from "express";
import { createExperience, getApprovedExperiences, getMyExperiences } from "../controllers/experience.controller";
import {  authorize } from "../middlewares/auth.middleware";

const router = Router();

router.get("/experiences", getApprovedExperiences);
router.post("/experiences",  authorize(["provider"]), createExperience);
router.get("/experiences/mine", authorize(["provider"]), getMyExperiences);

export default router;
