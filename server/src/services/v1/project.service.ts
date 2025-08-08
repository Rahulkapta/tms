import { Request } from "express";
import { ApiResponse } from "../../utils/response.utils";
import { ProjectRepository } from "../../repositories/project.repository";
import { TicketRepository } from "../../repositories/ticket.repository";
import { Types } from "mongoose";
import { NotificationRepository } from "../../repositories/notification.repository";

const projectRepository = new ProjectRepository();
const ticketRepository = new TicketRepository();
const notificationRepository = new NotificationRepository()

/**
 * Service to create a new project.
 * Only accessible to authenticated users with SUPER ADMIN or ADMIN roles.
 * Validates required fields and uniqueness of project name.
 */
export const createProjectService = async (
  req: Request
): Promise<ApiResponse<any>> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      throw new Error(
        "Please login to create a project. || Unauthorized: User not authenticated."
      );
    }

    // Authorization check for allowed roles
    const userRoleName = req.user?.roleId?.name;
    if (userRoleName !== "SUPER ADMIN" && userRoleName !== "ADMIN") {
      return {
        httpStatus: 403,
        message: "Forbidden: You do not have permission to create a project.",
        error: "Insufficient role permissions",
        data: null,
      };
    }

    const {
      name,
      description,
      status,
      manager,
      startDate,
      endDate,
      team,
      assignedPeople,
      taskCount,
    } = req.body;

    // Validate required fields
    if (!name || !description || !status || !manager) {
      throw new Error(
        "Missing required fields: name, description, status and manager are required."
      );
    }

    // Validate allowed status values
    const allowedStatuses = ["Todo", "In Progress", "Done"];
    if (!allowedStatuses.includes(status)) {
      return {
        httpStatus: 400,
        message: `Invalid status value. Allowed values are: ${allowedStatuses.join(
          ", "
        )}`,
        error: "Invalid status",
        data: null,
      };
    }

    // Validate manager ID format
    const isValidObjectId = (id: any) => Types.ObjectId.isValid(id);
    if (manager && !isValidObjectId(manager)) {
      return {
        httpStatus: 400,
        message: "Invalid manager ID.",
        error: "Invalid input",
        data: null,
      };
    }

    // Validate assignedPeople must be an array of IDs if present
    if (assignedPeople && !Array.isArray(assignedPeople)) {
      return {
        httpStatus: 400,
        message: "assignedPeople must be an array of user IDs.",
        error: "Invalid input",
        data: null,
      };
    }

    // Check for duplicate project name
    const existingProject = await projectRepository.findByName(name);
    if (existingProject) {
      return {
        httpStatus: 400,
        message: `Project with the name "${name}" already exists.`,
        error: "Duplicate project name",
        data: null,
      };
    }

    // Create project
    const project = await projectRepository.createproject({
      name,
      description,
      createdBy: userId,
      updatedBy: userId,
      team,
      manager,
      assignedPeople,
      status,
      startDate,
      endDate,
      taskCount: taskCount ?? 0,
    });

    if (!project) {
      throw new Error("Something went wrong while making a project.");
    }

    // 🎯 Create NOTIFICATIONS AFTER PROJECT CREATION
    const notification = await notificationRepository.create({
      userId: userId,
      title: "New Project Created",
      message: `A new project "${name}" has been created and you are assigned to it.`,
      type: "project_created",
      data: {
        project
      },
    });
    

    return {
      httpStatus: 201,
      message: "Project created successfully!!",
      data: { project },
      error: null,
    };
  } catch (error: any) {
    console.error("Project creation error:", error);
    return {
      httpStatus: 500,
      message: "Error during project creation",
      error: error.message,
      data: null,
    };
  }
};

/**
 * Service to delete a project by ID.
 * Only accessible to SUPER ADMIN or ADMIN users.
 * Also deletes associated tickets/tasks.
 */
export const deleteProjectService = async (
  req: Request
): Promise<ApiResponse<any>> => {
  try {
    const user = req.user;
    const userRole = user?.roleId?.name;

    // Authorization check
    if (userRole !== "SUPER ADMIN" && userRole !== "ADMIN") {
      return {
        httpStatus: 403,
        message: "Forbidden: You do not have permission to delete projects.",
        error: "Insufficient role permissions",
        data: null,
      };
    }

    const { projectId } = req.params;

    if (!projectId) {
      return {
        httpStatus: 400,
        message: "Project ID is required.",
        error: "Missing project ID",
        data: null,
      };
    }

    // Delete project by ID
    const deletedProject = await projectRepository.deleteById(projectId);

    if (!deletedProject) {
      return {
        httpStatus: 404,
        message: "Project not found or already deleted.",
        error: "Not Found",
        data: null,
      };
    }

    // Also delete associated tickets/tasks for the project
    await ticketRepository.deleteManyByProjectId(projectId);

    return {
      httpStatus: 200,
      message: "Project deleted successfully.",
      error: null,
      data: {
        projectId,
      },
    };
  } catch (error: any) {
    return {
      httpStatus: 500,
      message: "Error deleting project.",
      error: error.message,
      data: null,
    };
  }
};

