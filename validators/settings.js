const { body } = require("express-validator");

module.exports = [
  body("timezone").notEmpty(),
]