'use strict';

var _ = require('lodash');

module.exports = {
    dump: dump
};

function getId (n) {
    return '@' + n;
}

var isPrimitive = _.curry(function isPrimitive (obj, prop) {
    return !_.isObject(obj[prop]);
});

var isNotPrimitive = _.curry(function isNotPrimitive (obj, prop) {
    return _.isObject(obj[prop]);
});

var clone = _.curry(function clone (target, src, prop) {
    // console.log('prop:', prop);
    target[prop] = src[prop];
});

function clonePrimitives (target, obj) {
    Object
        .keys(obj)
        .filter(isPrimitive(obj))
        .forEach(clone(target, obj))
    ;

    return target;
}

function dump (src) {
    var serialized = {};
    var unprocessed = new Map();
    var identities = new Map();
    var id = 0;
    var key = getId(id);

    if (src == null) return;

    _dump(serialized, unprocessed, src, key);

    var entries = unprocessed.entries();
    var entry;

    while ((entry = entries.next(), !entry.done)) {
        var obj = entry.value[0];
        var objId = entry.value[1];

        _dump(serialized, unprocessed, obj, objId);
    }

    function foobar (unprocessed, identities,   obj, prop) {
        var propId;

        if (!identities.has(obj[prop])) {
            propId = getId(++id);
            unprocessed.set(obj[prop], propId);
        } else {
            propId = identities.get(obj[prop]);
        }

        return propId;
    }

    function destruct (result, item, index) {
        var prop = _.isArray(result) ? index : item;
        if (isPrimitive(obj, prop)) {
            result[prop] = obj[prop];
        } else {
            result[prop] = foobar(unprocessed, identities, obj, prop);
        }

        return result[prop];
    }

    function _dump (serialized, unprocessed, obj, key) {
        if (!identities.has(obj)) identities.set(obj, key);

        if (_.isArray(obj)) {
            serialized[key] = obj.reduce(function (result, item, prop) {


                return destruct(result, item, prop);
            }, []);
        } else {
            serialized[key] = Object
                .keys(obj)
                .reduce(function (result, prop) {
                    if (isPrimitive(obj, prop)) {
                        result[prop] = obj[prop];
                    } else {
                        result[prop] = foobar(unprocessed, identities, obj, prop);
                    }

                    return result;
                }, {})
            ;
        }
    }

    return JSON.stringify(serialized);
}
