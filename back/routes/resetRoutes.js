const express = require("express");
const {
  requestPasswordReset,
  confirmNewPassword,
} = require("../controllers/resetController");

const router = express.Router();

router.post("/", requestPasswordReset);

router.post("/confirm", confirmNewPassword);

module.exports = router;
