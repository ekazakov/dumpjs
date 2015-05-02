'use strict';

export const isArray = Array.isArray;

export function isFunction (fn) {
    return typeof fn === 'function';
}

export function shellowClone (obj) {
    return isArray(obj) ? obj.slice() : merge({}, obj);
}

export function identity (key, value) {
    return value;
}

const regex = /^@\d{1,}$/i;

export function isObjectRef (key) {
    return regex.test(key);
}

export function keys (obj) {
    return Object.keys(obj);
}

export function merge (obj) {
    const length = arguments.length;

    if (length < 2 || obj == null) return obj;

    for (let index = 1; index < length; index++) {
        const source = arguments[index];
        const keysList = keys(source);
        const l = keysList.length;

        for (let i = 0; i < l; i++) {
            const key = keysList[i];
            obj[key] = source[key];
        }
    }

    return obj;
}

export function getId (n) {
    return '@' + n;
}

export function isPrimitive (obj) {
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
}

export function createObjectHandler (callback) {
    const memo = new Map();

    return isFunction(callback) ? objectHandler : identity;

    function objectHandler (key, value) {
        if (!memo.has(value))
            memo.set(value, callback(key, value));

        return memo.get(value);
    }
}
