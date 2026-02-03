import type { Request, Response } from "express";
import { ProductModel } from "../model/product";

/**
 * GET ALL PRODUCTS (PUBLIC)
 */
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.find()
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

/**
 * GET PRODUCT BY ID (PUBLIC)
 */
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findById(req.params.id).populate(
      "categoryId",
      "name",
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }
};

/**
 * CREATE PRODUCT (VENDOR)
 */
export const createProduct = async (req: Request, res: Response) => {
  try {
    // Handle case where req.body might be undefined
    const name = req.body?.name || '';
    const price = req.body?.price || 0;
    const description = req.body?.description || '';
    const categoryId = req.body?.categoryId || '';
    const quantity = req.body?.quantity || 0;
    const inStock = req.body?.inStock !== undefined ? req.body.inStock : true;

    if (!name || !price || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "name, price and categoryId are required",
      });
    }
    // Get uploaded image URLs
   const images =
      req.files && Array.isArray(req.files)
        ? req.files.map((file) => `/uploads/${file.filename}`)
        : [];

    const product = await ProductModel.create({
      name,
      price,
      description,
      categoryId,
      vendorId: req.user?._id?.toString(), // Convert ObjectId to string
      quantity,
      images,
      inStock,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully with images",
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create product",
    });
  }
};

/**
 * UPDATE PRODUCT (VENDOR)
 */
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update product",
    });
  }
};

/**
 * DELETE PRODUCT (VENDOR)
 */
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};
