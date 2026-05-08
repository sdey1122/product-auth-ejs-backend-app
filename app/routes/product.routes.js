const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { protect } = require("../middleware/auth.middleware");

//  GET ALL PRODUCTS (USER)
router.get("/", protect, productController.getProducts);

//  PRODUCT DETAILS (BY SLUG)
router.get("/:slug", protect, productController.getProductDetails);

module.exports = router;
