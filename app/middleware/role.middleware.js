const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.redirect("/login");
      }

      //    Check Role
      if (!roles.includes(req.user.role)) {
        return res.status(403).send("Access Denied: You are not authorized");
      }

      next();
    } catch (error) {
      console.error("Role Middleware Error:", error.message);
      res.status(500).send("Server Error");
    }
  };
};

module.exports = authorizeRoles;
