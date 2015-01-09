'use strict';

module.exports.start = function (runners, cb) {
  var baton = {};
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