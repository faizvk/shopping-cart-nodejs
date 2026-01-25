import express from "express";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";

const app = express();

app.use(express.json());

//routes for handling product
app.use("/api/products", productRoutes);

//routes for handling cart
app.use("/api/cart", cartRoutes);

export default app;
