import { Router } from "express";
import { verifyJWT } from "../config/middleware/auth.middleware";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from "../controllers/ticket.controller";

const taskRoutes = Router({ mergeParams: true });

taskRoutes
  .route("/")
  .post(verifyJWT, createTask)
  .get(verifyJWT, getAllTasks);
taskRoutes
  .route("/:taskId")
  .get(verifyJWT, getTaskById)
  .delete(verifyJWT, deleteTask)
  .patch(verifyJWT, updateTask);
export default taskRoutes;
