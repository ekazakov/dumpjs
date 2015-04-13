'use strict';

var D = require('../../app/dump');

function squeeze (str) {
    return str.replace(/\s/ig, '');
}

describe('Test A', function () {
    it('Simple test', function () {
        expect(D).to.be.not.null;
    });

    it('Serialize empty obj literal', function () {
        var dumpedObj = squeeze('{"@0": {}}');
        expect(D.dump({})).to.be.eql(dumpedObj);
    });

    it('Serialize simple obj literal', function () {
        var obj = {x: 1, y: 2};

        var dumpedObj = JSON.stringify({'@0': {x: 1, y: 2}});
        expect(D.dump(obj)).to.be.eql(dumpedObj);
    });

    it('Serialize composite obj literal 1', function () {
        var obj2 = {z: 1};
        var obj = {x: 1, y: 2, f: obj2};

        var dumpedObj = JSON.stringify({
            '@0': {x: 1, y: 2, f: '@1'},
            '@1': {z: 1}
        });
        expect(D.dump(obj)).to.be.eql(dumpedObj);
    });

    it('Serialize composite obj literal 2', function () {
        var obj2 = {z: 1};
        var obj3 = {y: 1};
        var obj = {x: 1, f: obj2, c: obj3};

        var dumpedObj = JSON.stringify({
            '@0': {'x': 1, 'f': '@1', 'c': '@2'},
            '@1': {'z': 1},
            '@2': {'y': 1}
        });

        expect(D.dump(obj)).to.be.eql(dumpedObj);
    });

    it('Serialize composite obj literal 3', function () {
        var obj3 = {y: 1};
        var obj2 = {z: 1, c: obj3};
        var obj = {x: 1, f: obj2};

        var dumpedObj = JSON.stringify({
            '@0': {'x': 1, 'f': '@1'},
            '@1': {'z': 1, c: '@2'},
            '@2': {'y': 1}
        });

        expect(D.dump(obj)).to.be.eql(dumpedObj);
    });

    it('Serialize composite multileve obj literal', function () {
        var obj5 = {d: 1, k: 2};
        var obj4 = {a: 1, l: obj5};
        var obj3 = {y: 1, m: obj4};
        var obj2 = {z: 1, c: obj3};
        var obj = {x: 1, f: obj2};

        var dumpedObj = JSON.stringify({
            '@0': {'x': 1, f: '@1'},
            '@1': {'z': 1, c: '@2'},
            '@2': {'y': 1, m: '@3'},
            '@3': {'a': 1, l: '@4'},
            '@4': {d: 1, k: 2}
        });

        expect(D.dump(obj)).to.be.eql(dumpedObj);
    });

    it('Serialize composite obj with recursion', function () {
        var obj2 = {z: 1, c: null};
        var obj = {x: 1, f: obj2};
        obj2.c = obj;
        obj.a = obj;

        var dumpedObj = JSON.stringify({
            '@0': {'x': 1, 'f': '@1', a: '@0'},
            '@1': {'z': 1, c: '@0'}
        });

        expect(D.dump(obj)).to.be.eql(dumpedObj);
    });

    it('Serialize empty array');


    it('Serialize array');

    it('Map test', function () {
        var m = new Map();
        var id = 2;
        m.set('id0', 0);
        m.set('id1', 1);
        m.set('id2', 2);

        var iterator = m.entries();
        var entry;

        while ((entry = iterator.next(), !entry.done)) {
            // console.log(entry);
            if (id < 7) {
                id++;
                m.set('id' + id, id);
            }
        }
    });
});
