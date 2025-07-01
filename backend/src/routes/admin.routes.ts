import { Router } from "express";
import {
  getPendingProviders,
  approveProvider,
  getPendingExperiences,
  approveExperience,
} from "../controllers/admin.controller";
import {  authorize } from "../middlewares/auth.middleware";

const router = Router();

router.get("/providers", authorize(["admin"]), getPendingProviders);
router.patch("/providers/:id/approve", authorize(["admin"]), approveProvider);

router.get("/experiences", authorize(["admin"]), getPendingExperiences);
router.patch("/experiences/:id/approve", authorize(["admin"]), approveExperience);

export default router;
