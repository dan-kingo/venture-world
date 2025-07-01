import { Router } from "express";
import {
  getPendingProviders,
  approveProvider,
  getPendingExperiences,
  approveExperience,
} from "../controllers/admin.controller";
import {  authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

router.get("/providers",authenticate, authorize(["admin"]), getPendingProviders);
router.patch("/providers/:id/approve", authenticate, authorize(["admin"]), approveProvider);

router.get("/experiences",authenticate, authorize(["admin"]), getPendingExperiences);
router.patch("/experiences/:id/approve",authenticate, authorize(["admin"]), approveExperience);

export default router;
