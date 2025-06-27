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
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    const user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      uid: user.firebaseUid, 
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
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
