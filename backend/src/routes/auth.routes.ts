import { Router } from "express";
import { register, login, updateProfile, getProfile } from "../controllers/auth.controller";
import { upload } from "../utils/upload";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", upload.array("photos", 2), register);
router.post("/login", login);
router.put("/profile", authenticate, updateProfile);
router.get("/me", authenticate, getProfile);

export default router;