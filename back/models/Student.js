const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  telegram: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  age: Number,
  email: { type: String, required: true, unique: true },
  password: String,
  avatarUrl: String,
  registeredAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Student", studentSchema);
