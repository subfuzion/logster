var severity = require('../lib/severity')
  , Log = require('../lib/log')
  , consoleWriter = require('../lib/consolewriter')
  ;

var emergencyWriter = {
  name: 'console',
  write: function(logEntry) {
    if (logEntry.levelCode === severity.EMERGENCY) {
      console.log('HOLY SHITTAKE');
    }
  }
};

var log = new Log('debug', consoleWriter)
  .addWriter(emergencyWriter);


//log.write('throws');

log.write({ level: severity.INFO }, 'test message', 'extra');

log.emergency('emergency message', 'extra');

log.info('hello');


var web = { category: 'web' };
log.info(web, 'received request', { userid: 'tester' });
