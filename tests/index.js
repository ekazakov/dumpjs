(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = {};

},{}],2:[function(require,module,exports){
'use strict';

var dump = require('./app/dump');

describe('Spec', function () {
    require('./tests/spec/test-a');
});

},{"./app/dump":1,"./tests/spec/test-a":3}],3:[function(require,module,exports){
'use strict';

var dump = require('../../app/dump');

describe('Test A', function () {
    it('Simple test', function () {
        expect(dump).to.be.not.null;
    });

    it('Serialize empty obj literal');

    it('Serialize obj literal');

    it('Serialize empty array');

    it('Serialize array');
});

},{"../../app/dump":1}]},{},[2]);
