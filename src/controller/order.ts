import { Request, Response } from "express";
import { OrderModel } from "../model/order";
import { CartModel } from "../model/cart";
import { ProductModel } from "../model/product";
import nodemailer from "nodemailer";

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

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
      billingDetails,
      orderStatus: "pending",
      paymentStatus: "pending",
    });

    // Send order confirmation email
    transporter.sendMail({
      to: billingDetails.email,
      subject: `Order Confirmation - #${order._id.toString().slice(-6)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #3B82F6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1>Order Confirmed! 🎉</h1>
          </div>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
            <h2>Thank you, ${billingDetails.firstName}!</h2>
            <p>Your order has been successfully placed and is being processed.</p>
            <div style="background: white; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <h3>Order Details:</h3>
              <p><strong>Order ID:</strong> #${order._id.toString().slice(-6)}</p>
              <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
              <p><strong>Status:</strong> Processing</p>
              <p><strong>Items:</strong> ${orderItems.length} item(s)</p>
            </div>
            <p>We'll send you another email when your order ships.</p>
          </div>
          <div style="text-align: center; padding: 20px; color: #777; font-size: 12px;">
            <p>© 2024 Kapee. All rights reserved.</p>
          </div>
        </div>
      `
    }).catch(err => console.log('Order confirmation email failed:', err));

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
      console.error('No user in request');
      return res.status(401).json({
        status: "error",
        message: "User not authenticated",
      });
    }

    console.log('Fetching orders for user:', req.user._id);
    
    const orders = await OrderModel.find({ user: req.user._id }).populate(
      "items.product",
    );

    console.log('Found orders:', orders.length);

    res.status(200).json({
      status: "success",
      results: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Error in getMyOrders:', error);
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

// UPDATE ORDER STATUS (CUSTOMER CAN CANCEL/PAY, ADMIN CAN UPDATE ALL)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const orderId = req.params.id;
    const userId = req.user?._id;
    const userRole = req.user?.role;

    // Find the order first
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    // Check permissions
    if (userRole !== 'admin' && order.user.toString() !== userId?.toString()) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to update this order",
      });
    }

    // Customer restrictions
    if (userRole === 'customer') {
      if (orderStatus && orderStatus !== 'cancelled') {
        return res.status(403).json({
          status: "error",
          message: "Customers can only cancel orders",
        });
      }
      if (orderStatus === 'cancelled' && !['pending', 'confirmed'].includes(order.orderStatus)) {
        return res.status(400).json({
          status: "error",
          message: "Cannot cancel orders that are already shipped or delivered",
        });
      }
      if (paymentStatus && paymentStatus !== 'paid') {
        return res.status(403).json({
          status: "error",
          message: "Invalid payment status",
        });
      }
    }

    const updateData: any = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    ).populate('user', 'firstName lastName email');

    // Send email notifications
    const user = updatedOrder?.user as any;
    if (user) {
      if (paymentStatus === 'paid') {
        transporter.sendMail({
          to: user.email,
          subject: `Payment Confirmed - #${orderId.slice(-6)}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1>Payment Confirmed! ✅</h1>
              </div>
              <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
                <h2>Thank you, ${user.firstName}!</h2>
                <p>Your payment has been successfully processed.</p>
                <div style="background: white; padding: 15px; margin: 20px 0; border-radius: 5px;">
                  <h3>Payment Details:</h3>
                  <p><strong>Order ID:</strong> #${orderId.slice(-6)}</p>
                  <p><strong>Amount Paid:</strong> $${updatedOrder!.totalAmount.toFixed(2)}</p>
                  <p><strong>Payment Status:</strong> Confirmed</p>
                </div>
                <p>Your order is now being prepared for shipment.</p>
              </div>
            </div>
          `
        }).catch(err => console.log('Payment confirmation email failed:', err));
      }
      
      if (orderStatus === 'cancelled') {
        transporter.sendMail({
          to: user.email,
          subject: `Order Cancelled - #${orderId.slice(-6)}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #f44336; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1>Order Cancelled</h1>
              </div>
              <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
                <h2>Hello ${user.firstName},</h2>
                <p>Your order has been successfully cancelled as requested.</p>
                <div style="background: white; padding: 15px; margin: 20px 0; border-radius: 5px;">
                  <h3>Cancellation Details:</h3>
                  <p><strong>Order ID:</strong> #${orderId.slice(-6)}</p>
                  <p><strong>Status:</strong> Cancelled</p>
                  <p><strong>Cancelled On:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
                <p>If any payment was made, the refund will be processed within 3-5 business days.</p>
              </div>
            </div>
          `
        }).catch(err => console.log('Order cancellation email failed:', err));
      }
    }

    res.status(200).json({
      status: "success",
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// DELETE ORDER (CUSTOMER CAN DELETE CANCELLED ORDERS)
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    const userId = req.user?._id;
    const userRole = req.user?.role;

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    // Check permissions
    if (userRole !== 'admin' && order.user.toString() !== userId?.toString()) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to delete this order",
      });
    }

    // Customer can only delete cancelled orders
    if (userRole === 'customer' && order.orderStatus !== 'cancelled') {
      return res.status(400).json({
        status: "error",
        message: "Can only delete cancelled orders",
      });
    }

    await OrderModel.findByIdAndDelete(orderId);

    res.status(200).json({
      status: "success",
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
};