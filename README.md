# dumpjs

Sometimes you need serialize your objects to JSON and deserialize them back again. 
But JSON stringify/parse is not enough, 
because you need support circular links and restore custom object.

Dumpjs allow easily serialize to JSON and restore any object. 

Main points:
- It handle circular links
- Preserve object identities 
- Works with any level of nesting objects
- Support custom serialization/deserialization handlers

**Circular links**

```js
var obj = {x: 1, y: {h: 'hello'}};
obj.y.o = obj;

JSON.stringify(obj); 
// TypeError: Converting circular structure to JSON

var D = require('dumpjs');
D.dump(obj);
// {
//   "@0": {
//     "x": 1, "y": "@1"
//   },
//   "@1": {
//     "h": "hello", "o": "@0"
//   }
// }
```

Dumpjs creates IDs for every object and use them as references.

**Preserve identities**

```js
var obj2 = {x: 1, y: 2};
var obj3 = [obj2, obj2];
var restored = JSON.parse(JSON.stringify(obj3));
restored[0] === restored[1]; // false
```

JSON.parse create completly different objects.

```js
var restored = D.restore(D.dump(obj3));
restored[0] === restored[1]; // true
```

**Custom serializers/deserializers**

**`D.dump(object|array[,options])`** 

`options.serializer(key, value)` 
Custom serialization:
- Return `undefined`, if you want prevent serialization of the property. If function returns `null`, then property will be serialized as `null` (`JSON.stringify` converts `undefined` to `null`).
- Memorizes received value and invocation result. For the same value always return the same result.


```js
var obj = {m: new Map ([['a', 1], ['b', 2]])};

function mapSerializer (key, obj) {
    if (obj instanceof Map) return {
        entries: [...obj],
        '__meta__': 'ES6Map'
    };

    return obj;
}

// {
//   "@0": {"map": "@1"},
//   "@1": {"entries": "@2", "__meta__": "ES6Map"},
//   "@2": ["@3", "@4"],
//   "@3": ["a", 1],
//   "@4": ["b", 2]
// }
```

**`D.restore(string[,options])`**

`options.deserializer(key, value)` 
Custom deserialization:
- Memorizes received value and invocation result. For the same value always return the same result.


```js
function mapDeserializer (key, obj) {
    if (obj && obj['__meta__'] === 'ES6Map') {
        return new Map(obj.entries);
    }

    return obj;
}

var json = D.dump(obj, {serializer: mapSerializer});
var restored = D.restore(json, {deserializer: mapDeserializer});
```

## Install

```
npm install --save dumpjs
```

Works in node and browser.

## How to use


