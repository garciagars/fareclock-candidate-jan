const { body } = require("express-validator");

const timezones = Intl.supportedValuesOf('timeZone')

module.exports = [
  body("timezone")
    .notEmpty()
    .custom(value => {
      if (!timezones.some(tz => tz == value))
        throw new Error("Invalid timezone/format")
      return true
    })
]