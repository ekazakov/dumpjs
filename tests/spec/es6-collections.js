'use strict';
//require('babelify/polyfill');

// TODO add mocha tests in node
//var expect = require('chai').expect;
var deepFreeze = require('deep-freeze-strict');
var D = require('../../src/dump');
var merge = require('../../src/utils').merge;
var deepEqual = require('@ekazakov/deep-equal');

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

    describe('ES6 Map with Map as key', function () {
        var map2 = new Map([['k', 1]]);
        var map1 = new Map([['f', 4], [map2, 5]]);
        var map = new Map([['a', 1], [map1, 2], [{x: {z: 1}}, 3]]);
        var obj = deepFreeze({m: map});

        it('Serialization', function () {
            var dumpedObj = JSON.stringify({
                '@0': {'m': '@1'},
                '@1': {'entries': '@2', '__dump__': 'ES6Map'},
                '@2': ['@3', '@4', '@5'],
                '@3': ['a', 1],
                '@4': ['@6', 2],
                '@5': ['@7', 3],
                '@6': {'entries': '@8', '__dump__': 'ES6Map'},
                '@7': {'x': '@9'},
                '@8': ['@10', '@11'],
                '@9': {'z': 1},
                '@10': ['f', 4],
                '@11': ['@12', 5],
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
    })

    describe('ES6 Set', function () {
        var set3 = new Set([6, 7]);
        var set2 = new Set([4, 5, set3]);
        var set = new Set([1, 2, 3, set2]);
        var obj = deepFreeze({s: set});

        it('Serializer', function () {
            var dumpedObj = JSON.stringify({
                '@0': {'s': '@1'},
                '@1': {'values': '@2', '__dump__': 'ES6Set'},
                '@2': [1, 2, 3, '@3'],
                '@3': {'values': '@4', '__dump__': 'ES6Set'},
                '@4': [4, 5, '@5'],
                '@5': {'values': '@6', '__dump__': 'ES6Set'},
                '@6': [6, 7]
            });
            expect(D.dump(obj)).to.be.eql(dumpedObj);
        });

        it('Restore', function () {
            var restored = D.restore(D.dump(obj));
            expect(deepEqual(restored, obj)).to.be.ok;
        });
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
