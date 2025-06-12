const { Datastore } = require('@google-cloud/datastore');

const datastore = new Datastore();
const settingKey = datastore.key(['Setting', 'Global']);

function saveGlobalTimezone(timezone, onSuccess, onError) {
  datastore.save({
    key: settingKey,
    data: {
      name: 'timezone',
      value: timezone,
    },
  }, (err, entity) => {
    if (err)
      onError(err)
    else
      onSuccess(entity)
  });
}

function getGlobalTimezone(onSuccess, onError) {
  datastore.get(settingKey, (err, entity) => {
    if (err)
      onError(err)
    else {
      onSuccess(entity.value)
    }
  });
}

module.exports = {
  saveGlobalTimezone,
  getGlobalTimezone
};