import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const TAX_RATE = 0.05;

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity == null || quantity <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne();
    if (!cart) {
      cart = await Cart.create({ items: [] });
    }

    const item = cart.items.find((i) => i.product.toString() === productId);

    const currentQty = item ? item.quantity : 0;

    if (currentQty + quantity > product.stock) {
      return res.status(400).json({ message: "Exceeds available stock" });
    }

    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity == null || quantity < 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const product = await Product.findById(productId);
    if (!product || quantity > product.stock) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const cart = await Cart.findOne();
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find((i) => i.product.toString() === productId);

    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    if (quantity === 0) {
      cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCartSummary = async (req, res) => {
  try {
    const cart = await Cart.findOne().populate("items.product");

    if (!cart) {
      return res.status(200).json({
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
      });
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    res.status(200).json({
      items: cart.items,
      subtotal,
      tax,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
