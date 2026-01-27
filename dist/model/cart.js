import mongoose, { Schema } from "mongoose";
/**
 * CART ITEM SCHEMA
 */
const cartItemSchema = new Schema({
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
}, { _id: false });
/**
 * CART SCHEMA
 */
const cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: [true, "User ID is required"],
        ref: "User",
    },
    items: {
        type: [cartItemSchema],
        default: [],
    },
}, {
    timestamps: true,
});
export const CartModel = mongoose.model("Cart", cartSchema);
//# sourceMappingURL=cart.js.map