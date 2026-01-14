import mongoose, { Document } from "mongoose";
export interface Category extends Document {
    id: string;
    name: string;
    description?: string;
}
export declare const CategoryModel: mongoose.Model<Category, {}, {}, {}, mongoose.Document<unknown, {}, Category, {}, mongoose.DefaultSchemaOptions> & Category & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, Category>;
//# sourceMappingURL=category.d.ts.map