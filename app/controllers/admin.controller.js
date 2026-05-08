const Product = require("../models/product.model");
const User = require("../models/user.model");
const slugify = require("slugify");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

class AdminController {
  //    Dashboard
  async dashboard(req, res) {
    try {
      const totalProducts = await Product.countDocuments({ isDeleted: false });
      const activeProducts = await Product.countDocuments({
        status: "active",
        isDeleted: false,
      });
      const inactiveProducts = await Product.countDocuments({
        status: "inactive",
        isDeleted: false,
      });
      const totalUsers = await User.countDocuments();

      res.render("admin/dashboard", {
        title: "Admin Dashboard",
        totalProducts,
        activeProducts,
        inactiveProducts,
        totalUsers,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }

  //    Get All Products
  async getAllProducts(req, res) {
    try {
      const products = await Product.find({ isDeleted: false }).sort({
        createdAt: -1,
      });

      res.render("admin/product-list", {
        title: "All Products",
        products,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }

  //    Create Product
  async createProductPage(req, res) {
    try {
      res.render("admin/create-product", {
        title: "Create Product",
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error loading page");
    }
  }

  //    Create
  async createProduct(req, res) {
    try {
      const { name, description, category, size, price, stock, status } =
        req.body;

      //    Generate slug
      const slug = slugify(name, { lower: true });

      //    Handle image
      let image = {};

      if (req.file) {
        const uploadFromBuffer = () => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "products" },
              (error, result) => {
                if (result) resolve(result);
                else reject(error);
              },
            );

            streamifier.createReadStream(req.file.buffer).pipe(stream);
          });
        };

        const result = await uploadFromBuffer();

        image = {
          url: result.secure_url,
          public_id: result.public_id,
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
        createdBy: req.user._id,
      });

      res.redirect("/admin/products");
    } catch (error) {
      console.error(error);
      res.status(500).send("Create Product Error");
    }
  }

  //    Edit Product
  async editProductPage(req, res) {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).send("Product Not Found");
      }

      res.render("admin/edit-product", {
        title: "Edit Product",
        product,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }

  //    Update Product
  async updateProduct(req, res) {
    try {
      const { name, description, category, size, price, stock, status } =
        req.body;

      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).send("Product Not Found");
      }

      if (name) {
        product.slug = slugify(name, { lower: true });
      }

      //    Replace Image If New Uploaded
      if (req.file) {
        // Delete old image
        if (product.image?.public_id) {
          await cloudinary.uploader.destroy(product.image.public_id);
        }

        product.image = {
          url: req.file.path,
          public_id: req.file.filename,
        };
      }

      // Update fields
      product.name = name;
      product.description = description;
      product.category = category;
      product.size = Array.isArray(size) ? size : [size];
      product.price = price;
      product.stock = stock;
      product.status = status;

      await product.save();

      res.redirect("/admin/products");
    } catch (error) {
      console.error(error);
      res.status(500).send("Update Error");
    }
  }

  //    Soft Delete
  async softDeleteProduct(req, res) {
    try {
      await Product.findByIdAndUpdate(req.params.id, {
        isDeleted: true,
      });

      res.redirect("/admin/products");
    } catch (error) {
      console.error(error);
      res.status(500).send("Delete Error");
    }
  }

  async hardDeleteProduct(req, res) {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).send("Product Not Found");
      }

      //    Delete Image From Cloudinary
      if (product.image?.public_id) {
        await cloudinary.uploader.destroy(product.image.public_id);
      }

      await Product.findByIdAndDelete(req.params.id);

      res.redirect("/admin/products");
    } catch (error) {
      console.error(error);
      res.status(500).send("Hard Delete Error");
    }
  }

  //    Active And Inactive Product
  async toggleStatus(req, res) {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).send("Product Not Found");
      }

      product.status = product.status === "active" ? "inactive" : "active";

      await product.save();

      res.redirect("/admin/products");
    } catch (error) {
      console.error(error);
      res.status(500).send("Status Error");
    }
  }

  //    Restore Product
  async restoreProduct(req, res) {
    try {
      await Product.findByIdAndUpdate(req.params.id, {
        isDeleted: false,
      });

      res.redirect("/admin/trash");
    } catch (error) {
      console.error(error);
      res.status(500).send("Restore Error");
    }
  }

  //    Trash
  async trashProducts(req, res) {
    try {
      const products = await Product.find({ isDeleted: true }).sort({
        createdAt: -1,
      });

      res.render("admin/trash", {
        title: "Trash Products",
        products,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Trash Error");
    }
  }
}

module.exports = new AdminController();
