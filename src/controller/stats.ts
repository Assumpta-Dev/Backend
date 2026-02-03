import { Request, Response } from "express";
import { ProductModel } from "../model/product";
import { CategoryModel } from "../model/category";
import { userModel } from "../model/users";
import { OrderModel } from "../model/order";

export const getStats = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    
    if (user.role === 'admin') {
      // Admin sees all statistics
      const [totalProducts, totalCategories, totalUsers, totalVendors, totalCustomers, totalOrders] = await Promise.all([
        ProductModel.countDocuments(),
        CategoryModel.countDocuments(),
        userModel.countDocuments(),
        userModel.countDocuments({ role: 'vendor' }),
        userModel.countDocuments({ role: 'customer' }),
        OrderModel.countDocuments()
      ]);

      res.json({
        totalProducts,
        totalCategories,
        totalUsers,
        totalVendors,
        totalCustomers,
        totalOrders
      });
    } else if (user.role === 'vendor') {
      // Vendor sees only their products and general categories
      const [vendorProducts, totalCategories, vendorOrders] = await Promise.all([
        ProductModel.countDocuments({ vendorId: user._id }),
        CategoryModel.countDocuments(),
        OrderModel.countDocuments({ 'items.product': { $in: await ProductModel.find({ vendorId: user._id }).distinct('_id') } })
      ]);

      res.json({
        totalProducts: vendorProducts,
        totalCategories,
        totalOrders: vendorOrders
      });
    } else {
      res.status(403).json({ message: 'Access denied' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};