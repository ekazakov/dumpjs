'use strict';

var utils = require('./utils');

var isArray = utils.isArray;
var getId = utils.getId;
var isPrimitive = utils.isPrimitive;
var isFunction = utils.isFunction;
var createObjectHandler = utils.createObjectHandler;
var shellowClone = utils.shellowClone;
var keys = utils.keys;
var isObjectRef = utils.isObjectRef;

function dump (obj, options) {
    var serialized = {};
    var unprocessed = [];
    var identities = new Map();
    var id = 0;
    var key = getId(id);
    var serializer = createObjectHandler(options && options.serializer);
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

            obj = shellowClone(obj);
            obj[prop] = serializer(prop, obj[prop]);

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
}

function restore (data, options) {
    var deserializer = createObjectHandler(options && options.deserializer);
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
}

module.exports = {
    dump: dump,
    restore: restore
};
