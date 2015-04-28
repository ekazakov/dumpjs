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

function merge (obj) {
    var length = arguments.length;
    var index, source, keysList, l, i, key;

    if (length < 2 || obj == null) return obj;

    for (index = 1; index < length; index++) {
        source = arguments[index];
        keysList = keys(source);
        l = keysList.length;

        for (i = 0; i < l; i++) {
            key = keysList[i];
            obj[key] = source[key];
        }
    }
    return obj;
};

function shellowClone (obj) {
    return isArray(obj) ? obj.slice() : merge({}, obj);
}

function dump (obj, options) {
    var serialized = {};
    var unprocessed = [];
    var identities = new Map();
    var id = 0;
    var key = getId(id);
    var serializer = createSerializer(options);
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

            if (hasCustomSerializer()) {
                obj = shellowClone(obj);
                obj[prop] = serializer(prop, obj[prop]);
            }

            if (isFunction(obj[prop])) return result;
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
        var value = obj[prop];
        var objId;

        if (!identities.has(value)) {
            objId = getId(++id);
            identities.set(value, objId);
            unprocessed.push([value, objId]);
        } else {
            objId = identities.get(value);
        }

        return objId;
    }

    function hasCustomSerializer () {
        return options != null && isFunction(options.serializer);
    }
}

function createSerializer (options) {
    Object.defineProperty(serializer, '_values', {
        value: [],
        enumerable: false
    });

    Object.defineProperty(serializer, '_memo', {
        value: [],
        enumerable: false
    });

    function serializer (key, value) {
        var index = serializer._values.indexOf(value);
        var result;

        if (index === -1) {
            result = options.serializer(key, value);
            serializer._values.push(value);
            serializer._memo.push(result);

            return result;
        }

        return serializer._memo[index];
    }

    return serializer;
}

function restore (data, options) {
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
                obj[key] = deserializer(key, source[obj[key]]);
            })
        ;
    });

    return source['@0'];

    function deserializer (key, value) {
        if (options != null && isFunction(options.deserializer))
            return options.deserializer(key, value);

        return value;
    }
}

function isFunction (fn) {
    return typeof fn === 'function';
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
