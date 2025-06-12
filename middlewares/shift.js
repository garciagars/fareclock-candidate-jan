const { Datastore } = require('@google-cloud/datastore');
const datastore = new Datastore();

const checkWorkerExists = async (req, res, next) => {
  const workerId = req.params.workerId;

  if (!workerId) {
    return res.status(400).json({ error: "Missing workerId" });
  }

  const workerKey = datastore.key(["Worker", datastore.int(workerId)]);

  try {
    const [worker] = await datastore.get(workerKey);
    if (!worker) {
      return res.status(404).json({ error: "Worker not found" });
    }

    // Attach the worker entity if needed downstream
    req.worker = worker;

    next();
  } catch (err) {
    console.error("Datastore error:", err);
    res.status(500).json({ error: "Server error while checking worker" });
  }
};


module.exports = checkWorkerExists