import mongoose, { Document } from "mongoose";
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
export declare const CartModel: mongoose.Model<Cart, {}, {}, {}, mongoose.Document<unknown, {}, Cart, {}, mongoose.DefaultSchemaOptions> & Cart & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, Cart>;
//# sourceMappingURL=cart.d.ts.map