'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var EventLoop = require('../lib');

describe('EventLoop', function() {
  it('Can run a single task', function() {
    var el = EventLoop();

    var count = 0;

    el.post(function() {
      ++count;
    });

    el.run();

    assert(count === 1);
  });
});
