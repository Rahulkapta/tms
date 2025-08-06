import express from "express";

import {
  loginUserController,
  registerUser,
} from "../controllers/auth.controller";
import { verifyJWT } from "../config/middleware/auth.middleware";

const authRoutes = express.Router();

authRoutes.post("/login", loginUserController);
authRoutes.route("/register").post(verifyJWT, registerUser);

export default authRoutes;
