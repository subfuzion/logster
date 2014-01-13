var severity = require('../lib/severity')
  , Log = require('../lib/log')
  , mongodb = require('mongodb')
  , mongoWriter = require('../lib/mongowriter')
  , uri = 'mongodb://localhost/appfusion'
  , async = require('async')
  ;

mongodb.MongoClient.connect(uri, function(err, client) {
  if (err) throw (err);

  mongoWriter.db = client;

  var log = new Log('debug', mongoWriter);

  async.series([
    function(callback) {
      log.write({ level: severity.INFO }, 'test message', 'extra', function(err) {
        if (err) return callback(err);
        return callback();
      });
    },

    function(callback) {
      log.emergency('emergency message', 'extra', function(err) {
        if (err) return callback(err);
        return callback();
      });
    }
  ], function(err, results) {
    if (err) {
      console.log(err.stack);
      process.exit(1);
    }

    console.log('success');
    process.exit(0);
  });


  var q = async.queue(function())

});

