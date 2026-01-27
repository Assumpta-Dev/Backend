import express from "express";
import {
  loginUser,
  registerUser,
  getUserProfile,
  resetPassword,
} from "../controller/auth";
import { protect } from "../middleware/auth.middleware";

const authenticationRouter = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - role
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum: [customer, vendor, admin]
 *                 example: customer
 *     responses:
 *       201:
 *         description: User registered successfully
 */
authenticationRouter.post("/register", registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
authenticationRouter.post("/login", loginUser);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               newPassword:
 *                 type: string
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Email and new password required
 */
authenticationRouter.post("/reset-password", resetPassword);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get user profile (or all users if admin)
 *     description: >
 *       Returns the logged-in user's profile.
 *       If the authenticated user has an **admin** role,
 *       this endpoint returns **all registered users**.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   description: Normal user profile
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       example: Assumpta
 *                     lastName:
 *                       type: string
 *                       example: Uwambariya
 *                     email:
 *                       type: string
 *                       example: assumpa@example.com
 *                     role:
 *                       type: string
 *                       example: customer
 *                 - type: array
 *                   description: Admin – list of all users
 *                   items:
 *                     type: object
 *                     properties:
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
authenticationRouter.get("/profile", protect, getUserProfile);

export default authenticationRouter;
