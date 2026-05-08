require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const expressLayouts = require("express-ejs-layouts");
const connectDB = require("./app/config/db");
const routes = require("./app/routes/index");
const { isAuthenticated } = require("./app/middleware/auth.middleware");
const app = express();

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);
app.set("layout", "layouts/main");
app.use(isAuthenticated);
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);

const PORT = process.env.PORT || 5051;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
