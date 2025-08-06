import { Request } from "express";
import { ApiResponse } from "../../utils/response.utils";
import { Types } from "mongoose";
import { TicketRepository } from "../../repositories/ticket.repository";
import { ProjectRepository } from "../../repositories/project.repository";

// Initialize repository instances for database operations
const ticketRepository = new TicketRepository();
const projectRepository = new ProjectRepository();

/**
 * Service to create a new task within a specific project.
 * Performs authentication, authorization, validation, and duplication checks.
 * @param req Express request containing user info, params, and task payload
 * @returns ApiResponse with status, message, error, and created task data
 */
export const createTaskService = async (
  req: Request
): Promise<ApiResponse<any>> => {
  try {
    const user = req.user;
    const userRole = user?.roleId?.name;

    // Validate user authentication
    if (!user?._id || !Types.ObjectId.isValid(user?._id)) {
      return {
        httpStatus: 401,
        message: "Unauthorized: User not authenticated.",
        error: "Unauthorized",
        data: null,
      };
    }

    // Authorization: only SUPER ADMIN and ADMIN roles allowed to create tasks
    if (userRole !== "SUPER ADMIN" && userRole !== "ADMIN") {
      return {
        httpStatus: 403,
        message: "Forbidden: You do not have permission to create tasks.",
        error: "Insufficient role permissions",
        data: null,
      };
    }

    // Extract projectId from request URL parameters and validate
    const { projectId } = req.params;
    if (!projectId || !Types.ObjectId.isValid(projectId)) {
      return {
        httpStatus: 400,
        message: "Invalid or missing projectId in URL.",
        error: "Validation error",
        data: null,
      };
    }

    // Extract required and optional task fields from request body
    const {
      title,
      description,
      status,
      priority,
      startDate,
      endDate,
      assignedTo,
      tags,
      attachments,
    } = req.body;

    // Validate required fields presence
    if (!title || !status || !priority) {
      return {
        httpStatus: 400,
        message:
          "Missing required fields: title, status, and priority are required.",
        error: "Validation error",
        data: null,
      };
    }

    // Verify the project exists before creating task
    const existingProject = await projectRepository.findById(projectId);
    if (!existingProject) {
      return {
        httpStatus: 404,
        message: "Project not found.",
        error: "Invalid projectId",
        data: null,
      };
    }

    // Check if a task with the same title already exists in this project
    const existingTask = await ticketRepository.findByTitleAndProject(
      title,
      projectId
    );
    if (existingTask) {
      return {
        httpStatus: 400,
        message: `Task with title "${title}" already exists in the selected project.`,
        error: "Duplicate task title",
        data: null,
      };
    }
    // create the new task
    const task = await ticketRepository.createTask({
      projectId: new Types.ObjectId(projectId),
      title,
      description,
      status,
      priority,
      startDate,
      endDate,
      assignedTo,
      createdBy: user._id,
      updatedBy: user._id,
      tags: Array.isArray(tags) ? tags : [],
      attachments: Array.isArray(attachments) ? attachments : [],
    });
    // Atomically increment the project's taskCount by 1
    await projectRepository.updateTaskCount(projectId, {
      $inc: { taskCount: 1 },
    });

    // Return successful creation response
    return {
      httpStatus: 201,
      message: "Task created successfully.",
      error: null,
      data: task,
    };
  } catch (error: any) {
    console.error("Task creation error:", error);
    return {
      httpStatus: 500,
      message: "Error creating task.",
      error: error.message,
      data: null,
    };
  }
};

/**
 * Service to fetch all tasks for a given project.
 * Validates projectId parameter and returns task list.
 * @param req Express request with projectId param
 * @returns ApiResponse with task list
 */
export const getAllTasksService = async (
  req: Request
): Promise<ApiResponse<any>> => {
  try {
    const { projectId } = req.params;

    // Validate projectId parameter
    if (!projectId || !Types.ObjectId.isValid(projectId)) {
      return {
        httpStatus: 400,
        message: "Invalid or missing projectId in URL.",
        error: "Validation error",
        data: null,
      };
    }

    // Fetch tasks from repository
    const tasks = await ticketRepository.findAllTask(projectId);

    return {
      httpStatus: 200,
      message: "Tasks fetched successfully.",
      error: null,
      data: tasks,
    };
  } catch (error: any) {
    console.error("Error fetching tasks:", error);
    return {
      httpStatus: 500,
      message: "Error fetching tasks.",
      error: error.message,
      data: null,
    };
  }
};

/**
 * Service to get a single task by its ID.
 * Validates the taskId param and returns task data if found.
 * @param req Express request with taskId param
 * @returns ApiResponse with task data
 */
export const getTaskByIdService = async (
  req: Request
): Promise<ApiResponse<any>> => {
  try {
    const { taskId } = req.params;

    // Validate taskId parameter
    if (!taskId || !Types.ObjectId.isValid(taskId)) {
      return {
        httpStatus: 400,
        message: "Invalid or missing taskId in URL.",
        error: "Validation error",
        data: null,
      };
    }

    // Lookup task in repository
    const task = await ticketRepository.findTaskById(taskId);

    // Return 404 if task not found
    if (!task) {
      return {
        httpStatus: 404,
        message: "Task not found.",
        error: "Not Found",
        data: null,
      };
    }

    // Return successful response with task data
    return {
      httpStatus: 200,
      message: "Task fetched successfully.",
      error: null,
      data: task,
    };
  } catch (error: any) {
    console.error("Error fetching task by id:", error);
    return {
      httpStatus: 500,
      message: "Error while fetching task.",
      error: error.message,
      data: null,
    };
  }
};

