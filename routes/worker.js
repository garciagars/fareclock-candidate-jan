const express = require("express");
const router = express.Router();
const {
  getWorkers,
  getWorker,
  newWorker,
  updateWorker,
  deleteWorker,
} = require("../controllers/worker");

router.get("/worker", getWorkers);
router.get("/worker/:id", getWorker);
router.post("/worker/", newWorker);
router.put("/worker/:id", updateWorker);
router.delete("/worker/:id", deleteWorker);

module.exports = router;
