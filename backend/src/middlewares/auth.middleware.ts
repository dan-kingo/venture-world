import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    role: string;
  };
}


export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    next();
  };
};