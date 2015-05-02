'use strict';

const isArray = Array.isArray;

function isFunction (fn) {
    return typeof fn === 'function';
}

function shellowClone (obj) {
    return isArray(obj) ? obj.slice() : merge({}, obj);
}

function identity (key, value) {
    return value;
}

const regex = /^@\d{1,}$/i;

function isObjectRef (key) {
    return regex.test(key);
}

function keys (obj) {
    return Object.keys(obj);
}

function merge (obj) {
    const length = arguments.length;
    let index, source, keysList, l, i, key;

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
}

module.exports = {
    isArray: isArray,

    isFunction: isFunction,

    keys: keys,

    isObjectRef: isObjectRef,

    getId: function getId (n) {
        return '@' + n;
    },

    isPrimitive: function isPrimitive (obj) {
        if (arguments.length === 2) {
            return _isPrimitive(arguments[1]);
        } else
            return _isPrimitive;

        function _isPrimitive (prop) {
            return typeof obj[prop] === 'string' ||
                typeof obj[prop] === 'number' ||
                typeof obj[prop] === 'boolean' ||
                obj[prop] === null;
        }
    },

    merge: merge,

    shellowClone: shellowClone,

    identity: identity,

    createObjectHandler: function createObjectHandler (callback) {
        var memo = new Map();

        return isFunction(callback) ? objectHandler : identity;

        function objectHandler (key, value) {
            if (!memo.has(value))
                memo.set(value, callback(key, value));

            return memo.get(value);
        }
    }
};
