'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var EventLoop = require('../lib');

var Tasks = function() {
  var tasks = {};

  tasks.completed = [];

  tasks.create = function(id) {
    return tasks.completed.push.bind(tasks.completed, id);
  };

  return tasks;
};

var Fixture = function() {
  var x = {};

  x.eventLoop = EventLoop();
  x.tasks = Tasks();

  return x;
};

describe('EventLoop', function() {
  it('Can run a single task', function() {
    var x = Fixture();

    x.eventLoop.post(x.tasks.create('foo'));
    x.eventLoop.run();

    assert.deepEqual(x.tasks.completed, ['foo']);
  });

  it('runNext runs the next task', function() {
    var x = Fixture();

    x.eventLoop.post(x.tasks.create('a'));
    x.eventLoop.post(x.tasks.create('b'));
    x.eventLoop.post(x.tasks.create('c'));

    assert.deepEqual(x.tasks.completed, []);
    x.eventLoop.runNext();
    assert.deepEqual(x.tasks.completed, ['a']);
    x.eventLoop.runNext();
    assert.deepEqual(x.tasks.completed, ['a', 'b']);
    x.eventLoop.runNext();
    assert.deepEqual(x.tasks.completed, ['a', 'b', 'c']);
  });

  it('runs all tasks and tasks within tasks in the correct order', function() {
    var x = Fixture();

    x.eventLoop.post(x.tasks.create('a'));

    x.eventLoop.post(function() {
      x.eventLoop.post(x.tasks.create('b'));
    });

    x.eventLoop.post(x.tasks.create('c'));

    x.eventLoop.post(function() {
      x.eventLoop.post(x.tasks.create('d'));
    });

    assert.deepEqual(x.tasks.completed, []);
    x.eventLoop.run();
    assert.deepEqual(x.tasks.completed, ['a', 'c', 'b', 'd']);
  });

  it('runs tasks according to time', function() {
    var x = Fixture();

    x.eventLoop.post(x.tasks.create('a'), 2);
    x.eventLoop.post(x.tasks.create('b'), 1);
    x.eventLoop.post(x.tasks.create('c'), 0);

    x.eventLoop.run();

    assert.deepEqual(x.tasks.completed, ['c', 'b', 'a']);
  });
});
