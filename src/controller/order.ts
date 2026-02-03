import { Request, Response } from "express";
import { OrderModel } from "../model/order";
import { CartModel } from "../model/cart";
import { ProductModel } from "../model/product";

// CREATE ORDER FROM CART
export const createOrder = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "User not authenticated",
      });
    }
    const userId = req.user._id;
    const { billingDetails } = req.body;

    // 1. Get user cart
    const cart = await CartModel.findOne({ userId }).populate(
      "items.productId",
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Cart is empty",
      });
    }

    // 2. Calculate total amount and create order items
    let totalAmount = 0;

    const orderItems = cart.items.map((item: any) => {
      const product = item.productId;
      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      return {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal: subtotal,
      };
    });

    // 3. Create order
    const order = await OrderModel.create({
      user: userId,
      items: orderItems,
      totalAmount,
      orderStatus: "pending",
      paymentStatus: "pending",
    });

    // 4. Clear cart
    await CartModel.findOneAndUpdate(
      { userId },
      { items: [] }
    );

    res.status(201).json({
      status: "success",
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// GET MY ORDERS
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "User not authenticated",
      });
    }

    const orders = await OrderModel.find({ user: req.user._id }).populate(
      "items.product",
    );

    res.status(200).json({
      status: "success",
      results: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// GET ALL ORDERS (ADMIN)
export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await OrderModel.find()
      .populate("user")
      .populate("items.product");

    res.status(200).json({
      status: "success",
      results: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// UPDATE ORDER STATUS (ADMIN)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const order = await OrderModel.findByIdAndUpdate(
      req.params.id,
      { orderStatus, paymentStatus },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: order,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
