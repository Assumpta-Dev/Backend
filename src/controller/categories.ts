import type { Request, Response } from "express";
import { CategoryModel } from "../model/category";

// GET ALL CATEGORIES
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.find();

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get categories",
    });
  }
};

// GET CATEGORY BY ID
export const getCategoryById = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const category = await CategoryModel.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get category",
    });
  }
};

// CREATE CATEGORY
export const createCategory = async (req: Request, res: Response) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    console.log('Content-Type:', req.headers['content-type']);
    
    // Handle multipart form data
    const name = req.body?.name || req.body?.categoryName || '';
    const description = req.body?.description || '';

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // Get uploaded image URL
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    const category = await CategoryModel.create({
      name: name.trim(),
      description: description.trim(),
      image,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error: any) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create category",
    });
  }
};

// UPDATE CATEGORY
export const updateCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  
  try {
    // Handle case where req.body might be undefined
    const name = req.body?.name || '';
    const description = req.body?.description || '';
    
    const updateData: any = { name, description };
    
    // Add image if uploaded
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const category = await CategoryModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update category",
    });
  }
};

// DELETE CATEGORY
export const deleteCategory = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const category = await CategoryModel.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete category",
    });
  }
};
