import { Router } from "express";
import { 
  createExperience, 
  getApprovedExperiences, 
  getExperienceById, 
  getMyExperiences,
  updateExperience,
  deleteExperience
} from "../controllers/experience.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import cloudinaryUpload from "../middlewares/upload.middleware";

const router = Router();

router.post("/experiences", authenticate, authorize(["provider"]), cloudinaryUpload.single("image"), createExperience);
router.get("/experiences", getApprovedExperiences);
router.get("/experiences/mine", authenticate, authorize(["provider"]), getMyExperiences);
router.get("/experiences/:id", getExperienceById);
router.put("/experiences/:id", authenticate, authorize(["provider"]), updateExperience);
router.delete("/experiences/:id", authenticate, authorize(["provider"]), deleteExperience);

export default router;