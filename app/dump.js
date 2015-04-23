'use strict';

var isArray = Array.isArray;

function getId (n) {
    return '@' + n;
}

function isPrimitive (obj) {
    if (arguments.length === 2) {
        return _isPrimitive(arguments[1]);
    } else
        return _isPrimitive;

     function _isPrimitive (prop) {
         return typeof obj[prop] === 'string' ||
             typeof obj[prop] === 'number' ||
             typeof obj[prop] === 'boolean';
     }
}

function dump (obj) {
    var serialized = {};
    var unprocessed = new Map();
    var identities = new Map();
    var id = 0;
    var key = getId(id);
    var entry;

    if (obj == null) return;

    _dump(obj, key);

    var entries = unprocessed.entries();

    while ((entry = entries.next(), !entry.done))
        _dump(entry.value[0], entry.value[1]);

    return JSON.stringify(serialized);

    function _dump (obj, key) {
        if (!identities.has(obj)) identities.set(obj, key);

        var data = isArray(obj) ? obj : Object.keys(obj);
        serialized[key] = data.reduce(destruct(obj), isArray(obj) ? [] : {});
    }

    function destruct (obj) {
        return function (result, item, index) {
            var prop = isArray(result) ? index : item;

            if (isPrimitive(obj, prop)) {
                result[prop] = obj[prop];
            } else {
                result[prop] = generateObjId(obj, prop);
            }

            return result;
        };
    }

    function generateObjId (obj, prop) {
        var objId;

        if (!identities.has(obj[prop])) {
            objId = getId(++id);
            unprocessed.set(obj[prop], objId);
        } else {
            objId = identities.get(obj[prop]);
        }

        return objId;
    }
}

module.exports = {
    dump: dump
};
