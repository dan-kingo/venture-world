import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import User from "../models/user.model";

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), 
  });
}

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    role: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing or invalid token" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    const user = await User.findOne({ _id: decodedToken.uid });

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = {
      uid: user._id.toString(), // Use MongoDB ObjectId as string
      role: user.role,
    };

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    next();
  };
};