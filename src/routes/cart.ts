import { Router } from "express";
import { v4 as uuid } from "uuid";
import type { Cart } from "../types/cart";

const router = Router();
const carts: Cart[] = [];

// GET cart
router.get("/:userId", (req, res) => {
  const cart = carts.find((c) => c.userId === req.params.userId);
  res.json(cart ?? { userId: req.params.userId, items: [] });
});

// ADD item
router.post("/:userId/items", (req, res) => {
  let cart = carts.find((c) => c.userId === req.params.userId);

  if (!cart) {
    cart = { userId: req.params.userId, items: [] };
    carts.push(cart);
  }

  const item = {
    id: uuid(),
    productId: req.body.productId,
    quantity: req.body.quantity,
  };

  cart.items.push(item);
  res.status(201).json(item);
});

// UPDATE item
router.put("/:userId/items/:id", (req, res) => {
  const cart = carts.find((c) => c.userId === req.params.userId);
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const item = cart.items.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });

  item.quantity = req.body.quantity;
  res.json(item);
});

// DELETE item
router.delete("/:userId/items/:id", (req, res) => {
  const cart = carts.find((c) => c.userId === req.params.userId);
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter((i) => i.id !== req.params.id);
  res.status(204).send();
});

// CLEAR cart
router.delete("/:userId", (req, res) => {
  const index = carts.findIndex((c) => c.userId === req.params.userId);
  if (index !== -1) carts.splice(index, 1);
  res.status(204).send();
});

export default router;
