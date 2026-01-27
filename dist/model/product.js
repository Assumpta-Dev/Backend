import mongoose, { Schema } from "mongoose";
const productSchema = new Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: [0, "Price cannot be negative"],
    },
    description: {
        type: String,
        trim: true,
    },
    categoryId: {
        type: String,
        required: [true, "Category ID is required"],
    },
    inStock: {
        type: Boolean,
        default: true,
    },
    quantity: {
        type: Number,
        default: 1,
    },
    images: {
        type: [String],
        default: [],
    }
}, {
    timestamps: true
});
export const ProductModel = mongoose.model("Product", productSchema);
//# sourceMappingURL=product.js.map