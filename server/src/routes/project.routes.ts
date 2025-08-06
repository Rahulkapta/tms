import express from "express";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  updateProject,
} from "../controllers/project.controller";
import { verifyJWT } from "../config/middleware/auth.middleware";

const projectRoutes = express.Router();

projectRoutes
  .route("/")
  .post(verifyJWT, createProject)
  .get(verifyJWT, getAllProjects);
projectRoutes
  .route("/:projectId")
  .delete(verifyJWT, deleteProject)
  .get(verifyJWT, getProjectById)
  .patch(verifyJWT, updateProject);

export default projectRoutes;
