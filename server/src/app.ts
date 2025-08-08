import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { HTTP_STATUS_CODE } from "./utils/common.utils";
import {
  postRequestLogger,
  preRequestLogger,
} from "./config/middleware/logger.middleware";
import authRoutes from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import projectRoutes from "./routes/project.routes";
import taskRoutes from "./routes/ticket.routes";
import commentRoutes from "./routes/comment.routes";
import userRoutes from "./routes/user.routes";
import notificationRoutes from "./routes/notification.routes";
// Load environment variables from .env file
dotenv.config();

const app: Application = express();

// Middleware
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", preRequestLogger, authRoutes, postRequestLogger);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/:projectId/tasks", taskRoutes);
app.use("/api/v1/:ticketId/comments", commentRoutes);

// To check the health of server : https://{domain}/health-check
app.use("/health-check", (req, res) => {
  console.log("Health check endpoint hit");
  return res.status(200).json({
    error: null,
    message: "API is working!",
    data: "API is working!",
    httpStatus: HTTP_STATUS_CODE.OK,
  });
});

// Handling unhandled routes
app.use((req: Request, res: Response) => {
  return res.status(404).json({
    error: "Route not found",
    message: null,
    httpStatus: 404,
    data: null,
  });
});

export default app;
