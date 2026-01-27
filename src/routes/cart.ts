import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controller/cart";
import { protect, authorize } from "../middleware/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get customer cart
 *     description: Retrieve the current cart for the logged-in customer.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                 totalAmount:
 *                   type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (customers only)
 */
router.get("/", protect, authorize("customer"), getCart);

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add item to cart
 *     description: Add a product to the customer cart or increase quantity if it already exists.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 64fdc9e4b9f1a2c123456789
 *               quantity:
 *                 type: number
 *                 example: 2
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (customers only)
 */
router.post("/", protect, authorize("customer"), addToCart);

/**
 * @swagger
 * /cart/{id}:
 *   put:
 *     summary: Update cart item quantity
 *     description: Update the quantity of a specific item in the cart.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Cart item ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (customers only)
 *       404:
 *         description: Cart item not found
 */
router.put("/:id", protect, authorize("customer"), updateCartItem);

/**
 * @swagger
 * /cart/{id}:
 *   delete:
 *     summary: Remove item from cart
 *     description: Remove a specific item from the customer cart.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Cart item ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (customers only)
 *       404:
 *         description: Cart item not found
 */
router.delete("/:id", protect, authorize("customer"), removeCartItem);

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Clear cart
 *     description: Remove all items from the customer cart.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (customers only)
 */
router.delete("/", protect, authorize("customer"), clearCart);


export default router;
