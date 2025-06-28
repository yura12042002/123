const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  telegram: { type: String },
  guests: { type: Number, default: 1 },
  dateFrom: { type: Date, required: true },
  dateTo: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "confirmed", "rejected"], default: "pending" },
});

module.exports = mongoose.model("Booking", bookingSchema);
