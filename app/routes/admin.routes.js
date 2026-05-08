const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const { protect } = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const upload = require("../middleware/upload.middleware");

//  ADMIN DASHBOARD
router.get(
  "/dashboard",
  protect,
  authorizeRoles("admin"),
  adminController.dashboard,
);

//  GET ALL PRODUCTS
router.get(
  "/products",
  protect,
  authorizeRoles("admin"),
  adminController.getAllProducts,
);

//  CREATE PRODUCT PAGE
router.get(
  "/products/create",
  protect,
  authorizeRoles("admin"),
  adminController.createProductPage,
);

//  CREATE PRODUCT PAGE
router.post(
  "/products",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  adminController.createProduct,
);

//  EDIT PRODUCT
router.get(
  "/products/edit/:id",
  protect,
  authorizeRoles("admin"),
  adminController.editProductPage,
);

//  UPDATE PRODUCT
router.put(
  "/products/:id",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  adminController.updateProduct,
);

//  SOFT DELETE
router.delete(
  "/products/:id",
  protect,
  authorizeRoles("admin"),
  adminController.softDeleteProduct,
);

//  HARD DELETE
router.delete(
  "/products/hard-delete/:id",
  protect,
  authorizeRoles("admin"),
  adminController.hardDeleteProduct,
);

//  TOGGLE STATUS
router.patch(
  "/products/status/:id",
  protect,
  authorizeRoles("admin"),
  adminController.toggleStatus,
);

//  TRASH PAGE
router.get(
  "/trash",
  protect,
  authorizeRoles("admin"),
  adminController.trashProducts,
);

//  RESTORE PRODUCT
router.patch(
  "/products/restore/:id",
  protect,
  authorizeRoles("admin"),
  adminController.restoreProduct,
);

module.exports = router;
