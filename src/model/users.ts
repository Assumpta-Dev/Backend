import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { UserInfoOptionsWithBufferEncoding } from "os";
export interface Users extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "vendor" | "admin" | "customer";
  createdAt: Date;
  isActive: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
const UsersSchema: Schema = new Schema<Users>({
  firstName: {
    type: String,
    required: [true, "first name is required"],
    trim: true,
    maxlength: [50, "first name cannot exceed 50 characters"],
  },
  lastName: {
    type: String,
    required: [true, "last name is required"],
    trim: true,
    maxlength: [50, "last name cannot exceed 50 characters"],
  },

  email: {
    type: String,
    unique: true,
    required: [true, "email is required"],
    trim: true,
    maxlength: [50, "email cannot exceed 50 characters"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    trim: true,
    minlength: [8, "password must be at least 8 characters"],
    select: false,
  },
  role: {
    type: String,
    enum: ["vendor", "admin", "customer"],
    default: "customer",
  },
  isActive: { type: Boolean, default: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export const userModel = mongoose.model<Users>("Users", UsersSchema);
