import { Schema, model, Document, Types } from "mongoose";
export enum Designation {
  Manager = "Manager",
  Employee = "Employee",
  Customer = "Customer",
}

export interface IUserDetails extends Document {
  userId?: Types.ObjectId;
  name: {
    first: string;
    last: string;
  };
  mobileNumber: string;
  photoUrl: string;
  designation: Designation;
  createdAt: Date;
  updatedAt: Date;
}

const userDetailsSchema = new Schema<IUserDetails>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      unique: true,
    },
    name: {
      first: { type: String, required: true },
      last: { type: String },
    },
    mobileNumber: { type: String, required: true },
    photoUrl: { type: String },
    designation: {
      type: String,
      enum: Object.values(Designation),
    }
  },
  { timestamps: true }
);


export const UserDetails = model<IUserDetails>(
  "UserDetails",
  userDetailsSchema
);
