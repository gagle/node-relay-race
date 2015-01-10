relay-race
==========

#### Serial execution of tasks with a shared namespace ####

[![npm version][npm-version-image]][npm-url]
[![Travis][travis-image]][travis-url]

[![npm install][npm-install-image]][npm-url]

The extremly well-known series execution of tasks, but with a baton, a shared object to pass data among tasks. It's like a relay race, runners (tasks) passing data (baton) between them. Each task reading and writing to the shared object.

It's very useful when you need to call a series of functions and store the data in a common place to be read by other tasks, not only the following one.

```javascript
var runners = [
  function (baton, next) {
    baton.a = 1;
    next();
  },
  function (baton, next) {
    baton.b = 2;
    next();
  },
  function (baton, next) {
    baton.c = 3;
    next();
  }
];

race.start(runners, function (err, baton) {
  // baton { a: 1, b: 2, c: 3 }
});
```

Where could you use it? To boot the server up, this was the main purpose to create this library. When starting the web server up you tipically need to do a bunch of things before configuring the web framework of your choice. These tasks need to be executed in series but the result of them may be used in one or more tasks. This library it's just an `async.series()` but with a built-in shared namespace where you can store things.

Take a look to the examples to see how you could modularize the booting.

___module_.start(runners, callback) : undefined__  
Executes all tasks in series.

`runners` is an array of functions to run in series. Each function has the signature `function(baton, next)`, where `baton` is the shared object and `next()` the function to call to execute the next function. As usual, pass an error to `next()` to abort the execution of the tasks. This is the error returned by the `start()` function.

[npm-version-image]: http://img.shields.io/npm/v/relay-race.svg
[npm-install-image]: https://nodei.co/npm/relay-race.png?mini=true
[npm-url]: https://npmjs.org/package/relay-race
[travis-image]: http://img.shields.io/travis/gagle/node-relay-race.svg
[travis-url]: https://travis-ci.org/gagle/node-relay-race