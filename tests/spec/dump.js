'use strict';

var D = require('../../app/dump');

function squeeze (str) {
    return str.replace(/\s/ig, '');
}
describe('Test A', function () {
    it('Simple test', function () {
        expect(D).to.be.not.null;
    });

    describe('Empty ojbect', function () {
        it('Serialize', function () {
            var dumpedObj = squeeze('{"@0": {}}');
            expect(D.dump({})).to.be.eql(dumpedObj);
        });

        it('Restore mpty object', function () {
            var obj = {};
            var json = D.dump(obj);
            expect(D.restore(json)).to.be.instanceOf(Object);
        });
    });

    describe('Simple ojbect', function () {
        var obj = {x: 1, y: 'a', z: null, g: false};
        it('Serialize', function () {
            var dumpedObj = JSON.stringify({'@0': {x: 1, y: 'a', z: null, g: false}});
            expect(D.dump(obj)).to.be.eql(dumpedObj);
        });

        it('Restore', function () {
            expect(D.restore(D.dump(obj))).to.be.eql(obj);
        });
    });

    describe('Composite object (level 2)', function () {
        var obj = {x: 1, f: {z: 1}, c: {y: 1}};

        it('Serialize', function () {
            var dumpedObj = JSON.stringify({
                '@0': {'x': 1, 'f': '@1', 'c': '@2'},
                '@1': {'z': 1},
                '@2': {'y': 1}
            });

            expect(D.dump(obj)).to.be.eql(dumpedObj);
        });

        it('Restore', function () {
            expect(D.restore(D.dump(obj))).to.be.eql(obj);
        });
    });

    describe('Composite object (level 3)', function () {
        var obj = {x: 1, f: {z: 1, c: {y: 1}}};

        it('Serialize', function () {
            var dumpedObj = JSON.stringify({
                '@0': {'x': 1, 'f': '@1'},
                '@1': {'z': 1, c: '@2'},
                '@2': {'y': 1}
            });

            expect(D.dump(obj)).to.be.eql(dumpedObj);
        })

        it('Restore', function () {
            expect(D.restore(D.dump(obj))).to.be.eql(obj);
        });
    });

    describe('Composite object (level 5)', function () {
        var obj5 = {d: 1, k: 2};
        var obj4 = {a: 1, l: obj5};
        var obj3 = {y: 1, m: obj4};
        var obj2 = {z: 1, c: obj3};
        var obj = {x: 1, f: obj2};

        it('Serialize', function () {
            var dumpedObj = JSON.stringify({
                '@0': {'x': 1, f: '@1'},
                '@1': {'z': 1, c: '@2'},
                '@2': {'y': 1, m: '@3'},
                '@3': {'a': 1, l: '@4'},
                '@4': {d: 1, k: 2}
            });

            expect(D.dump(obj)).to.be.eql(dumpedObj);
        });

        it('Restore', function () {
            expect(D.restore(D.dump(obj))).to.be.eql(obj);
        });
    });

    describe('Simple composite object', function () {
        var obj = {x: 1, y: 2, f: {z: 1}};

        it('Serialize', function () {
            var dumpedObj = JSON.stringify({
                '@0': {x: 1, y: 2, f: '@1'},
                '@1': {z: 1}
            });
            expect(D.dump(obj)).to.be.eql(dumpedObj);
        });

        it('Restore', function () {
            expect(D.restore(D.dump(obj))).to.be.eql(obj);
        });
    });

    describe('Recursive object', function () {
        var obj2 = {z: 1, c: null};
        var obj = {x: 1, f: obj2};
        obj2.c = obj;
        obj.a = obj;

        it('Serialize', function () {
            var dumpedObj = JSON.stringify({
                '@0': {'x': 1, 'f': '@1', a: '@0'},
                '@1': {'z': 1, c: '@0'}
            });

            expect(D.dump(obj)).to.be.eql(dumpedObj);
        });

        it('Restore', function () {
            expect(D.restore(D.dump(obj))).to.be.eql(obj);
        });
    });

    describe('Empty array', function () {
        var arr = [];

        it('Serialize', function () {
            var dumpedObj = JSON.stringify({
                '@0': []
            });

            expect(D.dump(arr)).to.be.eql(dumpedObj);
        });

        it('Restore', function () {
            expect(D.restore(D.dump(arr))).to.be.eql(arr);
        });
    });

    describe('Simple array', function () {
        var arr = [1, 2, 3, 'abc', true, null];

        it('Serialize primitive array', function () {
            var dumpedObj = JSON.stringify({'@0': [1, 2, 3, 'abc', true, null]});

            expect(D.dump(arr)).to.be.eql(dumpedObj);
        });

        it('Restore', function () {
            expect(D.restore(D.dump(arr))).to.be.eql(arr);
        });
    });

    describe('Composite array', function () {
        var arr = [1, 2, {x: 1}, 3];

        it('Serialize', function () {
            var dumpedObj = JSON.stringify({
                '@0': [1, 2, '@1', 3],
                '@1': {x: 1}
            });

            expect(D.dump(arr)).to.be.eql(dumpedObj);
        });

        it('Restore', function () {
            expect(D.restore(D.dump(arr))).to.be.eql(arr);
        });
    });

    describe('Composite array with recursive object', function () {
        var obj = {x: 1, y: {z: 'a', f: {d: 1}}};
        var arr = [1, 2, obj, 3];
        obj.o = obj;
        obj.y.f.a = obj;

        it('Serialize', function () {
            var dumpedObj = JSON.stringify({
                '@0': [1, 2, '@1', 3],
                '@1': {x: 1, y: '@2', o: '@1'},
                '@2': {z: 'a', f: '@3'},
                '@3': {d: 1, a: '@1'}
            });

            expect(D.dump(arr)).to.be.eql(dumpedObj);
        });

        it('Restore', function () {
            expect(D.restore(D.dump(arr))).to.be.eql(arr);
        });
    });


    describe('Composite array (level 2)', function () {
        var arr = [1, 2, [3, 4], 5, [6]];

        it('Serialize', function () {
            var dumpedObj = JSON.stringify({
                '@0': [1, 2, '@1', 5, '@2'],
                '@1': [3, 4],
                '@2': [6]
            });

            expect(D.dump(arr)).to.be.eql(dumpedObj);
        });

        it('Restore', function () {
            expect(D.restore(D.dump(arr))).to.be.eql(arr);
        });
    });

    it('Serialize composite array 4', function () {
        var arr = [1, 2, [3, 4, [6, 7, {x: 2}]], 8, [9]];

        var dumpedObj = JSON.stringify({
            '@0': [1, 2, '@1', 8, '@2'],
            '@1': [3, 4, '@3'],
            '@2': [9],
            '@3': [6, 7, '@4'],
            '@4': {x: 2}
        });

        expect(D.dump(arr)).to.be.eql(dumpedObj);
    });

    it('Serialize recursive array', function () {
        var arr = [1, 2, [3, 4], 8];
        arr[2].push(arr);
        arr.push(arr);

        var dumpedObj = JSON.stringify({
            '@0': [1, 2, '@1', 8, '@0'],
            '@1': [3, 4, '@0']
        });

        expect(D.dump(arr)).to.be.eql(dumpedObj);
    });
});

