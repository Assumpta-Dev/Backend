import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controller/product";
import { protect, authorize } from "../middleware/auth.middleware";
import { upload } from "../config/multer.config";

const router = express.Router();

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Get all products
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: List of all products
 */
router.get("/", getAllProducts);

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get("/:id", getProductById);

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Create a new product (Vendor only)
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Laptop
 *               description:
 *                 type: string
 *                 example: High-performance laptop
 *               price:
 *                 type: number
 *                 example: 999.99
 *               categoryId:
 *                 type: string
 *                 example: 64f1a6c4e7b6c0a5b1d2f3b1
 *               quantity:
 *                 type: integer
 *                 example: 5
 *               inStock:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post("/", protect, authorize("vendor"),upload.single("image"), createProduct);

/**
 * @swagger
 * /product/{id}:
 *   put:
 *     summary: Update a product (Vendor only)
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.put("/:id", protect, authorize("vendor"), updateProduct);

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: Delete a product (Vendor only)
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.delete("/:id", protect, authorize("vendor"), deleteProduct);

export default router;
