const { body } = require("express-validator");

module.exports = [body("name").notEmpty()];
