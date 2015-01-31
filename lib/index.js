'use strict';

exports.start = function (runners, baton, cb) {
  if (arguments.length === 2) {
    cb = baton;
    baton = {};
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