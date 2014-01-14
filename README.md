logster
-----------

[![NPM version](https://badge.fury.io/js/logster.png)](http://badge.fury.io/js/logster)

logster provides a simple, but extensible node logging facility that can write to various destinations. logster supports syslog severity levels, categories, and custom data and tags. It is easy to add new loggers and formatters. 

There are quite a few [log packages](https://npmjs.org/search?q=log) for node. logster strives to provide the same simplicity as the tiniest of these packages with "batteries included," while also providing a design that makes it easy to add new loggers.

logster provides the following loggers:

  * consolelogger
  * streamlogger
  * mongologger
  
logster can easily log to multiple destinations simultaneously,  as this snippet demonstrates:

    var log = new Log(severity.DEBUG, consoleLogger, mongoLogger, ...);
    
  
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
  name: 'consolelogger',
  log: function(logEntry) {
    console.log(format(logEntry));
  }
};
```

As the example indicates, logster comes with a default formatter (`textformatter`) that standardizes the look of log entries for text-based output. Both `consolelogger` and `streamlogger` have a `formatter` property set to this. You can set this `formatter` property to your own object that has a `format` function.
```
   var customTextFormatter = {
     format: function (logEntry) {
       // optionally handle extra args
       // return formatted string
     }
   };
```

### Log entry properties

  * timestamp
  * message
  * level
  * levelCode
  * category
  * data
  * tags


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

Severity Levels

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

### Log a message with placeholders like console.log and util.format

Extra parameters are either used as custom tags and data (see section below) or for message formatting just like with `console.log` and `util.format`, depending on the presence of the following placeholders in the log message:

  * %s string
  * %d number
  * %j json

```
log.info('Hello %s', 'World');
```

Output:

    [Mon Jan 13 2014 06:42:54 GMT-0800 (PST)] INFO Hello World

However, unlike `console.log` and `util.format`, any extra parameters that do not have corresponding placeholders are *not* appended to the formatted string. Instead, they are considered to be custom tags and data, as described in another section below.

    log.info('Hello', 'World');

Output:

    [Mon Jan 13 2014 06:42:54 GMT-0800 (PST)] INFO Hello { tags: [ 'World' ] }

For complex log entries with a large number of parameters, it may be less confusing to format the message separately than trying to keep track of placeholders:

    var message = util.format('Hello %s, %s is the %s of %s', 'Bob', 'today', 'first', 'the rest of your life!');
    log.info(message, 'silly', 'greetings', 'bob');

Output:

    [Mon Jan 13 2014 06:42:54 GMT-0800 (PST)] INFO Hello Bob, today is the first day of the rest of your life!,
      { tags: [ 'silly', 'greetings', 'bob' ] }


### Log a message for a specific category

    log.info({ category: 'api' }, 'hello');


Define constants to make using categories easier:

```
var API = { category: 'api' }
  , DATA = { category: 'data' }
  ;

...

log.info(API, 'received GET request');
log.info(DATA, 'retrieved some data');
```

Output:

    [Mon Jan 13 2014 06:42:54 GMT-0800 (PST)] INFO (api) hello

### Log with custom data and tags

After filling in any placholders in the message (as described previously), any extra parameters are either added to a `data` property or to a `tags` property array, depending on whether they are objects or primitive values.

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
[MIT License](https://raw2.github.com/tonypujals/logster/master/LICENSE)
<br>
Copyright (c) 2014, Tony Pujals (http://tonypujals.io/contact/)
