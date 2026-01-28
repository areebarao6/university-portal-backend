console.log("Server file loaded");

const express = require("express");
//const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
//dotenv.config();

// Connect to MongoDB
connectDB();
console.log("connectDB:", connectDB);

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

// Test route
app.get("/", (req, res) => {
  res.send("Karachi University Portal Backend Running");
});

console.log("About to start server...");

// Server listen
const PORT = process.env.PORT || 7050;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
