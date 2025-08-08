// models/Notification.ts
import { Schema, model, Types } from "mongoose";

export interface INotification {
  userId: Types.ObjectId;
  title: string;
  message: string;
  type:
    | "project_created"
    | "project_updated"
    | "project_deleted"
    | "task_assigned"
    | "announcement"
    | "task_created"
    | "task_updated"
    | "comment_added";
  data?: any;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    message: {
      type: String,
      required: true,
      maxlength: 500,
    },
    type: {
      type: String,
      enum: [
        "project_created",
        "project_updated",
        "project_deleted",
        "task_assigned",
        "announcement",
        "task_created",
        "task_created",
        "task_updated",
        "comment_added",
      ],
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
      default: {},
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// // Index for faster queries
// NotificationSchema.index({ userId: 1, createdAt: -1 });
// NotificationSchema.index({ userId: 1, read: 1 });

export const Notification = model<INotification>(
  "Notification",
  NotificationSchema
);
