const { validationResult } = require("express-validator");
const timezoneRule = require("../validators/settings")
const withValidator = require("../helper/validator")
require("../config/datastore")

const getTimezones = (req, res) => {
  res.json({ timezones: [] });
};

const getTimezone = (req, res) => {
  res.json({ timezone: "UTC" });
};

const updateTimezone = (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(400).json(result.array());

  res.json({ timezone: req.body.timezone });
};

module.exports = {
  getTimezones,
  getTimezone,
  updateTimezone: withValidator(timezoneRule, updateTimezone)
};