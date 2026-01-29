import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 7000;
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // This allows the frontend to talk to this backend

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/category", categoriesRoutes);
app.use("/api/product", productsRoutes);
app.use("/api/users", usersRouter);
app.use("/api/orders", orderRouter);
app.use("/api/cart", cartsRouter);
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

// Initialize database connection
connectdb().catch(console.error);

// For local development
if (process.env.NODE_ENV !== 'production') {
  const startServer = async () => {
    try {
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error("Server failed to start:", error);
    }
  };
  startServer();
}

export default app;