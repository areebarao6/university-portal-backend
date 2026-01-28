const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { studyAssistant } = require("../controllers/aiController");

// POST /api/ai/chat
router.post("/chat", auth, studyAssistant);

module.exports = router;
