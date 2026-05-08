const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.redirect("/login");
    }

    //  Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  Get User From DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.redirect("/login");
    }
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.redirect("/login");
  }
};

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      req.user = user || null;
    } else {
      req.user = null;
    }

    res.locals.user = req.user;

    next();
  } catch (error) {
    req.user = null;
    res.locals.user = null;
    next();
  }
};

module.exports = {
  protect,
  isAuthenticated,
};
