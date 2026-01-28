const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: String,
  creditHours: Number,
  deadline: Date,
  fee: Number

});

module.exports = mongoose.model("Course", courseSchema);
