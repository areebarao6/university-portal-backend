const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getDashboard } = require("../controllers/dashboardController");
const { seedData } = require("../controllers/seedController");

router.get("/", auth, getDashboard);
router.post("/seed", auth, seedData);

module.exports = router; // ✅ FIXED

