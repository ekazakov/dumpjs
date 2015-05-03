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

## Install

```
npm install --save dumpjs
```

Works in node and browser.

## How to use


