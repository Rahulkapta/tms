import { Schema, model, Document, Types } from "mongoose";

export interface IAttachment {
  filename: string;
  url: string;
  uploadedBy: Types.ObjectId;
  uploadedAt: Date;
}

export interface ITicket extends Document {
  projectId: Types.ObjectId;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  startDate?: Date;
  endDate?: Date;
  assignedTo: Types.ObjectId;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  tags: string[];
  attachments: IAttachment[];
  createdAt: Date;
  updatedAt: Date;
}

const attachmentSchema = new Schema<IAttachment>({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const ticketSchema = new Schema<ITicket>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Completed"],
      required: true,
    },
    priority: { type: String, enum: ["Low", "Medium", "High"], required: true },
    assignedTo:  [{ type: Schema.Types.ObjectId, ref: "User" }],
    startDate: { type: Date },
    endDate: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    tags: [{ type: String }],
    attachments: [attachmentSchema],
  },
  { timestamps: true }
);


export const Ticket = model<ITicket>("Ticket", ticketSchema);
