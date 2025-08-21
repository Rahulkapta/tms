import { NextFunction, Request, Response } from "express";
import { Notification } from "../models/notification.model";
import { ObjectId } from "mongodb";

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Get user role name
    const userRoleName = user?.roleId?.name;

    let notifications;

    // Authorization check for allowed roles
    if (userRoleName === "SUPER ADMIN" || userRoleName === "ADMIN") {
      // SUPER ADMIN and ADMIN can see ALL notifications
      notifications = await Notification.find()
        .sort({ createdAt: -1 }) // Latest first
        .lean();
    } else {
      // Regular users see only filtered notifications
      const userId = new ObjectId(user._id);

      const notificationFilter = {
        $or: [
          // Project-related notifications where user is involved
          {
            type: { $in: ["project_created", "project_updated"] },
            $or: [
              { "data.project.manager": userId },
              { "data.project.assignedPeople": { $in: [userId] } },
              { "data.project.team": { $in: [userId] } },
            ],
          },
          {
            type: "project_deleted",
            $or: [
              { "data.project.manager": userId },
              { "data.project.assignedPeople": { $in: [userId] } },
              { "data.project.team": { $in: [userId] } },
            ],
          },

          // Task-related notifications where user is involved
          {
            type: { $in: ["task_created", "task_updated"] },
            $or: [{ "data.project.assignedTo": { $in: [userId] } }],
          },

          // Comment notifications where user is involved
          {
            type: "comment_added",
            $or: [{ "data.ticketExists.assignedTo": { $in: [userId] } }],
          },
        ],
      };

      notifications = await Notification.find(notificationFilter)
        .sort({ createdAt: -1 }) // Latest first
        .lean();
    }

    return res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully",
      data: {
        notifications,
      },
    });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve notifications",
      error: error.message,
    });
  }
};
