import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controller/categories";
import { protect, authorize } from "../middleware/auth.middleware";

const router = express.Router();
/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get all categories
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: A list of categories
 */

router.get("/", getAllCategories);
/**
 * @swagger
 * /category/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category details
 */
router.get("/:id", getCategoryById);
/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create a new category
 *     tags:
 *       - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Category name
 *                 example: Electronics
 *               description:
 *                 type: string
 *                 description: Category description
 *                 example: Electronic products and gadgets
 *     responses:
 *       201:
 *         description: Category created successfully
 */
// ADMIN can create category
router.post(
  "/",
  protect,
  authorize("admin"),
  createCategory
);
/**
 * @swagger
 * /category/{id}:
 *   put:
 *     summary: Update a category
 *     tags:
 *       - Categories
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated category name
 *               description:
 *                 type: string
 *                 example: Updated category description
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 */
router.put("/:id", updateCategory);

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 */
router.delete("/:id", deleteCategory);

export default router;
