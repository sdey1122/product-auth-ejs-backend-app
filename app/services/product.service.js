const Product = require("../models/product.model");
const slugify = require("slugify");
const cloudinary = require("../config/cloudinary");

//  CREATE PRODUCT
const createProductService = async (data, file, userId) => {
  const { name, description, category, size, price, stock, status } = data;

  const slug = slugify(name, { lower: true });

  let image = {};
  if (file) {
    image = {
      url: file.path,
      public_id: file.filename,
    };
  }

  const product = await Product.create({
    name,
    slug,
    description,
    category,
    size: Array.isArray(size) ? size : [size],
    price,
    stock,
    status,
    image,
    createdBy: userId,
  });

  return product;
};

//  UPDATE PRODUCT
const updateProductService = async (id, data, file) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  const { name, description, category, size, price, stock, status } = data;

  if (name) {
    product.slug = slugify(name, { lower: true });
  }

  // Replace Image If New Uploaded
  if (file) {
    if (product.image?.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }

    product.image = {
      url: file.path,
      public_id: file.filename,
    };
  }

  //    Update Fields
  product.name = name;
  product.description = description;
  product.category = category;
  product.size = Array.isArray(size) ? size : [size];
  product.price = price;
  product.stock = stock;
  product.status = status;

  await product.save();

  return product;
};

//  SOFT DELETE
const softDeleteProductService = async (id) => {
  await Product.findByIdAndUpdate(id, {
    isDeleted: true,
  });
};

//  HARD DELETE
const hardDeleteProductService = async (id) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  // Delete Image From Cloudinary
  if (product.image?.public_id) {
    await cloudinary.uploader.destroy(product.image.public_id);
  }

  await Product.findByIdAndDelete(id);
};

//  TOGGLE STATUS
const toggleProductStatusService = async (id) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  product.status = product.status === "active" ? "inactive" : "active";

  await product.save();

  return product;
};

//  FILTER PRODUCTS (USER SIDE)
const getFilteredProductsService = async (query) => {
  let { category, size, minPrice, maxPrice, search } = query;

  let filter = {
    status: "active",
    isDeleted: false,
  };

  if (category) {
    filter.category = category;
  }

  if (size) {
    filter.size = { $in: [size] };
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (search) {
    filter.$or = [{ name: { $regex: search, $options: "i" } }];
  }

  const products = await Product.find(filter)
    .populate("category")
    .sort({ createdAt: -1 });

  return products;
};

module.exports = {
  createProductService,
  updateProductService,
  softDeleteProductService,
  hardDeleteProductService,
  toggleProductStatusService,
  getFilteredProductsService,
};
