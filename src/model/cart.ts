import mongoose, { Schema, Document } from "mongoose";

/**
 * CART ITEM INTERFACE
 */
export interface CartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

/**
 * CART INTERFACE
 */
export interface Cart extends Document {
  userId: mongoose.Types.ObjectId;
  items: CartItem[];
}

/**
 * CART ITEM SCHEMA
 */
const cartItemSchema = new Schema<CartItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      required: [true, "Product ID is required"],
      ref: "Product", // optional but recommended if you have a Product model
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
  },
  { _id: false }, // prevents creating a separate _id for each cart item
);

/**
 * CART SCHEMA
 */
const cartSchema = new Schema<Cart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      ref: "User",
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const CartModel = mongoose.model<Cart>("Cart", cartSchema);
