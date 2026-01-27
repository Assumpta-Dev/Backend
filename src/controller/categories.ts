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
  } catch (error) {
    console.log(error);
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
  } catch (error) {
    console.log(error);
  }
};

// CREATE CATEGORY
export const createCategory = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  try {
    await CategoryModel.create({
      name,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

// UPDATE CATEGORY
export const updateCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, description } = req.body || {};

  try {
    const category = await CategoryModel.findByIdAndUpdate(id, {
      name,
      description,
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
    });
  } catch (error) {
    console.log(error);
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
  } catch (error) {
    console.log(error);
  }
};
