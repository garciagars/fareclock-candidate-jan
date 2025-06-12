const { body } = require("express-validator");
const moment = require("moment-timezone")

const timezones = moment.tz.names()

module.exports = [
  body("timezone")
    .notEmpty()
    .custom(value => {
      if (!timezones.some(tz => tz == value))
        throw new Error("Invalid timezone/format")
      return true
    })
]