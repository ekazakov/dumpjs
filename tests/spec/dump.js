'use strict';
var deepFreeze = require('deep-freeze-strict');
var D = require('../../app/dump');

function squeeze (str) {
    return str.replace(/\s/ig, '');
}
describe('Object litearals and arrays', function () {
    function noop () {}

    describe('Empty ojbect', function () {
        it('Serialize', function () {
            var dumpedObj = squeeze('{"@0": {}}');
            expect(D.dump({})).to.be.eql(dumpedObj);
        });

        it('Restore mpty object', function () {
            var obj = deepFreeze({});
            var json = D.dump(obj);
            expect(D.restore(json)).to.be.instanceOf(Object);
        });
    });

    describe('Simple ojbect', function () {
        var obj = deepFreeze({x: 1, y: 'a', z: null, g: false});

        it('Serialize', function () {
            var dumpedObj = JSON.stringify({'@0': {x: 1, y: 'a', z: null, g: false}});
            expect(D.dump(obj)).to.be.eql(dumpedObj);
        });

        it('Restore', function () {
            expect(D.restore(D.dump(obj))).to.be.eql(obj);
        });
    });

    describe('Composite object (level 2)', function () {
        var obj = deepFreeze({x: 1, f: {z: 1}, c: {y: 1}});

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
        var obj = deepFreeze({x: 1, f: {z: 1, c: {y: 1}}});

        it('Serialize', function () {
            var dumpedObj = JSON.stringify({
                '@0': {'x': 1, 'f': '@1'},
                '@1': {'z': 1, c: '@2'},
                '@2': {'y': 1}
            });

            expect(D.dump(obj)).to.be.eql(dumpedObj);
        });

        it('Restore', function () {
            expect(D.restore(D.dump(obj))).to.be.eql(obj);
        });
    });

    describe('Composite object (level 5)', function () {
        var obj5 = {d: 1, k: 2};
        var obj4 = {a: 1, l: obj5};
        var obj3 = {y: 1, m: obj4};
        var obj2 = {z: 1, c: obj3};
        var obj = deepFreeze({x: 1, f: obj2});

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
        var obj = deepFreeze({x: 1, y: 2, f: {z: 1}});

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

        deepFreeze(obj);

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
        var arr = deepFreeze([]);

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
        var arr = deepFreeze([1, 2, 3, 'abc', true, null]);

        it('Serialize primitive array', function () {
            var dumpedObj = JSON.stringify({'@0': [1, 2, 3, 'abc', true, null]});

            expect(D.dump(arr)).to.be.eql(dumpedObj);
        });

        it('Restore', function () {
            expect(D.restore(D.dump(arr))).to.be.eql(arr);
        });
    });

    describe('Composite array', function () {
        var arr = deepFreeze([1, 2, {x: 1}, 3]);

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

        deepFreeze(arr);

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
        var arr = deepFreeze([1, 2, [3, 4], 5, [6]]);

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

    describe('Composite array (level 4)', function () {
        var arr = deepFreeze([1, 2, [3, 4, [6, 7, {x: 2}]], 8, [9]]);

        it('Serialize', function () {
            var dumpedObj = JSON.stringify({
                '@0': [1, 2, '@1', 8, '@2'],
                '@1': [3, 4, '@3'],
                '@2': [9],
                '@3': [6, 7, '@4'],
                '@4': {x: 2}
            });

            expect(D.dump(arr)).to.be.eql(dumpedObj);
        });

        it('Restore', function () {
            expect(D.restore(D.dump(arr))).to.be.eql(arr);
        });
    });

    describe('Recursive array', function () {
        var arr = [1, 2, [3, 4], 8];
        arr[2].push(arr);
        arr.push(arr);
        deepFreeze(arr);

        it('Serialize', function () {
            var dumpedObj = JSON.stringify({
                '@0': [1, 2, '@1', 8, '@0'],
                '@1': [3, 4, '@0']
            });

            expect(D.dump(arr)).to.be.eql(dumpedObj);
        });

        it('Restore', function () {
            expect(D.restore(D.dump(arr))).to.be.eql(arr);
        });
    });

    describe('Object with functions', function () {
        var obj = deepFreeze({x: 1, y: noop, b: noop, c: 3});

        it('Serialize', function () {
            var dumpedObj = JSON.stringify({
                '@0': {x: 1, c: 3}
            });

            expect(D.dump(obj)).to.be.eql(dumpedObj);
        });
    });

    describe('Object with date', function () {
        var obj = deepFreeze({x: 1, y: new Date(), c: 3});

        it('Serialize date to empty object by default', function () {
            var dumpedObj = JSON.stringify({
                '@0': {x: 1, y: '@1', c: 3},
                '@1': {}
            });

            expect(D.dump(obj)).to.be.eql(dumpedObj);
        });
    });

    describe('Custom serialization', function () {
        var obj = deepFreeze({x: 1, y: new Date('2015-04-26T20:39:35.208Z'), c: 3});

        function dateSerializer (key, value) {
            if (value instanceof Date) return {value: value.toJSON(), '__meta__': 'date'};

            return value;
        }

        it('Serialize date to string', function () {
            var dumpedObj = JSON.stringify({
                '@0': {x: 1, y: '@1', c: 3},
                '@1': {value: '2015-04-26T20:39:35.208Z', '__meta__': 'date'}
            });

            expect(D.dump(obj, {serializer: dateSerializer})).to.be.eql(dumpedObj);
        });

        function dateDeserializer (key, value) {
            if (value != null && value['__meta__'] === 'date')
                return new Date(value.value);
            return value;
        }

        it('Restore with custom deserializer', function () {
            var json = D.dump(obj, {serializer: dateSerializer});
            var restoredObj = D.restore(json, {deserializer: dateDeserializer})
            console.log('1', restoredObj);
            console.log('2', obj);
            expect(restoredObj).to.be.eql(obj);
        });

        it('Ignore property if serializer return undefined', function () {
            function serializer (key, value) {
                if (key === 'y') return;

                return value;
            }
            var dumpedObj = JSON.stringify({'@0': {x: 1, c: 3}});

            expect(D.dump(obj, {serializer: serializer})).to.be.eql(dumpedObj);
        });
    });

    describe('Custom serialization with multi links', function () {
        var date = new Date('2015-04-26T20:39:35.208Z');
        var obj = {x: 1, y: date, c: 3, d: date, f: {g: date}};

        deepFreeze(obj);

        it('Serialieze', function () {
            var dumpedObj = JSON.stringify({
                '@0': {x: 1, y: '@1', c: 3, d: '@1', f: '@2'},
                '@1': {value: '2015-04-26T20:39:35.208Z', '__meta__': 'date'},
                '@2': {g: '@1'}
            });

            expect(D.dump(obj, {serializer: dateSerializer})).to.be.eql(dumpedObj);
        });

        function dateSerializer (key, value) {
            if (value instanceof Date)
                return {value: value.toJSON(), '__meta__': 'date'};

            return value;
        }
    });
});