/**
 * Service to retrieve all projects.
 */
export const getAllProjectsService = async (
  req: Request
): Promise<ApiResponse<any>> => {
  try {
    const user = req.user;
    const userRole = user?.roleId?.name;
    const userId = user?._id;

    if (!userId) {
      throw new Error(
        "Please login to create a project. || Unauthorized: User not authenticated."
      );
    }

    let projects;

    if (userRole === "SUPER ADMIN" || userRole === "ADMIN") {
      // SUPER ADMIN and ADMIN see all projects
      projects = await projectRepository.getAllProjects();
    } else {
      // Other roles see only projects where they are assigned
      projects = await projectRepository.getProjectsByAssignedPerson(userId);
    }

    return {
      httpStatus: 200,
      message: "Projects fetched successfully.",
      error: null,
      data: { projects },
    };
  } catch (error: any) {
    return {
      httpStatus: 500,
      message: "Error fetching projects.",
      error: error.message,
      data: null,
    };
  }
};

/**
 * Service to get a single project by project ID.
 */
export const getProjectByIdService = async (
  req: Request
): Promise<ApiResponse<any>> => {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return {
        httpStatus: 400,
        message: "Project ID is required.",
        error: "Missing project ID",
        data: null,
      };
    }

    // Find project by ID
    const project = await projectRepository.findById(projectId);

    if (!project) {
      return {
        httpStatus: 404,
        message: "Project not found.",
        error: "Not Found",
        data: null,
      };
    }

    return {
      httpStatus: 200,
      message: "Project fetched successfully.",
      error: null,
      data: { project },
    };
  } catch (error: any) {
    return {
      httpStatus: 500,
      message: "Error fetching project.",
      error: error.message,
      data: null,
    };
  }
};

/**
 * Service to update an existing project.
 * Only accessible to SUPER ADMIN or ADMIN users.
 * Supports partial updates: at least one field must be present in request.
 */
export const updateProjectService = async (
  req: Request
): Promise<ApiResponse<any>> => {
  try {
    const user = req.user;
    const userRole = user?.roleId?.name;

    const { projectId } = req.params;
    if (!projectId) {
      return {
        httpStatus: 400,
        message: "Project ID is required to update a project.",
        error: "Missing project ID",
        data: null,
      };
    }

    // Destructure possible update fields from request body
    const {
      name,
      description,
      status,
      startDate,
      endDate,
      team,
      manager,
      assignedPeople,
    } = req.body;

    // Validate at least one field to update is provided
    if (
      !name &&
      !description &&
      !status &&
      !startDate &&
      !endDate &&
      !manager &&
      !team &&
      !assignedPeople
    ) {
      return {
        httpStatus: 400,
        message: "At least one field must be provided to update the project.",
        error: "No update fields provided",
        data: null,
      };
    }

    // Optional: Check if project exists before updating
    const existingProject = await projectRepository.findById(projectId);
    if (!existingProject) {
      return {
        httpStatus: 404,
        message: "Project not found.",
        error: "Not Found",
        data: null,
      };
    }

    // Prepare update object with only provided fields
    const updateData: any = {
      updatedBy: user._id,
      updatedAt: new Date(),
    };
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (status) updateData.status = status;
    if (startDate) updateData.startDate = startDate;
    if (endDate) updateData.endDate = endDate;
    if (team) updateData.team = team;
    if (manager) updateData.manager = manager;
    if (assignedPeople) updateData.assignedPeople = assignedPeople;

    // Perform update operation
    const updatedProject = await projectRepository.updateById(
      projectId,
      updateData
    );

    if (!updatedProject) {
      return {
        httpStatus: 500,
        message: "Failed to update the project.",
        error: "Update failed",
        data: null,
      };
    }

     // 🎯 CREATE NOTIFICATIONS AFTER PROJECT UPDATION
    const notification = await notificationRepository.create({
      userId: user._id,
      title: "Project updated",
      message: `A project "${existingProject.name}" has been updated.`,
      type: "project_updated",
      data: {
        project: updatedProject
      },
    });

    return {
      httpStatus: 200,
      message: "Project updated successfully.",
      error: null,
      data: updatedProject,
    };
  } catch (error: any) {
    console.error("Project update error:", error);
    return {
      httpStatus: 500,
      message: "Error during project update",
      error: error.message,
      data: null,
    };
  }
};
