import { Schema, model, Document, Types } from "mongoose";

export interface ICommentAttachment {
  filename: string;
  url: string;
  uploadedBy: Types.ObjectId;
  uploadedAt: Date;
}

export interface IComment extends Document {
  ticketId: Types.ObjectId;
  authorId: Types.ObjectId;
  text: string;
  attachments: ICommentAttachment[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
}

const commentAttachmentSchema = new Schema<ICommentAttachment>({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const commentSchema = new Schema<IComment>(
  {
    ticketId: { type: Schema.Types.ObjectId, ref: "Ticket", required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    attachments: { type: [commentAttachmentSchema], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Comment = model<IComment>("Comment", commentSchema);
