const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// ==============================
// 📝 REGISTER SERVICE
// ==============================
const registerUser = async ({ name, email, password }) => {
  // Check existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return user;
};

// ==============================
// 🔐 LOGIN SERVICE
// ==============================
const loginUser = async ({ email, password }) => {
  // Get user with password
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // Create JWT
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  return { user, token };
};

module.exports = {
  registerUser,
  loginUser,
};
