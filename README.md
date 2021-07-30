# Leapond ns()

Single `ns()` function to get/set value of deep Object

## Power

1. Performance
1. Dig Map() supported
1. Auto create/replace required part to Object/Array
1. `mustOwn` configurable
1. Batch get/set

Found more in the `Options` document and Enjoy your playing. 🏓

## Installation

**NPM**

```shell
# for node(bundled)
npm i leapond-ns -D
# for web(esm)
npm i leapond-ns
```

**Yarn**

```shell
# for node(bundled)
yarn add leapond-ns -D
# for web
yarn add leapond-ns
```

## Usage

```javascript
// for node(bundled)
import {ns} from "leapond-ns";
// for web(esm)
import {ns} from "leapond-ns/src";

ns(target, path)
ns(target, path, value)
ns(target, ['a', 'b.c', symb, fn], value) // string with dot, Symbol, Object key of Map
ns(target, options, value)
```

## Options

```javascript
/**
 * @typedef options
 * @property {boolean} [detailedResult=false] - if set to true, will return {value, oldValue, success, parent}, otherwise it just returned the value or if set successfully
 * @property {string|Array<string|Symbol>} [path] - if the path contains some special property names(like Symbol, string with dot), pls using an array of properties
 * @property {string|Array<string|Symbol>[]} [paths] - batch operation. if `path` existed, `paths` will be ignored
 * @property {*} [value] - value for set. if 3rd argument passed, this will be ignored
 * @property {*[]} [values] - values for batch set
 * @property {boolean} [autoCreate=true] - auto create if Object on path not existed
 * @property {boolean} [autoReplace=true] - auto replace with new Object/Array(refer to original object type) if original object on path is not settable or not mustOwn
 * @property {boolean} [mustOwn=false] - only using the OwnProperty
 * @property {boolean} [digMap=true] - if dig Map just like a common Object
 * @property {boolean} [looseMapKey=false] - if set to true and Map element not found, it will try to convert the string key to number and as the key to get the element
 */
```
