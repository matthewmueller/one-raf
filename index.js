/**
 * Module dependencies
 */

var raf = require('raf');

/**
 * Export `Ticker`
 */

module.exports = Ticker;

/**
 * Initialize `Ticker`
 */

function Ticker() {
  if (!(this instanceof Ticker)) return new Ticker();
  this.ontick = this.tick.bind(this);
  this.running = false;
  this.calls = [];
}

/**
 * push
 */

Ticker.prototype.push = function(fn) {
  this.calls.push({
    start: (new Date).getTime(),
    fn: fn
  });

  // start ticking
  if(!this.running) this.tick();
};

/**
 * Tick
 */

Ticker.prototype.tick = function() {
  var running = this.running;
  var calls = this.calls;
  var len = calls.length;
  var called = false;
  var time = (new Date).getTime();
  var elapsed;
  var res;

  for (var i = 0; i < len; i++) {
    call = calls[i];
    if (!call.fn) continue;
    elapsed = time - call.start;
    // https://github.com/julianshapiro/velocity/blob/master/jquery.velocity.js#L2392-L2393
    elapsed += running ? 0 : 16
    res = call.fn(elapsed);
    if (false === res) call.fn = false;
    called = true;
  }

  // compact when calls gets large
  if (len > 100) this.calls = compact(calls);

  if (called) {
    this.running = true;
    raf(this.ontick);
  } else {
    this.running = false;
  }
};

/**
 * Compact the array
 */

function compact (array) {
  var length = array ? array.length : 0;
  var result = [];
  var index = -1;
  var value;

  while (++index < length) {
    value = array[index];
    if (value) result.push(value);
  }

  return result;
}
