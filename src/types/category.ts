import mongoose, { Schema, Document } from "mongoose";

export interface Category extends Document {
  id: string;
  name: string;
  description?: string;
}

const categorySchema = new Schema<Category>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

export const CategoryModel = mongoose.model<Category>(
  "Category",
  categorySchema
);
