import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
const router = express.Router();
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Backend API Documentation",
            version: "1.0.0",
            description: "This is the API documentation for the backend services.",
        },
        servers: [
            {
                url: "http://localhost:7000",
                description: "Local server",
            },
        ],
        tags: [
            { name: "Auth", description: "Authentication endpoints" },
            { name: "Users", description: "User management" },
            { name: "Products", description: "Product management" },
            { name: "Categories", description: "Category management" },
            { name: "Orders", description: "Order management" },
            { name: "Carts", description: "Shopping cart management" },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter JWT token as: Bearer <token>",
                },
            },
        },
        // Global security (optional but recommended)
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [
        "./src/routes/auth.ts",
        "./src/routes/users.ts",
        "./src/routes/products.ts",
        "./src/routes/categories.ts",
        "./src/routes/order.ts",
        "./src/routes/cart.ts",
    ],
};
const swaggerSpec = swaggerJSDoc(options);
// JSON endpoint
router.get("/json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});
// Swagger UI
router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
export default router;
export { swaggerSpec };
//# sourceMappingURL=swagger.js.map