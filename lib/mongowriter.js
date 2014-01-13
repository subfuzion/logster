var mongoWriter = module.exports = {
  name: 'mongowriter',
  db: null,
  logCollection: 'log',
  write: function(logEntry, callback) {
    if (!mongoWriter.db) return callback(new Error('must set db'));

    mongoWriter.db.collection(mongoWriter.logCollection, function (err, collection) {
      if (err) return callback(err);

      collection.save(logEntry, function (err, result) {
        if (err) return callback(err);
        callback(null, result);
      });
    });
  }
};