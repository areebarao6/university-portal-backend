const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const Result = require("../models/Result");
const Fee = require("../models/Fee");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, enrollmentId } = req.body;

    if (!name || !email || !password || !enrollmentId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find enrollment
    const enrollment = await Enrollment.findOne({ enrollmentId });
    if (!enrollment)
      return res.status(400).json({ message: "Enrollment ID does not exist" });
    if (enrollment.user)
      return res.status(400).json({ message: "This enrollment ID is already registered" });

    // Check email
    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ message: "Email already registered" });

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      enrollmentId: enrollment.enrollmentId,
      department: enrollment.department,
    });

    // Link enrollment
    enrollment.user = user._id;
    await enrollment.save();

    // ✅ Create Result with initial GPA
    await Result.create({
      userId: user._id,           // link to user
      enrollmentId: enrollment.enrollmentId, // optional
      semester: 1,
      gpa: 3.4,                   // initial GPA
      subjects: []                // optional, later add subjects
    });

    // ✅ Create Fee
    const totalFee = enrollment.courses.reduce((sum, c) => sum + c.fee, 0);
    await Fee.create({
      userId: user._id,
      enrollmentId: enrollment.enrollmentId,
      totalFee,
      paidAmount: 0,
      status: "Pending"
    });

    // JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        enrollmentId: user.enrollmentId,
        department: user.department
      },
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { enrollmentId, password } = req.body;
    if (!enrollmentId || !password) return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ enrollmentId });
    if (!user) return res.status(400).json({ message: "Invalid Enrollment ID" });

    const isMatch = await bcrypt.compare(password, user.password); // ✅ works because model hashed
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        enrollmentId: user.enrollmentId,
        department: user.department
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not found" });

    // ✅ generate a reset token (expires in 15 min)
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    // normally send via email, here return in response for testing
    res.json({ message: "Reset token generated", resetToken });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: "Token and new password are required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = newPassword; // ✅ plain, model will hash
    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};




