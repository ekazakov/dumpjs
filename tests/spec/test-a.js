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

    it('Serialize empty array');

    it('Serialize array');
});
