const express = require("express");
const router = express.Router();
const { sendRegistrationCode } = require("../controllers/registrationController");

router.post("/", sendRegistrationCode);

module.exports = router;
