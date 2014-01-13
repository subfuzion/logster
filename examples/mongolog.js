var severity = require('../lib/severity')
  , Log = require('../lib/log')
  , mongodb = require('mongodb')
  , mongoWriter = require('../lib/mongowriter')
  , uri = 'mongodb://localhost/appfusion'
  ;

mongodb.MongoClient.connect(uri, function(err, client) {
  if (err) throw (err);

  mongoWriter.db = client;

  var log = new Log('debug', mongoWriter);

  log.write({ level: severity.INFO }, 'test message', 'extra');
  log.emergency('emergency message', 'extra');

  log.drain(function() {
    console.log('finished writing all log entries to mongo');
    process.exit(0);
  });

});

