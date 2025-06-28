import { Router } from "express";

const router = Router();

/**
 * @desc Health check endpoint
 * @route GET /api/health
 * @access Public
 */
router.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Backend is running",
    timestamp: new Date().toISOString()
  });
});

export default router;