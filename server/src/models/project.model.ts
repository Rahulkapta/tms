import { Schema, model, Document, Types } from "mongoose";

export interface IProject extends Document {
  name: string;
  description: string;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  team: Types.ObjectId[];
  manager: Types.ObjectId;
  assignedPeople: Types.ObjectId[];
  status: ProjectStatus;
  startDate: Date;
  endDate: Date;
  taskCount: number;
  createdAt: Date;
  updatedAt: Date;
}
enum ProjectStatus {
  Todo = "Todo",
  InProgress = "In Progress",
  Done = "Done",
}
const projectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  team: [{ type: Schema.Types.ObjectId, ref: "User" }],
  manager: { type: Schema.Types.ObjectId, ref: "User", required: true },
  assignedPeople: [{ type: Schema.Types.ObjectId, ref: "User" }],
  status: { type: String, enum: Object.values(ProjectStatus), required: true },
  taskCount: { type: Number, default: 0 },
  startDate: { type: Date },
  endDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

projectSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const Project = model<IProject>("Project", projectSchema);
