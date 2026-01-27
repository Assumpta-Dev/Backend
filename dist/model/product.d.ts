import mongoose, { Document } from "mongoose";
export interface Product extends Document {
    id: string;
    name: string;
    price: number;
    description?: string;
    categoryId: string;
    inStock: boolean;
    quantity: number;
    images: string[];
}
export declare const ProductModel: mongoose.Model<Product, {}, {}, {}, mongoose.Document<unknown, {}, Product, {}, mongoose.DefaultSchemaOptions> & Product & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, Product>;
//# sourceMappingURL=product.d.ts.map