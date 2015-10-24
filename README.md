# voltrevo-event-loop [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> An event loop abstraction.


## Install

```sh
$ npm install --save voltrevo-event-loop
```


## Usage

At the moment, this package basically implements `setTimeout` without using the global event loop. Control is given to you in the form of `.run()` and `.runNext()`.

```js
var EventLoop = require('voltrevo-event-loop');

var el = EventLoop();

el.post(function() {
  console.log('a');
}, 100);

el.post(function() {
  console.log('b');
});

el.post(function() {
  console.log('c');
});

// No output yet

el.runNext(); // b
el.runNext(); // c
el.runNext(); // a

// Or use el.run() to keep running until no events are left.
```

`.run()` will run all tasks that it can possibly see, which includes tasks that get added during `.run()`. It doesn't just run the tasks that have been posted before the call.

```js
el.post(function() {
  el.post(function() {
    console.log('a');
  });
});

el.post(function() {
  console.log('b');
});

el.post(function() {
  console.log('c');
});

// No output yet

el.run(); // b, c, a
```

## License

MIT © [Andrew Morris](https://andrewmorris.io/)


[npm-image]: https://badge.fury.io/js/voltrevo-event-loop.svg
[npm-url]: https://npmjs.org/package/voltrevo-event-loop
[travis-image]: https://travis-ci.org/voltrevo/event-loop.svg?branch=master
[travis-url]: https://travis-ci.org/voltrevo/event-loop
[daviddm-image]: https://david-dm.org/voltrevo/event-loop.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/voltrevo/event-loop
[coveralls-image]: https://coveralls.io/repos/voltrevo/event-loop/badge.svg
[coveralls-url]: https://coveralls.io/r/voltrevo/event-loop
