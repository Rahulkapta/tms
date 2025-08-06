import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.model";
import { Role } from "../../models/role.model";
import { UserRepository } from "../../repositories/user.repository";
const userRepository = new UserRepository();

// Optional: Extend Express Request to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any; // Consider using a specific IUser type if you have one
    }
  }
}

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from cookie or Authorization header
    const token =
      req.cookies?.access_token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Access token missing" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);

    // Get user from database
    const user = await userRepository.findById((decoded as any)._id);
    

    if (!user) {
      return res.status(401).json({ message: "Invalid access token" });
    }

    // Attach user to request for future handlers
    req.user = user;
    next();
  } catch (error: any) {
    console.error("JWT Error:", error.message);
    res.status(401).json({
      message: "Authentication failed",
      error: error.message,
    });
  }
};

export const isAllowedRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const roleId = req.user?.roleId;
  const role = await Role.findById(roleId);
  const allowedRoles = ["SUPER ADMIN", "ADMIN", "EMPLOYEE"];
  if (!role || !allowedRoles.includes(role.name)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
