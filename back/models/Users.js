const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
  {
    telegramgId: {
      type: Number,
      required: true,
    },
    messages: {
      type: Array,
      required: true,
    },
  },
);

module.exports = mongoose.model("User", userSchema);
