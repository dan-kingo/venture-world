import { Router } from "express";
import { getMyProfile, setupProfile } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/me", authenticate, getMyProfile);
router.post("/auth/setup", authenticate, setupProfile);

export default router;
