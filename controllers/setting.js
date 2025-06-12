const { validationResult } = require("express-validator");
const timezoneRule = require("../validators/settings")
const withValidator = require("../helper/validator")
const { saveGlobalTimezone, getGlobalTimezone } = require("../config/datastore")
const moment = require("moment-timezone")

const getTimezones = (req, res) => {
  const timezones = moment.tz.names()
  res.json({ timezones: timezones });
};

const getTimezone = (req, res) => {
  getGlobalTimezone((d) => {
    res.json({ timezone: d })
  }, (e) => {
    console.error("Error fetching global timezone", e)
    res.status(500).json({ error: 'A server error has occured, contact system admin' });
  })
};

const updateTimezone = (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(400).json(result.array());

  saveGlobalTimezone(req.body.timezone, (d) => {
    res.json({ timezone: req.body.timezone })
  }, (e) => {
    console.error("Error while saving global timezone", e)
    res.status(500).json({ error: 'A server error has occured, contact system admin' });
  })
};

module.exports = {
  getTimezones,
  getTimezone,
  updateTimezone: withValidator(timezoneRule, updateTimezone)
};