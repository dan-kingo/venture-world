import { Router } from "express";
import { getMyProfile, savePushToken, setupProfile } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/me", authenticate, getMyProfile);
router.post("/auth/setup", authenticate, setupProfile);
router.post("/auth/push-token", authenticate, savePushToken);

export default router;
