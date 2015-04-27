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

    function _isPrimitive(prop) {
        return typeof obj[prop] === 'string' ||
            typeof obj[prop] === 'number' ||
            typeof obj[prop] === 'boolean' ||
            obj[prop] === null;
    }
}



function dump (obj, options) {
    var serialized = {};
    var unprocessed = [];
    var identities = new Map();
    var id = 0;
    var key = getId(id);
    var entry;

    if (obj == null) return;

    serialized[key] = _dump(obj, key);

    while ((entry = unprocessed.shift(), entry != null))
        serialized[entry[1]] = _dump(entry[0], entry[1]);

    return JSON.stringify(serialized);

    function _dump (obj, key) {
        if (!identities.has(obj)) identities.set(obj, key);

        var data = isArray(obj) ? obj : Object.keys(obj);
        return data.reduce(destruct(obj), isArray(obj) ? [] : {});
    }


    function destruct (obj) {
        return function (result, item, index) {
            var prop = isArray(result) ? index : item;

            obj[prop] = serializer(prop, obj[prop]);

            if (typeof obj[prop] === 'function') return result;
            if (obj[prop] === undefined) return result;

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
            unprocessed.push([obj[prop], objId]);
        } else {
            objId = identities.get(obj[prop]);
        }

        return objId;
    }

    function serializer (key, value) {
        if (options != null && typeof options.serializer === 'function')
            return options.serializer(key, value);
        return value;
    }
}

function restore (data) {
    var source = JSON.parse(data);
    var keysList = keys(source);

    if (keysList.length === 0) return source;

    keysList.forEach(function (key) {
        var obj = source[key];
        keys(obj)
            .filter(function (key) {
                return isObjectRef(obj[key]);
            })
            .forEach(function iter (key) {
                obj[key] = source[obj[key]];
            })
        ;
    });

    return source['@0'];
}

var regex = /^@\d{1,}$/i;

function isObjectRef (key) {
    return regex.test(key);
}

function keys (obj) {
    return Object.keys(obj);
}

module.exports = {
    dump: dump,
    restore: restore
};
