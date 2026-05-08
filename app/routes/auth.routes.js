const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

//  REGISTER
router.post("/register", authController.register);

//  LOGIN
router.post("/login", authController.login);

//  LOGOUT (GET)
router.get("/logout", authController.logout);

module.exports = router;
