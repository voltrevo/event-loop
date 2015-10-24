'use strict';

module.exports = function(Class) {
  var ClassFromArgs = function(args) {
    Class.apply(this, args);
  };

  ClassFromArgs.prototype = Class.prototype;

  return function() {
    var context = new ClassFromArgs(arguments);
    var instance = {};

    /* eslint guard-for-in: 0 */
    for (var key in context) {
      var value = context[key];

      if (typeof value === 'function') {
        instance[key] = value.bind(context);
      } else {
        instance[key] = value;
      }
    }

    return instance;
  };
};
