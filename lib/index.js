'use strict';

var noop = function () {};

exports.start = function (runners, baton, cb) {
  var argsLen = arguments.length;

  if (argsLen === 1) {
    baton = {};
  } else if (argsLen === 2 && typeof baton === 'function') {
    cb = baton;
    baton = {};
  }

  if (!cb) {
    cb = noop;
  }

  var len = runners.length;
  if (!len) return cb(null, baton);

  (function iterate(i) {
    if (i === len) return cb(null, baton);
    runners[i](baton, function (err) {
      if (err) return cb(err);
      iterate(i + 1);
    });
  })(0);
};