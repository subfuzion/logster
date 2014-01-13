node-logger
-----------

node-logger provides a configurable logging facility that can write to various destinations. It provides the following log writers "out of the box":

  * consolewriter
  * streamwriter
  * mongowriter

Installation
------------

    $ npm install node-logger

Creating your own writer
------------------------

Writers are objects that have a `name` property a `write` function, and optionally a `drain` function.


Although node-logger already comes with a console logger, here is an example of how you could create your own:

`consolewriter.js`
```
module.exports = {
  name: 'console',
  write: function(logEntry) {
    console.log(format(logEntry));
  }
};
``` 
node-logger provides a default formatter (`textformatter`) that standardizes the look of log entries for text-based output. Both `consolewriter` and `streamwriter` have a `formatter` property set to this. You can set the `formatter` property to your own object that has a `format` function. The function should have a logEntry parameter and return a string.

### Async writers

The log interface does not require callbacks; however, log writes still need to be properly serialized. Writers that write asynchronously, such as `mongowriter` use the `async` package to queue log entries. Async writers should provide a `drain` callback that can be used to check if the queue has been drained. This is important to ensure the process does not exit with pending writes.

To implement your own async writer, take a look at the source for `mongowriter.js`.

## Log Severity levels

node-logger uses the same values as syslog. When creating a new log, set the severity level using values defined in `severity.js`.

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

### Create a log

```
var Log = require('node-logger').Log
  , severity = require('node-logger').severity
  , consoleLogger = require('node-logger').consoleLogger
  , streamLogger = require('node-logger').streamLogger
  , mongoLogger = require('node-logger').mongoLogger
  ;

var log = new Log(severity.DEBUG, consoleLogger);
```

Note: the first paramater to the Log constructor can be a value from `severity`, or it can be entered as the equivalent number value or as a string (case-insensitive).

### Log a simple message

    log.info('hello');

Output:

    [Mon Jan 13 2014 06:42:54 GMT-0800 (PST)] INFO hello

### Log a message for a specific category

    log.info('api', 'hello');

Output:

    [Mon Jan 13 2014 06:42:54 GMT-0800 (PST)] INFO (api) hello

### Log with custom data

    log.info('a log entry with lots custom data attributes',
      'interesting stuff',
      'more data',
      { userid: 'tester' },
      { moredata: true, stuff: 'lots' });

Output:

```
[Mon Jan 13 2014 11:49:57 GMT-0800 (PST)] INFO a log entry with lots custom data attributes { data:  [
  'interesting stuff',
  'more data',
  { userid: 'tester' },
  { moredata: true, stuff: 'lots' } ] }
```

Mongo document (using mongowriter)

```
{
	"timestamp" : ISODate("2014-01-13T19:53:26.459Z"),
	"category" : "",
	"level" : "INFO",
	"levelCode" : 6,
	"message" : "a log entry with lots custom data attributes",
	"data" : [
		"interesting stuff",
		"more data",
		{
			"userid" : "tester"
		},
		{
			"moredata" : true,
			"stuff" : "lots"
		}
	],
	"_id" : ObjectId("52d44436429b9619a8a9dc27")
}
```



License
-------
MIT License

Copyright (c) 2014, Tony Pujals (http://tonypujals.io/contact/)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.