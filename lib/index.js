'use strict';

// core modules
var assert = require('assert');

// local modules
var dethisify = require('./dethisify.js');

// community modules
var PriorityQueue = dethisify(require('priorityqueuejs'));

module.exports = function() {
  var eventLoop = {};

  var eventBuckets = {};

  var eventBucketQueue = PriorityQueue(function(lBucket, rBucket) {
    return rBucket.time - lBucket.time;
  });

  var time = 0;

  var getEventBucket = function(t) {
    assert(t >= time);

    var bucket = eventBuckets[t];

    if (!bucket) {
      bucket = { time: t, tasks: [] };
      eventBuckets[t] = bucket;
      eventBucketQueue.enq(bucket);
    }

    return bucket;
  };

  eventLoop.post = function(task, delayParam) {
    var delay = delayParam || 0;
    assert(delay >= 0);
    var taskTime = time + delay;

    getEventBucket(taskTime).tasks.push(task);
  };

  eventLoop.empty = eventBucketQueue.isEmpty;

  eventLoop.runNext = function() {
    var bucket = eventBucketQueue.peek();
    assert(bucket.tasks.length > 0);
    assert(bucket.time >= time);

    time = bucket.time;

    bucket.tasks.shift()();

    if (bucket.tasks.length === 0) {
      var removedBucket = eventBucketQueue.deq();
      assert(removedBucket === bucket);
      delete eventBuckets[bucket.time];
    }
  };

  eventLoop.run = function() {
    while (!eventLoop.empty()) {
      eventLoop.runNext();
    }
  };

  return eventLoop;
};