/**
 * Service to delete a task by ID.
 * Checks role authorization, validates parameters, and performs deletion.
 * @param req Express request with taskId param and user info
 * @returns ApiResponse indicating success or failure
 */
export const deleteTaskService = async (
  req: Request
): Promise<ApiResponse<any>> => {
  try {
    const user = req.user;
    const userRole = user?.roleId?.name;

    // Authorization: only SUPER ADMIN and ADMIN can delete tasks
    if (userRole !== "SUPER ADMIN" && userRole !== "ADMIN") {
      return {
        httpStatus: 403,
        message: "Forbidden: You do not have permission to delete tasks.",
        error: "Insufficient role permissions",
        data: null,
      };
    }
    const { projectId, taskId } = req.params;
    if (!projectId || !Types.ObjectId.isValid(projectId)) {
      return {
        httpStatus: 400,
        message: "Invalid or missing projectId in URL.",
        error: "Validation error",
        data: null,
      };
    }

    // Validate taskId parameter
    if (!taskId || !Types.ObjectId.isValid(taskId)) {
      return {
        httpStatus: 400,
        message: "Invalid or missing taskId in URL.",
        error: "Validation error",
        data: null,
      };
    }

    // Attempt to delete task from repository
    const deletedTask = await ticketRepository.deleteTaskById(taskId);

    // If no task found to delete, return 404
    if (!deletedTask) {
      return {
        httpStatus: 404,
        message: "Task not found or already deleted.",
        error: "Not Found",
        data: null,
      };
    }

     const updatedProject = await projectRepository.updateTaskCount(projectId, { $inc: { taskCount: -1 } });


    // Return success message with deleted taskId
    return {
      httpStatus: 200,
      message: "Task deleted successfully.",
      error: null,
      data: {taskId},
    };
  } catch (error: any) {
    console.error("Error deleting task:", error);
    return {
      httpStatus: 500,
      message: "Error deleting task.",
      error: error.message,
      data: null,
    };
  }
};

/**
 * Service to update an existing task.
 * Validates authorization, input, and performs partial updates.
 * @param req Express request with taskId param and update fields in body
 * @returns ApiResponse with updated task data or error info
 */
export const updateTaskService = async (
  req: Request
): Promise<ApiResponse<any>> => {
  try {
    const user = req.user;
    const userRole = user?.roleId?.name;

    // Authorization: only SUPER ADMIN and ADMIN can update tasks
    if (userRole !== "SUPER ADMIN" && userRole !== "ADMIN") {
      return {
        httpStatus: 403,
        message: "Forbidden: You do not have permission to update tasks.",
        error: "Insufficient role permissions",
        data: null,
      };
    }

    const { taskId } = req.params;

    // Validate taskId parameter
    if (!taskId || !Types.ObjectId.isValid(taskId)) {
      return {
        httpStatus: 400,
        message: "Invalid or missing taskId in URL.",
        error: "Validation error",
        data: null,
      };
    }

    // Extract possible update fields from request body
    const {
      title,
      description,
      status,
      priority,
      startDate,
      endDate,
      assignedTo,
      dueDate,
      tags,
      attachments,
    } = req.body;

    // Require at least one field to update
    if (
      !title &&
      !description &&
      !status &&
      !priority &&
      !startDate &&
      !endDate &&
      !assignedTo &&
      !dueDate &&
      !tags &&
      !attachments
    ) {
      return {
        httpStatus: 400,
        message: "No update fields provided.",
        error: "Validation error",
        data: null,
      };
    }

   

    // Check if the task exists before updating
    const existingTask = await ticketRepository.findTaskById(taskId);
    if (!existingTask) {
      return {
        httpStatus: 404,
        message: "Task not found.",
        error: "Not Found",
        data: null,
      };
    }

    // Prepare update object with only provided fields and metadata
    const updateFields: any = {
      updatedBy: user._id,
      updatedAt: new Date(),
    };

    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (status) updateFields.status = status;
    if (priority) updateFields.priority = priority;
    if (startDate) updateFields.startDate = startDate;
    if (endDate) updateFields.endDate = endDate;
    if (assignedTo) updateFields.assignedTo = assignedTo;
    if (dueDate) updateFields.dueDate = dueDate;
    if (tags) updateFields.tags = Array.isArray(tags) ? tags : [];
    if (attachments)
      updateFields.attachments = Array.isArray(attachments) ? attachments : [];

    // Execute update in repository
    const updatedTask = await ticketRepository.updateTaskById(
      taskId,
      updateFields
    );

    // Handle failure to update
    if (!updatedTask) {
      return {
        httpStatus: 500,
        message: "Failed to update the task.",
        error: "Update failed",
        data: null,
      };
    }

    // Return successful update response with updated task data
    return {
      httpStatus: 200,
      message: "Task updated successfully.",
      error: null,
      data: updatedTask,
    };
  } catch (error: any) {
    console.error("Task update error:", error);
    return {
      httpStatus: 500,
      message: "Error updating task.",
      error: error.message,
      data: null,
    };
  }
};
