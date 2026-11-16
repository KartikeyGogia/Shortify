require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");
const urlRoutes = require("./src/routes/urlRoutes");
const { redirectUrl } = require("./src/controllers/urlController");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/url", urlRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Shortify API Running 🚀");
});


const PORT = process.env.PORT || 5000;
console.log(redirectUrl);
app.get("/:shortCode", redirectUrl);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});