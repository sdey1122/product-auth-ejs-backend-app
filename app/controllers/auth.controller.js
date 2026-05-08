const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

class AuthController {
  //    Register
  async register(req, res) {
    try {
      const { name, email, password, confirmPassword } = req.body;

      if (!name || !email || !password || !confirmPassword) {
        return res.render("auth/register", {
          error: "All fields are required",
        });
      }

      if (password !== confirmPassword) {
        return res.render("auth/register", {
          error: "Passwords do not match",
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.render("auth/register", {
          error: "Email already registered",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({
        name,
        email,
        password: hashedPassword,
        role: "user",
      });

      return res.redirect("/login");
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      res.status(500).send("Register Error");
    }
  }

  //    Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return res.render("auth/login", {
          error: "Invalid email or password",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.render("auth/login", {
          error: "Invalid email or password",
        });
      }

      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
          name: user.name,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
      );

      res.cookie("token", token, {
        httpOnly: true,
      });

      if (user.role === "admin") {
        return res.redirect("/admin/dashboard");
      }

      return res.redirect("/products");
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      res.status(500).send("Login Error");
    }
  }

  //    Logout
  async logout(req, res) {
    try {
      res.clearCookie("token");
      res.redirect("/login");
    } catch (error) {
      console.error(error);
      res.status(500).send("Logout Error");
    }
  }
}

module.exports = new AuthController();
