const { Datastore } = require("@google-cloud/datastore");
const datastore = new Datastore();
const kind = "Worker";

// CREATE
const createWorker = (name, onSuccess, onError) => {
  const key = datastore.key(kind);
  const entity = { key, data: { name } };

  datastore.save(entity, (err) => {
    if (err) {
      onError(err);
    } else {
      onSuccess({ id: key.id, name });
    }
  });
};

// READ ALL
const getAllWorkers = (onSuccess, onError) => {
  const query = datastore.createQuery(kind);
  datastore.runQuery(query, (err, entities) => {
    if (err) {
      onError(err);
    } else {
      const workers = entities.map((entity) => ({
        id: entity[datastore.KEY].id,
        ...entity,
      }));
      onSuccess(workers);
    }
  });
};

// READ ONE
const getWorkerById = (id, onSuccess, onError) => {
  const key = datastore.key([kind, datastore.int(id)]);
  datastore.get(key, (err, entity) => {
    if (err) {
      onError(err);
    } else if (!entity) {
      onError({ notFound: true });
    } else {
      onSuccess(entity);
    }
  });
};

// UPDATE
const editWorker = (id, name, onSuccess, onError) => {
  const key = datastore.key([kind, datastore.int(id)]);
  const entity = { key, data: { name } };

  datastore.save(entity, (err) => {
    if (err) {
      onError(err);
    } else {
      onSuccess({ id, name });
    }
  });
};

// DELETE
const destroyWorker = (id, onSuccess, onError) => {
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
  createWorker,
  getAllWorkers,
  getWorkerById,
  editWorker,
  destroyWorker,
};
