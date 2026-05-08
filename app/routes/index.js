const express = require("express");
const router = express.Router();

// Import route modules
const authRoutes = require("./auth.routes");
const adminRoutes = require("./admin.routes");
const productRoutes = require("./product.routes");

// ==============================
// 🏠 HOME PAGE
// ==============================
router.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

// ==============================
// 🔐 AUTH PAGES (GET ONLY)
// ==============================
router.get("/login", (req, res) => {
  res.render("auth/login", { title: "Login" });
});

router.get("/register", (req, res) => {
  res.render("auth/register", { title: "Register" });
});

//  CONNECT MODULE ROUTES
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/products", productRoutes);

router.use((req, res) => {
  res.status(404).send("Page Not Found");
});

module.exports = router;
