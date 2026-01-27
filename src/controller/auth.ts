import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userModel } from "../model/users";
import nodemailer from "nodemailer";

// ---------------------------
// EMAIL CONFIGURATION
// ---------------------------
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Optional: verify email transporter on startup
transporter.verify((error) => {
  if (error) {
    console.error(" Email service error:", error);
  } else {
    console.log("Email service is ready");
  }
});

// Send welcome email function
const sendWelcomeEmail = async (email: string, firstName: string) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Welcome to Our Platform 🎉",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hello ${firstName}, 👋</h2>
        <p>Welcome to our platform!</p>
        <p>Your account has been created successfully.</p>
        <p>If you did not create this account, please ignore this email.</p>
        <br />
        <p>Best regards,</p>
        <strong>The Team</strong>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// ---------------------------
// REGISTER USER
// ---------------------------
export const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, role } = req.body;

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

    // Send welcome email asynchronously
    sendWelcomeEmail(email, firstName).catch((err) => {
      console.error("Failed to send welcome email:", err);
      // Do not fail registration if email fails
    });

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in .env");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      status: "success",
      message: "User registered successfully. Check your email!",
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
  const { email, password } = req.body;

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
  const { email, newPassword } = req.body;

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
