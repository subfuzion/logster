var severity = require('../lib/severity')
  , Log = require('../lib/log')
  , mongodb = require('mongodb')
  , mongoLogger = require('../lib/mongologger')
  , uri = 'mongodb://localhost/appfusion'
  ;

mongodb.MongoClient.connect(uri, function(err, client) {
  if (err) throw (err);

  mongoLogger.db = client;

  var log = new Log('debug', mongoLogger);

  log.write({ level: severity.INFO }, 'test message', 'extra');
  log.emergency('emergency message', 'extra');

  log.info('a log entry with lots of custom data attributes',
    'interesting',
    'cool',
    'stuff',
    { userid: 'tester' },
    { moredata: true, stuff: 'lots' });

  log.drain(function() {
    console.log('finished writing all log entries to mongo');
    process.exit(0);
  });

});

