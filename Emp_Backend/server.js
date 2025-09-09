const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const logger = require("./middleware/logger");
const employeeRoutes = require("./routes/employeeRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

// 🔹 Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to handle form-data for multer
app.use(logger);


// serve uploads folder so frontend can access photos
app.use("/uploads", express.static("uploads"));

// 🔹 Routes
app.use("/api/auth", authRoutes);      // signup/login
app.use("/api", employeeRoutes);       // other employee routes


// 🔹 Error handler
app.use(errorHandler);

// 🔹 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
