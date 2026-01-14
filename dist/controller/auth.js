import bcrypt from "bcryptjs";
import { userModel } from "../types/users";
/**
 * REGISTER USER
 */
export const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;
    try {
        // check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: "error",
                message: "User already exists",
            });
        }
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await userModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
        });
        res.status(201).json({
            status: "success",
            message: "User registered successfully",
            data: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "User registration failed",
        });
    }
};
/**
 * LOGIN USER
 */
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
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
        res.status(200).json({
            status: "success",
            message: "Login successful",
            data: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Login failed",
        });
    }
};
/**
 * GET USER PROFILE
 */
export const getUserProfile = async (req, res) => {
    try {
        // later this will come from auth middleware (req.user.id)
        const userId = req.params.id;
        const user = await userModel.findById(userId).select("-password");
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
            message: "Failed to get profile",
        });
    }
};
export default { loginUser, registerUser, getUserProfile };
//# sourceMappingURL=auth.js.map