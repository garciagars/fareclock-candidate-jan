const {
  getWorkerShifts: getShifts,
  createWorkerShift,
  destroyWorkerShift,
} = require("../datastores/shift");
const { validationResult } = require("express-validator");
const withValidator = require("../helper/validator");
const shiftRule = require("../validators/shift");
const { DateTime, Interval } = require("luxon");

const getWorkerShifts = async (req, res) => {
  const workerId = req.params.workerId;
  try {
    const shifts = await getShifts(workerId);
    res.status(200).json({ shifts: shifts });
  } catch (err) {
    console.error("Error fetching worker shifts", err);
    res.status(500).json({
      error: "A server error has occurred. Contact system admin.",
    });
  }
};

const buildTimeGrid = (startISO, endISO) => {
  const start = DateTime.fromISO(startISO);
  const end = DateTime.fromISO(endISO);
  const grid = [];

  let cursor = start.startOf("day");
  while (cursor <= end) {
    const cursorStart = cursor.set({ hour: start.hour, minute: start.minute });
    const cursorEnd = cursor.set({ hour: end.hour, minute: end.minute });
    const duration = cursorEnd.diff(cursorStart, "minutes").minutes / 60;

    grid.push({
      date: cursor.toISODate(),
      interval: Interval.fromDateTimes(cursorStart, cursorEnd),
      duration,
    });
    cursor = cursor.plus({ day: 1 });
  }
  return grid;
};

const validateShift = async (workerId, start, end) => {
  let shifts = await getShifts(workerId);

  const existingShiftGrids = shifts.map((shift) =>
    buildTimeGrid(shift.start, shift.end)
  );

  const newShiftGrid = buildTimeGrid(start, end);

  let result = {
    overlap: false,
    hour_limit: false,
    overlap_dates: [],
    hour_limit_dates: [],
  };

  let durations = {};

  for (const newDay of newShiftGrid) {
    // list of new dates
    for (const existingGrid of existingShiftGrids) {
      // list of list of current date shifts
      for (const existingDay of existingGrid) {
        // list of current date shifts
        if (newDay.date === existingDay.date) {
          durations[newDay.date] = durations[newDay.date]
            ? durations[newDay.date] + existingDay.duration
            : existingDay.duration;
          if (newDay.interval.overlaps(existingDay.interval)) {
            result.overlap = true;
            result.overlap_dates.push(newDay.date);
          }
          if (newDay.duration + durations[newDay.date] > 12) {
            result.hour_limit = true;
            result.hour_limit_dates.push(newDay.date);
          }
        }
      }
    }
  }

  return result;
};

const newWorkerShift = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());

  const workerId = req.params.workerId;
  const { start, end } = req.body;

  const shiftValidationResult = await validateShift(workerId, start, end);
  if (
    shiftValidationResult.overlap ||
    shiftValidationResult.hour_limit
  )
    res.status(400).json(shiftValidationResult);
  else
    createWorkerShift(
      workerId,
      start,
      end,
      (d) => res.status(201).json(d),
      (err) => {
        console.error("Error creating worker shift", err);
        res.status(500).json({
          error: "A server error has occurred. Contact system admin.",
        });
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
