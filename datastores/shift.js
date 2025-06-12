const { Datastore, PropertyFilter } = require("@google-cloud/datastore");
const { DateTime } = require("luxon");
const datastore = new Datastore();
const kind = "Shift";

const getWorkerShifts = async (workerId) => {
  const query = datastore
    .createQuery(kind)
    .filter(new PropertyFilter("workerId", "=", workerId));

  const [entities] = await datastore.runQuery(query);
  const shifts = entities.map((entity) => {
    const start = DateTime.fromISO(entity.start);
    const end = DateTime.fromISO(entity.end).set({
      month: start.month,
      day: start.day,
      year: start.year,
    });
    return {
      id: entity[datastore.KEY].id,
      duration: end.diff(start, "minutes").minutes / 60,
      ...entity,
    };
  });
  return shifts;
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
  destroyWorkerShift,
};
