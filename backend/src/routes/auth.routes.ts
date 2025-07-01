import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { upload } from "../utils/upload";

const router = Router();

router.post("/register", upload.array("photos", 2), register);
router.post("/login", login);

export default router;