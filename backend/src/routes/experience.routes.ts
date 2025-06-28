import { Router } from "express";
import { createExperience, getApprovedExperiences, getMyExperiences } from "../controllers/experience.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

router.get("/experiences", getApprovedExperiences);
router.post("/experiences", authenticate, authorize(["provider"]), createExperience);
router.get("/experiences/mine", authenticate, authorize(["provider"]), getMyExperiences);

export default router;
