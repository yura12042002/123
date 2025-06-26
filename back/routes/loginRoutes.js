const express = require("express");
const {
  requestLoginCode,
  verifyLoginCode,
} = require("../controllers/loginController");

const router = express.Router();

router.post("/", requestLoginCode);
router.post("/verify", verifyLoginCode);

module.exports = router;
