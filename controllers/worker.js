const { validationResult } = require("express-validator");
const withValidator = require("../helper/validator");
const workerRule = require("../validators/worker");
const {
  getAllWorkers,
  getWorkerById,
  createWorker,
  editWorker,
  destroyWorker,
} = require("../datastores/worker");

const getWorkers = (req, res) => {
  getAllWorkers(
    (workers) => res.json({ workers }),
    (err) => {
      console.error("Error fetching workers", err);
      res
        .status(500)
        .json({ error: "A server error has occurred. Contact system admin." });
    }
  );
};

const getWorker = (req, res) => {
  getWorkerById(
    req.params.id,
    (worker) => res.json({ worker }),
    (err) => {
      if (err.notFound)
        return res.status(404).json({ error: "Worker not found" });

      console.error("Error fetching worker", err);
      res
        .status(500)
        .json({ error: "A server error has occurred. Contact system admin." });
    }
  );
};

const newWorker = (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());

  const { name } = req.body;

  createWorker(
    name,
    (worker) => res.status(201).json({ worker }),
    (err) => {
      console.error("Error creating worker", err);
      res
        .status(500)
        .json({ error: "A server error has occurred. Contact system admin." });
    }
  );
};

const updateWorker = (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());

  const { name } = req.body;

  editWorker(
    req.params.id,
    name,
    (worker) => res.json({ worker }),
    (err) => {
      console.error("Error updating worker", err);
      res
        .status(500)
        .json({ error: "A server error has occurred. Contact system admin." });
    }
  );
};

const deleteWorker = (req, res) => {
  destroyWorker(
    req.params.id,
    () => res.json({ success: true }),
    (err) => {
      console.error("Error deleting worker", err);
      res
        .status(500)
        .json({ error: "A server error has occurred. Contact system admin." });
    }
  );
};

module.exports = {
  getWorkers,
  getWorker,
  newWorker: withValidator(workerRule, newWorker),
  updateWorker: withValidator(workerRule, updateWorker),
  deleteWorker,
};
