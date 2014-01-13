var severity = require('../lib/severity')
  , Log = require('../lib/log')
  , streamLogger = require('../lib/streamlogger')
  , fs = require('fs')
  ;

var log = new Log('debug', streamLogger);

// by default, writes to process.out
log.write({ level: severity.INFO }, 'test message');
log.emergency('emergency message');
log.notice('look at the contents of stream.log ...');

// provide a file stream
var stream = fs.createWriteStream(__dirname + '/stream.log');
streamLogger.stream = stream;

log.write({ level: severity.INFO }, 'test message');
log.emergency('emergency message');
log.info('a log entry with lots custom data attributes',
  'interesting',
  'cool',
  'stuff',
  { userid: 'tester' },
  { moredata: true, stuff: 'lots' });

