(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dump = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } };

var _isArray$getId$isPrimitiveProperty$isPrimitive$isFunction$createObjectHandler$shellowClone$keys$isObjectRef = _dereq_('./utils');

'use strict';

function dump(root, options) {
    var serialized = {};
    var unprocessed = [];
    var identities = new Map();
    var id = 0;
    var key = _isArray$getId$isPrimitiveProperty$isPrimitive$isFunction$createObjectHandler$shellowClone$keys$isObjectRef.getId(id);
    var serializer = _isArray$getId$isPrimitiveProperty$isPrimitive$isFunction$createObjectHandler$shellowClone$keys$isObjectRef.createObjectHandler(options && options.serializer);

    if (root == null) {
        return;
    }serialized[key] = _dump(root, key);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = unprocessed[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _slicedToArray(_step.value, 2);

            var obj = _step$value[0];
            var identifier = _step$value[1];

            serialized[identifier] = _dump(obj, identifier);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
                _iterator['return']();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return JSON.stringify(serialized);

    function _dump(obj, identifier) {
        if (!identities.has(obj)) identities.set(obj, identifier);

        var data = _isArray$getId$isPrimitiveProperty$isPrimitive$isFunction$createObjectHandler$shellowClone$keys$isObjectRef.isArray(obj) ? obj : Object.keys(obj);
        return data.reduce(destruct(obj), _isArray$getId$isPrimitiveProperty$isPrimitive$isFunction$createObjectHandler$shellowClone$keys$isObjectRef.isArray(obj) ? [] : {});
    }

    function destruct(obj) {
        return function (result, item, index) {
            var prop = _isArray$getId$isPrimitiveProperty$isPrimitive$isFunction$createObjectHandler$shellowClone$keys$isObjectRef.isArray(result) ? index : item;

            obj = _isArray$getId$isPrimitiveProperty$isPrimitive$isFunction$createObjectHandler$shellowClone$keys$isObjectRef.shellowClone(obj);
            obj[prop] = serializer(prop, obj[prop]);

            if (_isArray$getId$isPrimitiveProperty$isPrimitive$isFunction$createObjectHandler$shellowClone$keys$isObjectRef.isFunction(obj[prop])) return result;
            if (obj[prop] === undefined) return result;

            if (_isArray$getId$isPrimitiveProperty$isPrimitive$isFunction$createObjectHandler$shellowClone$keys$isObjectRef.isPrimitiveProperty(obj, prop)) {
                result[prop] = obj[prop];
            } else {
                result[prop] = generateObjId(obj, prop);
            }

            return result;
        };
    }

    function generateObjId(obj, prop) {
        var value = obj[prop];
        var objId = undefined;

        if (!identities.has(value)) {
            objId = _isArray$getId$isPrimitiveProperty$isPrimitive$isFunction$createObjectHandler$shellowClone$keys$isObjectRef.getId(++id);
            identities.set(value, objId);
            unprocessed.push([value, objId]);
        } else {
            objId = identities.get(value);
        }

        return objId;
    }
}

function restore(data, options) {
    var visited = new Set();
    var deserializer = _isArray$getId$isPrimitiveProperty$isPrimitive$isFunction$createObjectHandler$shellowClone$keys$isObjectRef.createObjectHandler(options && options.deserializer);
    var source = JSON.parse(data);
    var keysList = _isArray$getId$isPrimitiveProperty$isPrimitive$isFunction$createObjectHandler$shellowClone$keys$isObjectRef.keys(source);

    if (keysList.length === 0) {
        return source;
    }keysList.forEach(function (key) {
        var obj = source[key];
        _isArray$getId$isPrimitiveProperty$isPrimitive$isFunction$createObjectHandler$shellowClone$keys$isObjectRef.keys(obj).filter(function (key) {
            return _isArray$getId$isPrimitiveProperty$isPrimitive$isFunction$createObjectHandler$shellowClone$keys$isObjectRef.isObjectRef(obj[key]);
        }).forEach(function iter(key) {
            obj[key] = source[obj[key]]; //deserializer(key, source[obj[key]]);
        });
    });

    _isArray$getId$isPrimitiveProperty$isPrimitive$isFunction$createObjectHandler$shellowClone$keys$isObjectRef.keys(source['@0']).forEach(createPropHandler(source['@0'], visited, deserializer));

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = visited[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var item = _step2.value;

            if (item == null || _isArray$getId$isPrimitiveProperty$isPrimitive$isFunction$createObjectHandler$shellowClone$keys$isObjectRef.isPrimitive(item) || Object.isFrozen(item)) continue;

            _isArray$getId$isPrimitiveProperty$isPrimitive$isFunction$createObjectHandler$shellowClone$keys$isObjectRef.keys(item).forEach(createPropHandler(item, visited, deserializer));
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                _iterator2['return']();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return source['@0'];
}

function createPropHandler(item, visited, deserializer) {
    return function propertyHandler(prop) {
        var propDescriptor = Object.getOwnPropertyDescriptor(item, prop);

        if ('set' in propDescriptor && propDescriptor.set == null) {
            return;
        }if (propDescriptor.writable === false) {
            return;
        } // TODO if returned value didn't changed, don't assign it
        item[prop] = deserializer(prop, item[prop]);

        if (!visited.has(item[prop])) visited.add(item[prop]);
    };
}

module.exports = {
    dump: dump,
    restore: restore
};

},{"./utils":2}],2:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.isFunction = isFunction;
exports.shellowClone = shellowClone;
exports.identity = identity;
exports.isObjectRef = isObjectRef;
exports.getId = getId;
exports.isPrimitiveProperty = isPrimitiveProperty;
exports.isPrimitive = isPrimitive;
exports.createObjectHandler = createObjectHandler;
'use strict';

