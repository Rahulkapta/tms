import { NextFunction, Request, Response } from "express";
import {
  createProjectService,
  deleteProjectService,
  getAllProjectsService,
  getProjectByIdService,
  updateProjectService,
} from "../services/v1/project.service";

export const createProject = async (req: Request, res: Response) => {
  try {
    const response = await createProjectService(req);
    return res.status(response.httpStatus).json({
      message: response.message,
      data: response.data,
      error: response.error,
    });
  } catch (error: any) {
    console.error("Project creation Error:", error);
    return res.status(500).json({
      message: "Unexpected error during project creation.",
      error: error.message || "Internal server error",
      data: null,
    });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const result = await deleteProjectService(req);
    res.status(result.httpStatus).json(result);
  } catch (error: any) {
    console.error("Error in deleteProject:", error);
    res.status(500).json({
      httpStatus: 500,
      message: "Internal Server Error while deleting project",
      error: error.message || "Unknown error",
      data: null,
    });
  }
};

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const result = await getAllProjectsService(req);
    res.status(result.httpStatus).json({
      httpStatus: result.httpStatus,
      message: result.message,
      data: result.data.projects,
      error: result.error,
    });
  } catch (error: any) {
    console.error("Error in getAllProjects:", error);
    res.status(500).json({
      httpStatus: 500,
      message: "Internal Server Error while fetching projects",
      error: error.message || "Unknown error",
      data: null,
    });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const result = await getProjectByIdService(req);
    res.status(result.httpStatus).json(result);
  } catch (error: any) {
    console.error("Error in getProjectById:", error);
    res.status(500).json({
      httpStatus: 500,
      message: "Internal Server Error while fetching project by ID",
      error: error.message || "Unknown error",
      data: null,
    });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const response = await updateProjectService(req);
    res.status(response.httpStatus).json({
      httpStatus: response.httpStatus,
      message: response.message,
      error: response.error,
      data: response.data,
    });
  } catch (error: any) {
    console.error("Error in updateProject:", error);
    res.status(500).json({
      httpStatus: 500,
      message: "Internal Server Error while updating project",
      error: error.message || "Unknown error",
      data: null,
    });
  }
};
