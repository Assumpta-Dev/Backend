import mongoose, { Schema } from "mongoose";
const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});
export const CategoryModel = mongoose.model("Category", categorySchema);
//# sourceMappingURL=category.js.map