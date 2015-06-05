'use strict';
//require('babelify/polyfill');

// TODO add mocha tests in node
//var expect = require('chai').expect;
var deepFreeze = require('deep-freeze-strict');
var D = require('../../src/dump');
var merge = require('../../src/utils').merge;
var deepEqual = require('deep-equal');

describe('ES6 Collections', function () {
    describe('ES6 Map', function () {
        var map = new Map([['a', 1], ['b', 2], ['c', 3]]);
        var map1 = new Map([['f', 4], ['e', 5]]);
        var map2 = new Map([['k', 1]]);
        map.set('d', map1);
        map1.set('g', map2);
        var obj = deepFreeze({m: map});

        it('Serialization', function () {
            var dumpedObj = JSON.stringify({
                '@0': {'m': '@1'},
                '@1': {'entries': '@2', '__dump__': 'ES6Map'},
                '@2': ['@3', '@4', '@5', '@6'],
                '@3': ['a', 1],
                '@4': ['b', 2],
                '@5': ['c', 3],
                '@6': ['d', '@7'],
                '@7': {'entries': '@8', '__dump__': 'ES6Map'},
                '@8': ['@9', '@10', '@11'],
                '@9': ['f', 4],
                '@10': ['e', 5],
                '@11': ['g', '@12'],
                '@12': {'entries': '@13', '__dump__': 'ES6Map'},
                '@13': ['@14'],
                '@14': ['k', 1]
            });
            expect(D.dump(obj)).to.be.eql(dumpedObj);
        });

        it('Restore', function () {
            var restored = D.restore(D.dump(obj));
            expect(deepEqual(restored, obj)).to.be.ok;
        });
    });

    describe('Nested ES6 Map', function () {

    });
});

function getMapEntries (map) {
    var entry, iter;
    var data = [];

    iter = map.entries();

    while ((entry = iter.next()), !entry.done)
        data.push(entry.value);

    return data;
}
