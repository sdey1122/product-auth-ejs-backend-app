const Product = require("../models/product.model");

class ProductController {
  //    Get All Products
  async getProducts(req, res) {
    try {
      let { category, size, minPrice, maxPrice, search } = req.query;

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
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
        ];
      }

      const products = await Product.find(filter).sort({ createdAt: -1 });

      res.render("products/index", {
        title: "Products",
        products,
        filters: req.query,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching products");
    }
  }

  //    Product Details
  async getProductDetails(req, res) {
    try {
      const { slug } = req.params;

      const product = await Product.findOne({
        slug,
        status: "active",
        isDeleted: false,
      });

      if (!product) {
        return res.status(404).send("Product not found");
      }

      res.render("products/details", {
        title: product.name,
        product,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching product details");
    }
  }
}

module.exports = new ProductController();
