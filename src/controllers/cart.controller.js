import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const TAX_RATE = 0.05;

//add products to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid productId and quantity are required",
      });
    }

    //check for product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne();

    //create cart if not
    if (!cart) {
      cart = await Cart.create({ items: [] });
    }

    //check item existence in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    const updatedQuantity = (existingItem?.quantity || 0) + quantity;

    if (updatedQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity exceeds available stock",
      });
    }

    if (existingItem) {
      existingItem.quantity = updatedQuantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity == null || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid productId and quantity are required",
      });
    }

    //check for cart existence
    const cart = await Cart.findOne();

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    //check for item index
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    //update the quantity
    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const product = await Product.findById(productId);
      if (!product || quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: "Invalid quantity for product",
        });
      }

      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update cart item",
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "ProductId is required",
      });
    }

    const cart = await Cart.findOne();

    //check for cart existence
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    //check for item index
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    //remove the item
    cart.items.splice(itemIndex, 1);

    await cart.save();

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to remove item from cart",
    });
  }
};

export const getCartSummary = async (_req, res) => {
  try {
    const cart = await Cart.findOne().populate("items.product");

    //check for cart
    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        success: true,
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

    //add tax
    const tax = Number((subtotal * TAX_RATE).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));

    return res.status(200).json({
      success: true,
      items: cart.items,
      subtotal,
      tax,
      total,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cart summary",
    });
  }
};
