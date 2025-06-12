const {
  getWorkerShifts: getShifts,
  createWorkerShift,
  destroyWorkerShift,
} = require("../datastores/shift");
const { validationResult } = require("express-validator");
const withValidator = require("../helper/validator");
const shiftRule = require("../validators/shift");

const getWorkerShifts = (req, res) => {
  const workerId = req.params.workerId;
  getShifts(
    workerId,
    (shifts) => res.status(200).json({ shifts: shifts }),
    (err) => {
      if (err.notFound) res.status(404).json({ error: "Worker not found" });
      else {
        console.error("Error fetching worker shifts", err);
        res.status(500).json({
          error: "A server error has occurred. Contact system admin.",
        });
      }
    }
  );
};

const newWorkerShift = (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());

  const workerId = req.params.workerId;
  const { start, end } = req.body;
  createWorkerShift(
    workerId,
    start,
    end,
    (d) => res.status(201).json(d),
    (e) => {
      console.error("Error creating worker shift", err);
      res
        .status(500)
        .json({ error: "A server error has occurred. Contact system admin." });
    }
  );
};

const deleteWorkerShift = (req, res) => {
  destroyWorkerShift(
    req.params.id,
    () => res.json({ success: true }),
    (err) => {
      console.error("Error deleting worker shift", err);
      res
        .status(500)
        .json({ error: "A server error has occurred. Contact system admin." });
    }
  );
};

module.exports = {
  getWorkerShifts,
  deleteWorkerShift,
  newWorkerShift: withValidator(shiftRule, newWorkerShift),
};
