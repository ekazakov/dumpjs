# dumpjs

Serialize and deserialize any JS objects to JSON.

Sometimes you need serialize your objects to JSON and deserialize them back again. 
But JSON stringify/parse is not enough, 
because you need support circular links and restore custom object.

Dumpjs allow easily serialize to JSON and restore any object. 
It handle circular links, preserve identities and support custom serialization/deserialization handlers.

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

Function `dump` recives options as second argument.

`serializer` – function for custom serialization. 
Receives property name and value. Return `undefined` to prevent property serialization. 

```js
var obj = {m: new Map ([['a', 1], ['b', 2]])};

function mapSerializer (key, obj) {
    if (obj instanceof Map) return {
        entries: [...obj],
        '__meta__': 'ES6Map'
    };

    return obj;
}
```

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


