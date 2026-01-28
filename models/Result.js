const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  semester: Number,
  subjects: [
    { name: String, grade: String, marks: Number }
  ],
  gpa: Number,
}, { timestamps: true });

module.exports = mongoose.model("Result", resultSchema);


