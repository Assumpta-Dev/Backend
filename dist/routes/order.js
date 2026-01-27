import express from "express";
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus, } from "../controller/order";
import { protect, authorize } from "../middleware/auth.middleware";
const router = express.Router();
/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create order from logged-in user's cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Cart is empty
 */
router.post("/", protect, createOrder);
/**
 * @swagger
 * /orders/my:
 *   get:
 *     summary: Get logged-in user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
router.get("/my", protect, getMyOrders);
/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
router.get("/", protect, authorize("admin"), getAllOrders);
/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Update order or payment status (Admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
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
 *               orderStatus:
 *                 type: string
 *                 enum: [pending, confirmed, shipped, delivered, cancelled]
 *               paymentStatus:
 *                 type: string
 *                 enum: [pending, paid, failed, refunded]
 */
router.put("/:id/status", protect, authorize("admin"), updateOrderStatus);
export default router;
//# sourceMappingURL=order.js.map