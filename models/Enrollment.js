const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  enrollmentId: { type: String, unique: true, required: true },
  studentName: { type: String },
  department: { type: String, required: true }, // ✅ add this
  courses: [
    {
      code: String,
      name: String,
      fee: Number
    }
  ],
  totalFees: Number,
  paidFees: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);
