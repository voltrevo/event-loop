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

  it('runNext runs the next task', function() {
    var el = EventLoop();

    var tasksCompleted = [];

    var Task = function(str) {
      return tasksCompleted.push.bind(tasksCompleted, str);
    };

    el.post(Task('a'));
    el.post(Task('b'));
    el.post(Task('c'));

    assert.deepEqual(tasksCompleted, []);
    el.runNext();
    assert.deepEqual(tasksCompleted, ['a']);
    el.runNext();
    assert.deepEqual(tasksCompleted, ['a', 'b']);
    el.runNext();
    assert.deepEqual(tasksCompleted, ['a', 'b', 'c']);
  });
});
