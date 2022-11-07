import Product from "../models/Products";

export const createProduct = async ({ body }, res) => {
  const newProduct = await Product.create(body);
  res.status(201).json({
    message: "Product created",
    newProduct
  });
};

export const getProducts = async (_, res) => {
  const products = await Product.find();
  res.status(200).json(products);
};

export const getProductById = async ({ params }, res) => {
  const { productId } = params;
  const product = await Product.findById(productId);
  res.status(200).json(product);
};

export const updateProductById = async ({ body, params }, res) => {
  const { productId } = params;
  const updatedProduct = await Product.findByIdAndUpdate(productId, body);
  res.status(200).json({
    message: "Product updated",
    updatedProduct,
  });
};

export const deleteProductById = async ({ params }, res) => {
  const { productId } = params;
  const deletedProduct = await Product.findByIdAndDelete(productId);
  res.status(200).json({
    message: "Product deleted",
    deletedProduct,
  });
};