var isArray = Array.isArray;

exports.isArray = isArray;
var merge = Object.assign;

exports.merge = merge;
var keys = Object.keys;

exports.keys = keys;

function isFunction(fn) {
    return typeof fn === 'function';
}

function shellowClone(obj) {
    return isArray(obj) ? obj.slice() : merge({}, obj);
}

function identity(key, value) {
    return value;
}

var regex = /^@\d{1,}$/i;

function isObjectRef(key) {
    return regex.test(key);
}

function getId(n) {
    return '@' + n;
}

function isPrimitiveProperty(obj, prop) {
    if (prop != null) {
        return isPrimitive(obj[prop]);
    } else {
        return function (prop) {
            return isPrimitive(obj[prop]);
        };
    }
}

function isPrimitive(value) {
    return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null;
}

function createObjectHandler(callback) {
    var memo = new Map();

    return isFunction(callback) ? objectHandler : identity;

    function objectHandler(key, value) {
        if (!memo.has(value)) memo.set(value, callback(key, value));

        return memo.get(value);
    }
}

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVm9sdW1lcy9TdG9yYWdlXzEvV29ya3NwYWNlL2R1bXBqcy9zcmMvZHVtcC5qcyIsIi9Wb2x1bWVzL1N0b3JhZ2VfMS9Xb3Jrc3BhY2UvZHVtcGpzL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7MEhDWVcsU0FBUzs7QUFacEIsWUFBWSxDQUFDOztBQWNiLFNBQVMsSUFBSSxDQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7QUFDMUIsUUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLFFBQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUN2QixRQUFNLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQzdCLFFBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNYLFFBQU0sR0FBRyxHQUFHLDRHQWZaLEtBQUssQ0FlYSxFQUFFLENBQUMsQ0FBQztBQUN0QixRQUFNLFVBQVUsR0FBRyw0R0FabkIsbUJBQW1CLENBWW9CLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRXRFLFFBQUksSUFBSSxJQUFJLElBQUk7QUFBRSxlQUFPO0tBQUEsQUFFekIsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7Ozs7Ozs7QUFFbkMsNkJBQThCLFdBQVc7OztnQkFBL0IsR0FBRztnQkFBRSxVQUFVOztBQUNyQixzQkFBVSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7U0FBQTs7Ozs7Ozs7Ozs7Ozs7OztBQUVwRCxXQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRWxDLGFBQVMsS0FBSyxDQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUU7QUFDN0IsWUFBSSxDQUFD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QUU7QUFDaEMsWUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQ2hCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQzs7QUFFMUMsZUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzFCO0NBQ0oiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge1xuICAgIGlzQXJyYXksXG4gICAgZ2V0SWQsXG4gICAgaXNQcmltaXRpdmVQcm9wZXJ0eSxcbiAgICBpc1ByaW1pdGl2ZSxcbiAgICBpc0Z1bmN0aW9uLFxuICAgIGNyZWF0ZU9iamVjdEhhbmRsZXIsXG4gICAgc2hlbGxvd0Nsb25lLFxuICAgIGtleXMsXG4gICAgaXNPYmplY3RSZWZcbiAgICB9IGZyb20gJy4vdXRpbHMnO1xuXG5mdW5jdGlvbiBkdW1wIChyb290LCBvcHRpb25zKSB7XG4gICAgY29uc3Qgc2VyaWFsaXplZCA9IHt9O1xuICAgIGNvbnN0IHVucHJvY2Vzc2VkID0gW107XG4gICAgY29uc3QgaWRlbnRpdGllcyA9IG5ldyBNYXAoKTtcbiAgICBsZXQgaWQgPSAwO1xuICAgIGNvbnN0IGtleSA9IGdldElkKGlkKTtcbiAgICBjb25zdCBzZXJpYWxpemVyID0gY3JlYXRlT2JqZWN0SGFuZGxlcihvcHRpb25zICYmIG9wdGlvbnMuc2VyaWFsaXplcik7XG5cbiAgICBpZiAocm9vdCA9PSBudWxsKSByZXR1cm47XG5cbiAgICBzZXJpYWxpemVkW2tleV0gPSBfZHVtcChyb290LCBrZXkpO1xuXG4gICAgZm9yIChsZXQgW29iaiwgaWRlbnRpZmllcl0gb2YgdW5wcm9jZXNzZWQpXG4gICAgICAgIHNlcmlhbGl6ZWRbaWRlbnRpZmllcl0gPSBfZHVtcChvYmosIGlkZW50aWZpZXIpO1xuXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHNlcmlhbGl6ZWQpO1xuXG4gICAgZnVuY3Rpb24gX2R1bXAgKG9iaiwgaWRlbnRpZmllcikge1xuICAgICAgICBpZiAoIWlkZW50aXRpZXMuaGFzKG9iaikpIGlkZW50aXRpZXMuc2V0KG9iaiwgaWRlbnRpZmllcik7XG5cbiAgICAgICAgY29uc3QgZGF0YSA9IGlzQXJyYXkob2JqKSA/IG9iaiA6IE9iamVjdC5rZXlzKG9iaik7XG4gICAgICAgIHJldHVybiBkYXRhLnJlZHVjZShkZXN0cnVjdChvYmopLCBpc0FycmF5KG9iaikgPyBbXSA6IHt9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXN0cnVjdCAob2JqKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAocmVzdWx0LCBpdGVtLCBpbmRleCkge1xuICAgICAgICAgICAgY29uc3QgcHJvcCA9IGlzQXJyYXkocmVzdWx0KSA/IGluZGV4IDogaXRlbTtcblxuICAgICAgICAgICAgb2JqID0gc2hlbGxvd0Nsb25lKG9iaik7XG4gICAgICAgICAgICBvYmpbcHJvcF0gPSBzZXJpYWxpemVyKHByb3AsIG9ialtwcm9wXSk7XG5cbiAgICAgICAgICAgIGlmIChpc0Z1bmN0aW9uKG9ialtwcm9wXSkpIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICBpZiAob2JqW3Byb3BdID09PSB1bmRlZmluZWQpIHJldHVybiByZXN1bHQ7XG5cbiAgICAgICAgICAgIGlmIChpc1ByaW1pdGl2ZVByb3BlcnR5KG9iaiwgcHJvcCkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbcHJvcF0gPSBvYmpbcHJvcF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wXSA9IGdlbmVyYXRlT2JqSWQob2JqLCBwcm9wKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZU9iaklkIChvYmosIHByb3ApIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBvYmpbcHJvcF07XG4gICAgICAgIGxldCBvYmpJZDtcblxuICAgICAgICBpZiAoIWlkZW50aXRpZXMuaGFzKHZhbHVlKSkge1xuICAgICAgICAgICAgb2JqSWQgPSBnZXRJZCgrK2lkKTtcbiAgICAgICAgICAgIGlkZW50aXRpZXMuc2V0KHZhbHVlLCBvYmpJZCk7XG4gICAgICAgICAgICB1bnByb2Nlc3NlZC5wdXNoKFt2YWx1ZSwgb2JqSWRdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9iaklkID0gaWRlbnRpdGllcy5nZXQodmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9iaklkO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcmVzdG9yZSAoZGF0YSwgb3B0aW9ucykge1xuICAgIGNvbnN0IHZpc2l0ZWQgPSBuZXcgU2V0KCk7XG4gICAgY29uc3QgZGVzZXJpYWxpemVyID0gY3JlYXRlT2JqZWN0SGFuZGxlcihvcHRpb25zICYmIG9wdGlvbnMuZGVzZXJpYWxpemVyKTtcbiAgICBjb25zdCBzb3VyY2UgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgIGNvbnN0IGtleXNMaXN0ID0ga2V5cyhzb3VyY2UpO1xuXG4gICAgaWYgKGtleXNMaXN0Lmxlbmd0aCA9PT0gMCkgcmV0dXJuIHNvdXJjZTtcblxuICAgIGtleXNMaXN0LmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBjb25zdCBvYmogPSBzb3VyY2Vba2V5XTtcbiAgICAgICAga2V5cyhvYmopXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXNPYmplY3RSZWYob2JqW2tleV0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIGl0ZXIgKGtleSkge1xuICAgICAgICAgICAgICAgIG9ialtrZXldID0gc291cmNlW29ialtrZXldXTsvL2Rlc2VyaWFsaXplcihrZXksIHNvdXJjZVtvYmpba2V5XV0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgO1xuICAgIH0pO1xuXG4gICAga2V5cyhzb3VyY2VbJ0AwJ10pLmZvckVhY2goY3JlYXRlUHJvcEhhbmRsZXIoc291cmNlWydAMCddLCB2aXNpdGVkLCBkZXNlcmlhbGl6ZXIpKTtcblxuICAgIGZvciAobGV0IGl0ZW0gb2YgdmlzaXRlZCkge1xuICAgICAgICBpZiAoaXRlbSA9PSBudWxsIHx8IGlzUHJpbWl0aXZlKGl0ZW0pIHx8IE9iamVjdC5pc0Zyb3plbihpdGVtKSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGtleXMoaXRlbSkuZm9yRWFjaChjcmVhdGVQcm9wSGFuZGxlcihpdGVtLCB2aXNpdGVkLCBkZXNlcmlhbGl6ZXIpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc291cmNlWydAMCddO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVQcm9wSGFuZGxlciAoaXRlbSwgdmlzaXRlZCwgZGVzZXJpYWxpemVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIHByb3BlcnR5SGFuZGxlciAocHJvcCkge1xuICAgICAgICBjb25zdCBwcm9wRGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXRlbSwgcHJvcCk7XG5cbiAgICAgICAgaWYgKCdzZXQnIGluIHByb3BEZXNjcmlwdG9yICYmIHByb3BEZXNjcmlwdG9yLnNldCA9PSBudWxsKSByZXR1cm47XG4gICAgICAgIGlmIChwcm9wRGVzY3JpcHRvci53cml0YWJsZSA9PT0gZmFsc2UpIHJldHVybjtcblxuICAgICAgICAvLyBUT0RPIGlmIHJldHVybmVkIHZhbHVlIGRpZG4ndCBjaGFuZ2VkLCBkb24ndCBhc3NpZ24gaXRcbiAgICAgICAgaXRlbVtwcm9wXSA9IGRlc2VyaWFsaXplcihwcm9wLCBpdGVtW3Byb3BdKTtcblxuICAgICAgICBpZiAoIXZpc2l0ZWQuaGFzKGl0ZW1bcHJvcF0pKSB2aXNpdGVkLmFkZChpdGVtW3Byb3BdKTtcbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBkdW1wOiBkdW1wLFxuICAgIHJlc3RvcmU6IHJlc3RvcmVcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBjb25zdCBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxuZXhwb3J0IGNvbnN0IG1lcmdlID0gT2JqZWN0LmFzc2lnbjtcblxuZXhwb3J0IGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzRnVuY3Rpb24gKGZuKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNoZWxsb3dDbG9uZSAob2JqKSB7XG4gICAgcmV0dXJuIGlzQXJyYXkob2JqKSA/IG9iai5zbGljZSgpIDogbWVyZ2Uoe30sIG9iaik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpZGVudGl0eSAoa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbn1cblxuY29uc3QgcmVnZXggPSAvXkBcXGR7MSx9JC9pO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3RSZWYgKGtleSkge1xuICAgIHJldHVybiByZWdleC50ZXN0KGtleSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJZCAobikge1xuICAgIHJldHVybiAnQCcgKyBuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQcmltaXRpdmVQcm9wZXJ0eSAob2JqLCBwcm9wKSB7XG4gICAgaWYgKHByb3AgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gaXNQcmltaXRpdmUob2JqW3Byb3BdKTtcbiAgICB9IGVsc2VcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNQcmltaXRpdmUob2JqW3Byb3BdKTtcbiAgICAgICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUHJpbWl0aXZlICh2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgdHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgdmFsdWUgPT09IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVPYmplY3RIYW5kbGVyIChjYWxsYmFjaykge1xuICAgIGNvbnN0IG1lbW8gPSBuZXcgTWFwKCk7XG5cbiAgICByZXR1cm4gaXNGdW5jdGlvbihjYWxsYmFjaykgPyBvYmplY3RIYW5kbGVyIDogaWRlbnRpdHk7XG5cbiAgICBmdW5jdGlvbiBvYmplY3RIYW5kbGVyIChrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmICghbWVtby5oYXModmFsdWUpKVxuICAgICAgICAgICAgbWVtby5zZXQodmFsdWUsIGNhbGxiYWNrKGtleSwgdmFsdWUpKTtcblxuICAgICAgICByZXR1cm4gbWVtby5nZXQodmFsdWUpO1xuICAgIH1cbn1cbiJdfQ==
