import mongoose from "mongoose";
const connectdb = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        await mongoose.connect(mongoURI || "mongodb://localhost:27017/stock");
        console.log("Database connected successfully");
    }
    catch (error) {
        console.error("Database connection failed:", error);
    }
};
export default connectdb;
//# sourceMappingURL=database.connect.js.map