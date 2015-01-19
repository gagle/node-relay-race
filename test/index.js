'use strict';

var sinon = require('sinon');
var code = require('code');
var lab = module.exports.lab = require('lab').script();

var expect = code.expect;
var describe = lab.describe;
var it = lab.it;

var race = require('../lib');

describe('relay-race', function () {
  it('calls tasks in serial', function (done) {
    var runners = [
      function (baton, next) {
        expect(baton).to.deep.equal({});
        baton.a = 1;
        next();
      },
      function (baton, next) {
        expect(baton).to.only.deep.include({
          a: 1
        });
        baton.b = 2;
        next();
      },
      function (baton, next) {
        expect(baton).to.only.deep.include({
          a: 1,
          b: 2
        });
        baton.a = 3;
        next();
      }
    ];

    race.start(runners, function (err, baton) {
      expect(err).to.not.exist();
      expect(baton).to.only.deep.include({
        a: 3,
        b: 2
      });
      done();
    });
  });

  it('finishes with no tasks', function (done) {
    race.start([], function (err, baton) {
      expect(err).to.not.exist();
      expect(baton).to.deep.equal({});
      done();
    });
  });

  it('can receive a baton from the outside', function (done) {
    var runners = [
      function (baton, next) {
        expect(baton).to.only.deep.include({
          c: 3
        });
        baton.a = 1;
        next();
      },
      function (baton, next) {
        baton.b = 2;
        next();
      }
    ];

    race.start(runners, { c: 3 }, function (err, baton) {
      expect(err).to.not.exist();
      expect(baton).to.only.deep.include({
        a: 1,
        b: 2,
        c: 3
      });
      done();
    });
  });

  it('aborts with error', function (done) {
    var errInstance = new Error();
    var spy = sinon.spy(function (baton, next) {
      next();
    });

    var runners = [
      function (baton, next) {
        next(errInstance);
      },
      spy
    ];

    race.start(runners, function (err, baton) {
      expect(err).to.equal(errInstance);
      expect(baton).to.be.undefined();
      expect(spy.callCount).to.equal(0);
      done();
    });
  });
});