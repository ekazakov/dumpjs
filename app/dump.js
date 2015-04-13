'use strict';

var _ = require('lodash');

module.exports = {
    dump: dump
};

function getId (n) {
    return '@' + n;
}

function stringify (data) {

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

function dump (obj) {
    var serialized = {};
    var uprocessed = new Map();
    var id = 0;
    var key = getId(id);

    if (obj == null) return;

    serialized[key] = clonePrimitives({}, obj);







    // Object
    //     .keys(obj)
    //     .forEach(function (prop) {
    //         if (_.isObject(obj[prop])) {
    //             var propKey = getId(++id);

    //             serialized[key][prop] = propKey;
    //             serialized[propKey] = {};

    //             uprocessed.set(obj[prop], propKey);

    //             Object.keys(obj[prop]).forEach(function (prop2) {
    //                 serialized[propKey][prop2] = obj[prop][prop2];
    //             });
    //         } else {
    //             serialized[key][prop] = obj[prop];
    //         }
    //     })
    // ;



    return JSON.stringify(serialized);

    function _dump (obj, id) {
    }
}
