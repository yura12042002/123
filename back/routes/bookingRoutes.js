const express = require("express");
const router = express.Router();
const {
  getUnavailableDates,
  createBooking,
} = require("../controllers/bookingController");

router.get("/unavailable", getUnavailableDates);
router.post("/", createBooking);

module.exports = router;
