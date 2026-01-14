import { userModel } from "../types/users";
/**
 * GET ALL USERS (admin use)
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find().select("-password");
        res.status(200).json({
            status: "success",
            data: users,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Failed to fetch users",
        });
    }
};
/**
 * GET USER BY ID
 */
export const getUserById = async (req, res) => {
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Failed to fetch user",
        });
    }
};
/**
 * UPDATE USER
 */
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, isActive, role } = req.body;
    try {
        const user = await userModel
            .findByIdAndUpdate(id, { firstName, lastName, isActive, role }, { new: true })
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Failed to update user",
        });
    }
};
/**
 * DELETE USER
 */
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
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
    }
    catch (error) {
        console.error(error);
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
//# sourceMappingURL=users.js.map