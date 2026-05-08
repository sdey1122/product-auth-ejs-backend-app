const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "product-auth-ejs-backend-app",
    });
    console.log("MongoDB Connected Successfully");
    console.log(`DB Name: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
