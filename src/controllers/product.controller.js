import Product from "../models/Product.js";

//creating new product
export const createProduct = async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    if (!name || price == null || stock == null) {
      return res.status(400).json({
        success: false,
        message: "Name, price, and stock are required",
      });
    }
    //values should be non-negative
    if (price < 0 || stock < 0) {
      return res.status(400).json({
        success: false,
        message: "Price and stock must be non-negative",
      });
    }

    const product = await Product.create({ name, price, stock });

    //created successfully
    return res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};

export const getProducts = async (_req, res) => {
  try {
    //sort products on descending order
    const products = await Product.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};
