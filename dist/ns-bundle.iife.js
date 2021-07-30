var ns = (function () {
  'use strict';

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

  /**
   * @type {options}
   */
  var optionsDefault = {
    detailedResult: false,
    set: false,
    path: undefined,
    paths: null,
    //value: '',
    //values: '',
    autoCreate: true,
    autoReplace: true,
    mustOwn: false,
    digMap: true,
    looseMapKey: false
  };

  /**
   * Get/set value to nested object
   * @param {Object} target
   * @param {string|[string]|{options}} path
   * @param {*} [value]
   */
  function ns(target, path, value) {
    if (!path || typeof target !== 'object') { return }
    var options = Object.assign({success: false}, optionsDefault);
    if (typeof path === 'string' || Array.isArray(path)) { options.path = path; } else { Object.assign(options, path); }
    if (typeof options.path === 'string') { options.path = options.path.split('.'); }
    if (arguments.length > 2) { options.set = true; }
    // single operation
    if (options.path) { return options.set ? set.apply(void 0, [ target, options, value ].concat( options.path )) : get.apply(void 0, [ target, options ].concat( options.path )) }
    // batch operation
    if (Array.isArray(options.paths) && options.paths.length) {
      options.set = options.hasOwnProperty('values');
      options.values = options.values || [];
      return options.paths.map(function (path, index) {
        if (typeof path === 'string') { path = path.split('.'); }
        return options.set ? set.apply(void 0, [ target, options, options.values[index] ].concat( path )) : get.apply(void 0, [ target, options ].concat( path ))
      })
    }
  }

  function get(target, options) {
    var paths = [], len = arguments.length - 2;
    while ( len-- > 0 ) paths[ len ] = arguments[ len + 2 ];

    var isLast = paths.length === 1, prop = paths.shift();

    if (isLast) {
      var value, success;
      if (isMap(target)) {
        if ((success = target.has(prop))) { value = target.get(prop); }
      } else {
        if ((success = options.mustOwn ? target.hasOwnProperty(prop) : prop in target)) { value = target[prop]; }
      }
      return options.detailedResult ? {
        value: value,
        success: success,
        parent: target
      } : value
    }

    var next = dig(target, prop, options);
    if (typeof next !== 'object') { return options.detailedResult ? {success: false} : undefined }
    return get.apply(void 0, [ next, options ].concat( paths ))
  }

  function set(target, options, value) {
    var paths = [], len = arguments.length - 3;
    while ( len-- > 0 ) paths[ len ] = arguments[ len + 3 ];

    var isLast = paths.length === 1, prop = paths.shift(), next = isLast ? target : dig(target, prop, options);
    if (isLast) {
      if (!next || typeof next !== 'object') { return options.detailedResult ? {success: false} : false }

      var oldValue, lastProp = isLast ? prop : paths[0];
      if (isMap(next)) {
        oldValue = next.get(lastProp);
        next.set(lastProp, value);
      } else {
        oldValue = next[lastProp];
        next[lastProp] = value;
      }
      return options.detailedResult ? {success: true, parent: next, value: value, oldValue: oldValue} : true
    }
    return set.apply(void 0, [ next, options, value ].concat( paths ))
  }

  function dig(target, prop, options) {
    var next = target[prop], exist = false;
    if (options.digMap && isMap(target)) {
      next = undefined;
      if (target.has(prop)) {
        next = target.get(prop);
        exist = true;
      } else if (options.looseMapKey) {
        var iProp = prop * 1;
        if (iProp === iProp && target.has(iProp)) {
          next = target.get(iProp);
        }
        exist = true;
      }

      if (!next || typeof next !== 'object') {
        if ((exist && options.autoReplace) || (!exist && options.autoCreate)) {
          next = {};
          target.set(prop, next);
        }
      }
    } else {
      var originalNext = next;
      if (options.mustOwn ? target.hasOwnProperty(prop) : prop in target) { exist = true; } else { next = undefined; }

      if (!next || typeof next !== 'object') {
        if ((exist && options.autoReplace) || (!exist && options.autoCreate)) {
          next = Array.isArray(originalNext) ? [] : {};
          target[prop] = next;
        }
      }
    }
    return next
  }

  function isMap(target) {
    return Object.prototype.toString.call(target) === '[object Map]'
  }

  return ns;

}());
//# sourceMappingURL=ns-bundle.iife.js.map
