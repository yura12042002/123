const express = require("express");
const router = express.Router();

const { getRegistrationStatus, getResetStatus } = require("../controllers/statusController");

router.get("/status/:telegram", getRegistrationStatus);
router.get("/check-reset-status/:telegram", getResetStatus);

module.exports = router;
