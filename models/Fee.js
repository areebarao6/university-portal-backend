const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // keep as is
  },
  totalFee: Number,
  paidAmount: Number,
  dueDate: Date,
  status: {
    type: String,
    enum: ["Paid", "Pending"],
    default: "Pending",
  },
}, { timestamps: true });

module.exports = mongoose.model("Fee", feeSchema);


