import { Request, Response } from "express";
import {
  createTaskService,
  deleteTaskService,
  getAllTasksService,
  getTaskByIdService,
  updateTaskService,
} from "../services/v1/ticket.service";

/**
 * Controller to handle creating a new task.
 * Delegates to createTaskService and sends appropriate JSON response.
 */
export const createTask = async (req: Request, res: Response) => {
  try {
    const response = await createTaskService(req);
    res.status(response.httpStatus).json({
      httpStatus: response.httpStatus,
      message: response.message,
      error: response.error,
      data: response.data,
    });
  } catch (error: any) {
    console.error("Error in createTask:", error);
    res.status(500).json({
      httpStatus: 500,
      message: "Internal Server Error while creating task",
      error: error.message || "Unknown error",
      data: null,
    });
  }
};

/**
 * Controller to fetch all tasks.
 * Calls getAllTasksService and returns task data with status.
 */
export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const response = await getAllTasksService(req);
    res.status(response.httpStatus).json({
      httpStatus: response.httpStatus,
      message: response.message,
      error: response.error,
      data: response.data,
    });
  } catch (error: any) {
    console.error("Error in getAllTasks:", error);
    res.status(500).json({
      httpStatus: 500,
      message: "Internal Server Error while fetching tasks",
      error: error.message || "Unknown error",
      data: null,
    });
  }
};

/**
 * Controller to get a specific task by its ID.
 * Sends the fetched task or error response.
 */
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const result = await getTaskByIdService(req);
    res.status(result.httpStatus).json(result);
  } catch (error: any) {
    console.error("Error in getTaskById:", error);
    res.status(500).json({
      httpStatus: 500,
      message: "Internal Server Error while fetching task by ID",
      error: error.message || "Unknown error",
      data: null,
    });
  }
};

/**
 * Controller to delete a task identified by its ID.
 * Calls deleteTaskService and returns the result.
 */
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const response = await deleteTaskService(req);
    res.status(response.httpStatus).json({
      httpStatus: response.httpStatus,
      message: response.message,
      error: response.error,
      data: response.data,
    });
  } catch (error: any) {
    console.error("Error in deleteTask:", error);
    res.status(500).json({
      httpStatus: 500,
      message: "Internal Server Error while deleting task",
      error: error.message || "Unknown error",
      data: null,
    });
  }
};

/**
 * Controller to update an existing task.
 * Delegates update logic to updateTaskService and responds with the result.
 */
export const updateTask = async (req: Request, res: Response) => {
  try {
    const result = await updateTaskService(req);
    res.status(result.httpStatus).json(result);
  } catch (error: any) {
    console.error("Error in updateTask:", error);
    res.status(500).json({
      httpStatus: 500,
      message: "Internal Server Error while updating task",
      error: error.message || "Unknown error",
      data: null,
    });
  }
};
