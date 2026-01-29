import mongoose, { Schema, Document } from "mongoose";

export interface Category extends Document {
  id: string;
  name: string;
  image: string; // Add this field
  description?: string;
}

const categorySchema = new Schema<Category>({
  name: {
    type: String,
    required: true,
  },
  image: {
    // Add this field
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false, // Make optional
  },
});

export const CategoryModel = mongoose.model<Category>(
  "Category",
  categorySchema,
);
