import multer from "multer";
import path from "path";
import { Request } from "express";
// Storage configuration for local uploads
const storage = multer.diskStorage({
  destination: (req:Request, file, cb) => {
    cb(null, "uploads/"); // Local uploads folder (ensure it exists)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// File filter (optional, to allow only images)
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

export const upload = multer({ storage, fileFilter });
