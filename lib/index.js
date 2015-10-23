'use strict';

var assert = require('assert');

module.exports = function() {
  var eventLoop = {};

  var events = [];

  eventLoop.post = function(task) {
    events.push(task);
  };

  eventLoop.runNext = function() {
    assert(events.length > 0);
    events.shift()();
  };

  eventLoop.run = function() {
    while (events.length > 0) {
      eventLoop.runNext();
    }
  };

  return eventLoop;
};
