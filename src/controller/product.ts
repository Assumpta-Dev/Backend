import type { Request, Response } from "express";
import  {ProductModel}  from "../types/product";

//GET ALL PRODUCTS 
export const getAllProducts = async (req: Request, res: Response) => {
  const products = await ProductModel.find();

  try {
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//GET PRODUCT BY ID
export const getProductById = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const products = await ProductModel.findById(id);
    if (!products) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//CREATE PRODUCT
export const createProduct = async (req: Request, res: Response) => {
  const { name, price, description, categoryId, inStock, quantity } = req.body;

  try {
    const products = await ProductModel.create({
      name,
      price,
      description,
      categoryId,
      inStock,
      quantity,
    });
    res.status(201).json({
      success: true,
      message: "Product created successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

//UPDATE PRODUCT 

export const updateProduct = async (req: Request, res: Response) => {
    const id = req.params.id;
    const { name, price, description, image } = req.body;

    try {
        const products = await ProductModel.findByIdAndUpdate(id, {
            name,
            price,
            description,
            image,
        });
        if (!products) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
        });
    } catch (error) {
        console.log(error);
    }
}

//DELETE PRODUCT

export const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const products = await ProductModel.findByIdAndDelete(id);
    if (!products) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
