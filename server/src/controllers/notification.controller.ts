import { NextFunction, Request, Response } from "express";
import { Notification } from "../models/notification.model";

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    let notifications;
    if (user) {
      notifications = await Notification.find()
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
  } catch (error) {}
};
