import mongoose, { Document } from "mongoose";
export interface OrderItem {
    product: mongoose.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
}
export interface Order extends Document {
    user: mongoose.Types.ObjectId;
    items: OrderItem[];
    totalAmount: number;
    orderStatus: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
    paymentStatus: "pending" | "paid" | "failed" | "refunded";
    createdAt: Date;
    updatedAt: Date;
}
export declare const OrderModel: mongoose.Model<Order, {}, {}, {}, mongoose.Document<unknown, {}, Order, {}, mongoose.DefaultSchemaOptions> & Order & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, Order>;
//# sourceMappingURL=order.d.ts.map