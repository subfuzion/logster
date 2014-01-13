logster
-----------

logster provides a configurable node logging facility that can write to various destinations. It provides the following loggers "out of the box":

  * consolelogger
  * streamlogger
  * mongologger

Installation
------------

[![NPM](https://nodei.co/npm/logster.png?downloads=true&stars=true)](https://nodei.co/npm/logster/)

    $ npm install logster

Creating your own logger
------------------------

Loggers are objects that have a `name` property a `log` function, and optionally a `drain` function.


Although logster already comes with a console logger, here is an example of how you could create your own:

`consolelogger.js`
```
var format = require('logster').textFormatter.format;

module.exports = {
  name: 'console',
  write: function(logEntry) {
    console.log(format(logEntry));
  }
};
```

logster provides a default formatter (`textformatter`) that standardizes the look of log entries for text-based output. Both `consolelogger` and `streamlogger` have a `formatter` property set to this. You can set the `formatter` property to your own object that has a `format` function. The function should have a logEntry parameter and return a string.

### Async loggers

The log interface does not require callbacks; however, log writes still need to be properly serialized. loggers that write asynchronously, such as `mongologger` use the `async` package to queue log entries. Async loggers should provide a `drain` callback that can be used to check if the queue has been drained. This is important to ensure the process does not exit with pending writes.

To implement your own async logger, take a look at the source for `mongologger.js`.

## Log Severity levels

logster uses the same values as syslog. When creating a new log, set the severity level using values defined in `severity.js`.

Note: the first parameter to the Log constructor can be the number value or the level name (case-insensitive).

The following are all equivalent:

```
var severity = require('logster').severity;

log = new Log(severity.DEBUG, consoleLogger);

log = new Log('DEBUG', consoleLogger);

log = new Log('debug', consoleLogger);

log = new Log(7, consoleLogger);

console.log(severity.str(7)); // => 'DEBUG'
```

level     | value | purpose
--------- | ----- | -------
NONE      | -1    | don't log
EMERGENCY | 0     | system is unusable
ALERT     | 1     | action must be taken immediately
CRITICAL  | 2     | critical conditions
ERROR     | 3     | error conditions
WARNING   | 4     | warning conditions
NOTICE    | 5     | normal but significant condition
INFO      | 6     | informational messages
DEBUG     | 7     | debug-level messages




Examples
--------

### Creating a console log

```
var Log = require('logster').Log
  , severity = require('logster').severity
  , consoleLogger = require('logster').consoleLogger
  , log
  ;

log = new Log(severity.DEBUG, consoleLogger);
```

### Creating a stream log

```
var Log = require('logster').Log
  , severity = require('logster').severity
  , streamLogger = require('logster').streamLogger
  , log
  ;

streamLogger.stream = fs.createWriteStream(__dirname + '/stream.log');

log = new Log(severity.DEBUG, streamLogger);
```

### Creating a mongo log

```
var Log = require('logster').Log
  , severity = require('logster').severity
  , mongoLogger = require('logster').mongoLogger
  , mongodb = require('mongodb')
  , mongoUri = '...'
  ;

mongodb.MongoClient.connect(mongoUri, function(err, client) {

  mongoLogger.db = client;

  var log = new Log('debug', mongoLogger);
  
  log.info('hello');

  // check that async loggers have finished draining
  // the log queue before exiting the process...
  
  log.drain(function() {
    console.log('finished writing all log entries to mongo');
    process.exit(0);
  });

});
```

### Create a log with multiple loggers

    var log = new Log(severity.DEBUG, consoleLogger, mongoLogger, ...);

Note: this version doesn't support different logger severity levels.

### Log a simple message

    log.info('hello');

Output:

    [Mon Jan 13 2014 06:42:54 GMT-0800 (PST)] INFO hello

### Log a message for a specific category

    log.info({ category: 'api' }, 'hello');
    
    // define category constants to make using categories easier:
    var API = { category: 'api' }
      , DATA = { category: 'data' }
      ;
      
    ...
    
    log.info(API, 'received GET request');
    log.info(DATA, 'retrieved some data');

Output:

    [Mon Jan 13 2014 06:42:54 GMT-0800 (PST)] INFO (api) hello

### Log with custom data and tags

Parameters passed after message are either added to a `data` property or to a `tags` property array, depending on whether they are objects or primitive values.

```
log.info('a log entry with lots of custom data attributes',
  'interesting',
  'cool',
  'stuff',
  { userid: 'tester' },
  { moredata: true, stuff: 'lots' });
```

Output:

```
[Mon Jan 13 2014 13:20:20 GMT-0800 (PST)] INFO a log entry with lots of custom data attributes {
  data:  { userid: 'tester', moredata: true, stuff: 'lots' },
  tags:  [ 'interesting', 'cool', 'stuff' ] }
```

Mongo document (using mongologger)

```
{
	"timestamp" : ISODate("2014-01-13T21:23:49.744Z"),
	"category" : "",
	"level" : "INFO",
	"levelCode" : 6,
	"message" : "a log entry with lots of custom data attributes",
	"data" : {
		"userid" : "tester",
		"moredata" : true,
		"stuff" : "lots"
	},
	"tags" : [
		"interesting",
		"cool",
		"stuff"
	],
	"_id" : ObjectId("52d45965b565194aa9b39676")
}
```



License
-------
MIT License

Copyright (c) 2014, Tony Pujals (http://tonypujals.io/contact/)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.