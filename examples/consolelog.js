var severity = require('../lib/severity')
  , Log = require('../lib/log')
  , consoleLogger = require('../lib/consolelogger')
  ;

var emergencyLogger = {
  name: 'console',
  log: function(logEntry) {
    if (logEntry.levelCode === severity.EMERGENCY) {
      console.log('HOLY SHITTAKE');
    }
  }
};

var log = new Log('debug', consoleLogger, emergencyLogger);


//log.write('throws');

log.write({ level: severity.INFO }, 'test message', 'extra');

log.emergency('emergency message', 'extra');

log.info('hello');


var web = { category: 'web' };
log.info(web, 'received request', { userid: 'tester' });

log.info('a log entry with lots custom data attributes',
  'interesting',
  'cool',
  'stuff',
  { userid: 'tester' },
  { moredata: true, stuff: 'lots' });


log.info('hello %s! You are #%d!', 'World', 1);

log.info('hello %s! You are #%d! %j', 'World', 1, { rank: 1 }, 'cool', { important: true });
