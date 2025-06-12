const { Datastore, PropertyFilter } = require("@google-cloud/datastore");
const datastore = new Datastore();
const kind = "Shift";

const getWorkerShifts = async (workerId, onSuccess, onError) => {
  try {
    const query = datastore.createQuery(kind).filter("workerId", "=", workerId);

    const [entities] = await datastore.runQuery(query);
    const shifts = entities.map((entity) => ({
      id: entity[datastore.KEY].id,
      ...entity,
    }));
    onSuccess(shifts);
  } catch (err) {
    onError(err);
  }
};

const createWorkerShift = async (workerId, start, end, onSuccess, onError) => {
  const key = datastore.key(kind);
  const entity = { key, data: { workerId: workerId, start, end } };

  try {
    await datastore.save(entity);
    onSuccess({ success: true });
  } catch (err) {
    onError(err);
  }
};

const destroyWorkerShift = (id, onSuccess, onError) => {
  const key = datastore.key([kind, datastore.int(id)]);
  datastore.delete(key, (err, d) => {
    if (err) {
      onError(err);
    } else {
      onSuccess({ deleted: true });
    }
  });
};

module.exports = {
  getWorkerShifts,
  createWorkerShift,
  destroyWorkerShift
};
