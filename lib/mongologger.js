var async = require('async')
  , mongoWriter
  , drained = true
  , drainCallbacks = [];
  ;

var q = async.queue(function(logEntry, callback) {
  drained = false;
  mongoWriter.db.collection(mongoWriter.logCollection, function (err, collection) {
    if (err) return callback(err);

    collection.save(logEntry, function (err) {
      if (err) return callback(err);
      callback(null);
    });
  });
}, 1);

q.drain = function() {
  drained = true;
  for (var i = 0; i < drainCallbacks.length; i++) {
    // remove the listener, and call it
    drainCallbacks.splice(i, 1)[0]();
  }
}

mongoWriter = module.exports = {
  name: 'mongowriter',
  db: null,
  logCollection: 'log',
  callback: null,
  drain: function(callback) {
    if (callback) {
      if (drained) {
        callback();
      } else {
        drainCallbacks.push(callback);
      }
    }
  },
  write: function(logEntry, callback) {
    if (!mongoWriter.db && callback) return callback(new Error('must set db'));

    drained = false;
    q.push(logEntry, callback);
  }
};