import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth";
import categoriesRoutes from "./routes/categories";
import productsRoutes from "./routes/products";
import usersRouter from "./routes/users";
import orderRouter from "./routes/order";
import cartsRouter from "./routes/cart";
import uploadRoutes from "./routes/upload";
import swagger from "./config/swagger";
import connectdb from "./database.connect";

dotenv.config();

const PORT = process.env.PORT || 7000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/category", categoriesRoutes);
app.use("/product", productsRoutes);
app.use("/users", usersRouter);
app.use("/orders", orderRouter);
app.use("/cart", cartsRouter);
app.use("/api/uploads", uploadRoutes);

// Swagger
app.use("/api-docs", swagger);

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ❗ Error handler MUST be last
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message || "Internal server error",
      });
    }

    next();
  },
);

app.get("/", (_req, res) => {
  res.json({ message: "Welcome to the API" });
});

const startServer = async () => {
  try {
    await connectdb();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
  }
};

startServer();

export default app;
