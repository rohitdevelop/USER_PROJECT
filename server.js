// server.js
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");

// Load environment variables
dotenv.config();

// Import routes and database connection
const userRouter = require("./src/routes/user.route");
const indexRouter = require("./src/routes/index.route");
const connectDB = require("./src/config/db");

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Set EJS as the template engine
app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "ejs");

// Routes
app.use("/", indexRouter);
app.use("/user", userRouter);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
