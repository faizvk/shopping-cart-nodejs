import { Router } from "express";
import {
  addToCart,
  updateCartItem,
  getCartSummary,
} from "../controllers/cart.controller.js";

const router = Router();

router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.get("/summary", getCartSummary);

export default router;
