import { Request, Response } from "express";
import { CartModel } from "../model/cart";

/**
 * GET CART
 */
export const getCart = async (req: Request, res: Response) => {
  const userId = req.user!._id;

  let cart = await CartModel.findOne({ userId }).populate("items.productId");

  if (!cart) {
    cart = await CartModel.create({ userId, items: [] });
  }

  res.json(cart);
};

/**
 * ADD TO CART
 */
export const addToCart = async (req: Request, res: Response) => {
  const userId = req.user!._id;
  const { productId, quantity } = req.body;

  let cart = await CartModel.findOne({ userId });

  if (!cart) {
    cart = await CartModel.create({ userId, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save();
  
  // Populate product data before returning
  await cart.populate("items.productId");
  
  res.status(201).json(cart);
};

/**
 * UPDATE CART ITEM
 */
export const updateCartItem = async (req: Request, res: Response) => {
  const userId = req.user!._id;
  const productId = req.params.id;
  const { quantity } = req.body;

  const cart = await CartModel.findOne({ userId });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const item = cart.items.find(
    (i) => i.productId.toString() === productId
  );

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  item.quantity = quantity;
  await cart.save();
  
  // Populate product data before returning
  await cart.populate("items.productId");

  res.json(cart);
};

/**
 * REMOVE ITEM
 */
export const removeCartItem = async (req: Request, res: Response) => {
  const userId = req.user!._id;
  const productId = req.params.id;

  const cart = await CartModel.findOne({ userId });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  cart.items = cart.items.filter(
    (i) => i.productId.toString() !== productId
  );

  await cart.save();
  
  // Populate product data before returning
  await cart.populate("items.productId");

  res.json(cart);
};

/**
 * CLEAR CART
 */
export const clearCart = async (req: Request, res: Response) => {
  const userId = req.user!._id;

  await CartModel.findOneAndUpdate(
    { userId },
    { items: [] }
  );

  res.status(204).send();
};
