import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import categoriesRoutes from "./routes/categories.js";
import productsRoutes from "./routes/products.js";
import usersRouter from "./routes/users.js";
import orderRouter from "./routes/order.js";
import cartsRouter from "./routes/cart.js";
import uploadRoutes from "./routes/upload.js";
import statsRoutes from "./routes/stats.js";
import swagger from "./config/swagger.js";
import connectdb from "./database.connect.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 7000;
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000', 
    'https://your-frontend-domain.com' // Replace with your actual frontend domain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use("/auth", authRoutes);
app.use("/category", categoriesRoutes);
app.use("/product", productsRoutes);
app.use("/users", usersRouter);
app.use("/orders", orderRouter);
app.use("/cart", cartsRouter);
app.use("/api/uploads", uploadRoutes);
app.use("/stats", statsRoutes);

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

// Start server
const startServer = async () => {
  try {
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
      });
    });
  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
};

startServer();

export default app;