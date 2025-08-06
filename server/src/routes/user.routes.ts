import express from "express";
import { verifyJWT } from "../config/middleware/auth.middleware";
import { getAllUserWithDetails } from "../controllers/auth.controller";

// --- Router for user-related API endpoints ---
const userRoutes = express.Router();

// GET /users
// Protected route: returns all users with detailed info
userRoutes.route("/").get(verifyJWT, getAllUserWithDetails);

export default userRoutes;
