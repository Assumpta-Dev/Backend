import { Request, Response } from "express";
import { userModel } from "../model/users";

/**
 * GET ALL USERS (Admin only)
 */
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await userModel.find().select("-password");

    res.status(200).json({
      status: "success",
      results: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch users",
    });
  }
};

/**
 * GET USER BY ID (Admin only)
 */
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await userModel.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch user",
    });
  }
};

/**
 * UPDATE USER (Admin only)
 */
export const updateUser = async (req: any, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, role, isActive } = req.body;

  try {
    // Prevent admin from disabling their own account
    if (req.user._id.toString() === id && isActive === false) {
      return res.status(400).json({
        status: "error",
        message: "You cannot deactivate your own account",
      });
    }

    const updateData: any = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (typeof isActive === "boolean") updateData.isActive = isActive;

    // Allow role change only if provided
    if (role) {
      const allowedRoles = ["admin", "customer"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid role",
        });
      }
      updateData.role = role;
    }

    const user = await userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select("-password");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to update user",
    });
  }
};

/**
 * DELETE USER (Admin only)
 */
export const deleteUser = async (req: any, res: Response) => {
  const { id } = req.params;

  try {
    // Prevent admin from deleting themselves
    if (req.user._id.toString() === id) {
      return res.status(400).json({
        status: "error",
        message: "You cannot delete your own account",
      });
    }

    const user = await userModel.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete user",
    });
  }
};

export default {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
