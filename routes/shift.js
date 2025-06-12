const express = require("express");
const router = express.Router();
const { getWorkerShifts, newWorkerShift, deleteWorkerShift } = require("../controllers/shift");
const checkWorkerExists = require('../middlewares/shift');

router.get("/worker/:workerId/shift", checkWorkerExists, getWorkerShifts);
router.post("/worker/:workerId/shift", checkWorkerExists, newWorkerShift);
router.delete("/worker/:workerId/shift/:id", checkWorkerExists, deleteWorkerShift);

module.exports = router;
