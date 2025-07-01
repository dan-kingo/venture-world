import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
export interface AuthRequest extends Request {
  user?: {
    _id: mongoose.Types.ObjectId;
    role: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
     res.status(401).json({ message: "Unauthorized" });
     return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET! || 'yoursecretkey') as { userId: string, role: string };
    req.user = { _id: new mongoose.Types.ObjectId(decoded.userId), role: decoded.role };
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};



export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
  console.log(req.user);
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    next();
  };
};