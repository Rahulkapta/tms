import { Schema, model, Document, Types } from "mongoose";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  email: string;
  otpPin: string;
  roleId: Types.ObjectId;
  detailsId: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
}
// 2. Interface for document (includes custom methods)
export interface IUserDocument extends IUser, Document {
  generateAccessToken(roleName: string): string;
}

const userSchema = new Schema<IUserDocument>({
  email: { type: String, required: true, unique: true },
  otpPin: { type: String, required: true },
  roleId: { type: Schema.Types.ObjectId, ref: "Role", required: true },
  detailsId: {
    type: Schema.Types.ObjectId,
    ref: "UserDetails",
    required: true,
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // Who created this user
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" }, // Who last updated this user
});

userSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

userSchema.methods.generateAccessToken = function (
  this: IUser,
  roleName: string
): string {
  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.ACCESS_TOKEN_EXPIRY) {
    throw new Error("ACCESS_TOKEN_SECRET or ACCESS_TOKEN_EXPIRY is not set");
  }
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: roleName,
    },
    process.env.ACCESS_TOKEN_SECRET as jwt.Secret,
    {}
  );
};

export const User = model<IUserDocument>("User", userSchema);
