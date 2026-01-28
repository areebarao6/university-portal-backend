const User = require("../models/User");
const Result = require("../models/Result");
const Fee = require("../models/Fee");

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const results = await Result.find({ userId }).sort({ createdAt: 1 });
    const fee = await Fee.findOne({ userId });

    res.status(200).json({
      user,
      stats: {
        gpa: results.length ? results[results.length - 1].gpa : 0,
        pendingFee: fee ? fee.totalFee - fee.paidAmount : 0,
        deadlines: results.length,
      },
      announcements: [
        "Welcome to KU Portal!",
        "Submit your fees before due date",
      ],
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard" });
  }
};


