const { body } = require("express-validator");

module.exports = [
  body("start")
    .notEmpty()
    .isISO8601()
    .withMessage("Must be in ISO8601 string format"),
  body("end")
    .notEmpty()
    .isISO8601()
    .withMessage("Must be in ISO8601 string format")
    .custom((end, { req }) => {
      const start = req.body.start;
      if (start && new Date(start) >= new Date(end)) {
        throw new Error("End parameter must be after start");
      }
      return true;
    }),
];
