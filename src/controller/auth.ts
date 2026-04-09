import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userModel } from "../model/users";
import nodemailer from "nodemailer";

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// ---------------------------
// REGISTER USER
// ---------------------------
export const registerUser = async (req: Request, res: Response) => {
  const firstName = req.body?.firstName;
  const lastName = req.body?.lastName;
  const email = req.body?.email;
  const password = req.body?.password;
  const role = req.body?.role;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      status: "error",
      message: "All fields are required",
    });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || "customer",
    });

    // Send welcome email
    transporter.sendMail({
      to: email,
      subject: 'Welcome to Kapee! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #3B82F6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1>Welcome to Kapee! 🎉</h1>
          </div>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
            <h2>Hello ${firstName}!</h2>
            <p>Thank you for joining Kapee. We're excited to have you on board.</p>
            <p>Your account has been successfully created with the email: <strong>${email}</strong></p>
            <p>You can now start exploring our platform and enjoy shopping!</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="http://localhost:5173" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Start Shopping</a>
            </div>
          </div>
          <div style="text-align: center; padding: 20px; color: #777; font-size: 12px;">
            <p>© 2024 Kapee. All rights reserved.</p>
          </div>
        </div>
      `
    }).catch(err => console.log('Welcome email failed:', err));

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in .env");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      status: "success",
      message: "Account created successfully! Welcome email sent.",
      token,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Register error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "User registration failed",
    });
  }
};

// ---------------------------
// LOGIN USER
// ---------------------------
export const loginUser = async (req: Request, res: Response) => {
  const email = req.body?.email;
  const password = req.body?.password;

  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Email and password are required",
    });
  }

  try {
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in .env");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Login failed",
    });
  }
};

// ---------------------------
// GET USER PROFILE
// ---------------------------
export const getUserProfile = async (req: any, res: Response) => {
  try {
    const user = req.user; // from protect middleware

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Get profile error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to get profile",
    });
  }
};

// ---------------------------
// RESET PASSWORD
// ---------------------------
export const resetPassword = async (req: Request, res: Response) => {
  const email = req.body?.email;
  const newPassword = req.body?.newPassword;

  if (!email || !newPassword) {
    return res.status(400).json({
      status: "error",
      message: "Email and new password are required",
    });
  }

  try {
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  } catch (error: any) {
    console.error("Reset password error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to reset password",
    });
  }
};

export default {
  registerUser,
  loginUser,
  getUserProfile,
  resetPassword,
};