'use strict';

import {
    isArray,
    getId,
    isPrimitiveProperty,
    isPrimitive,
    isFunction,
    createObjectHandler,
    shellowClone,
    keys,
    isObjectRef
    } from './utils';

function dump (root, options) {
    const serialized = {};
    const unprocessed = [];
    const identities = new Map();
    let id = 0;
    const key = getId(id);
    const handler = createObjectHandler(options && options.serializer);

    const serializer = function (key, value) {
        var result = handler(key, value);

        if (result instanceof Map)
            return {entries: [...result], '__dump__': 'ES6Map'};

        if (result instanceof Set)
            return {values: [...result], '__dump__': 'ES6Set'};

        return result;
    };

    if (root == null) return;

    serialized[key] = _dump(root, key);

    for (let [obj, identifier] of unprocessed)
        serialized[identifier] = _dump(obj, identifier);

    return JSON.stringify(serialized);

    function _dump (obj, identifier) {
        if (!identities.has(obj)) identities.set(obj, identifier);

        const data = isArray(obj) ? obj : Object.keys(obj);
        return data.reduce(destruct(obj), isArray(obj) ? [] : {});
    }

    function destruct (obj) {
        return function (result, item, index) {
            const prop = isArray(result) ? index : item;

            obj = shellowClone(obj);
            obj[prop] = serializer(prop, obj[prop]);

            if (isFunction(obj[prop])) return result;
            if (obj[prop] === undefined) return result;

            if (isPrimitiveProperty(obj, prop)) {
                result[prop] = obj[prop];
            } else {
                result[prop] = generateObjId(obj, prop);
            }

            return result;
        };
    }

    function generateObjId (obj, prop) {
        const value = obj[prop];
        let objId;

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
    const visited = new Set();
    const handler = createObjectHandler(options && options.deserializer);
    const source = JSON.parse(data);
    const keysList = keys(source);

    if (keysList.length === 0) return source;

    keysList.forEach(function (key) {
        const obj = source[key];
        keys(obj)
            .filter((key) => isObjectRef(obj[key]))
            .forEach(function iter (key) {
                obj[key] = source[obj[key]];//deserializer(key, source[obj[key]]);
            })
        ;
    });

    keys(source['@0']).forEach(createPropHandler(source['@0'], visited, deserializer));

    for (let item of visited) {
        if (item == null || isPrimitive(item) || Object.isFrozen(item))
            continue;

        if (item instanceof Map) {
            for (let [key, value] of item) {
                const transformed = deserializer(key, value);
                item.set(key, transformed);
                if (!visited.has(transformed)) visited.add(transformed);
            }
        } else if (item instanceof Set) {
            const setEntries = [...item.entries()];
            item.clear();

            for (let [key, value] of setEntries) {
                const transformed = deserializer(key, value);
                item.add(transformed);
                if (!visited.has(transformed)) visited.add(transformed);
            }
        } else
            keys(item).forEach(createPropHandler(item, visited, deserializer));
    }

    function deserializer (key, value) {
        var result = handler(key, value);

        if (result != null && result['__dump__'] === 'ES6Map') {
            return new Map(result.entries);
        }

        if (result != null && result['__dump__'] === 'ES6Set') {
            return new Set(result.values);
        }

        return result;
    }

    return source['@0'];
}

function createPropHandler (item, visited, deserializer) {
    return function propertyHandler (prop) {
        const propDescriptor = Object.getOwnPropertyDescriptor(item, prop);

        if ('set' in propDescriptor && propDescriptor.set == null) return;
        if (propDescriptor.writable === false) return;

        // TODO if returned value didn't changed, don't assign it
        item[prop] = deserializer(prop, item[prop]);

        if (!visited.has(item[prop])) visited.add(item[prop]);
    };
}

module.exports = {
    dump: dump,
    restore: restore
};
