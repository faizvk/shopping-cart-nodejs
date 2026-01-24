import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    if (!name || price == null || stock == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (price < 0 || stock < 0) {
      return res
        .status(400)
        .json({ message: "Price and stock must be non-negative" });
    }

    const product = await Product.create({ name, price, stock });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
