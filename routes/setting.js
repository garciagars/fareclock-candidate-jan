const express = require("express");
const router = express.Router();
const {
  getTimezones,
  getTimezone,
  updateTimezone,
} = require("../controllers/setting");

router.get("/timezones", getTimezones);
router.get("/timezone", getTimezone);
router.put("/timezone", updateTimezone);

module.exports = router;
