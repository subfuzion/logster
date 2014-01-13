var severity = require('../lib/severity')
  , Log = require('../lib/log')
  , streamWriter = require('../lib/streamwriter')
  , fs = require('fs')
  ;

var log = new Log('debug', streamWriter);


log.write({ level: severity.INFO }, 'test message', 'extra', function(err, logEntry) {
  if (err) return console.log(err);
});

log.emergency('emergency message', 'extra', function(err, logEntry) {
  if (err) return console.log(err);
});


var stream = fs.createWriteStream(__dirname + '/stream.log');
streamWriter.stream = stream;

log.write({ level: severity.INFO }, 'test message', 'extra', function(err, logEntry) {
  if (err) return console.log(err);
});

log.emergency('emergency message', 'extra', function(err, logEntry) {
  if (err) return console.log(err);
});

