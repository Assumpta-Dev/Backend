import dotenv from "dotenv";
import morgan from "morgan";
import authRoutes from "./routes/auth";
import express from "express";
import categoriesRoutes from "./routes/categories";
import productsRoutes from "./routes/products";
import authenticationRouter from "./routes/auth";
import usersRouter from "./routes/users";
import connectdb from "./database.connect";
dotenv.config();
const PORT = process.env.PORT || 6000;
const app = express();
app.use(morgan("dev"));
app.use(express.json());
//routes
app.use("/category", categoriesRoutes);
app.use("/product", productsRoutes);
app.use("/auth", authenticationRouter);
app.use("/auth", authRoutes);
app.use("/users", usersRouter);
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the API" });
});
const startServer = async () => {
    try {
        await connectdb();
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Server failed to start:", error);
    }
};
startServer();
export default app;
//# sourceMappingURL=index.js.map