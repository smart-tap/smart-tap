// https://www.adafruit.com/product/997

var Device = require('zetta').Device;
var util = require('util');
var Stopwatch = require("statman-stopwatch");

var Tap = module.exports = function() {
	Device.call(this);

  this._stagnatingStopwatch = new Stopwatch();
  this._operatingStopwatch = new Stopwatch();
  this._samplingStopwatch = new Stopwatch();

  // this._stagnatingStopwatch.start();

  var self = this;

  setInterval(function() {
    self.elapsedStagnatingTime = (self._stagnatingStopwatch.read() || 0) / 3.6e+6
;
    self.elapsedOperatingTime = (self._operatingStopwatch.read() || 0) / 3.6e+6
;
    self.elapsedSamplingTime = (self._samplingStopwatch.read() || 0) / 3.6e+6
;
  },1000);

}

util.inherits(Tap, Device);

Tap.prototype.init = function(config) {

    // Set up the state machine 
  config
    .type('tap')
    .state('stagnating')
    .name("Tap");

  config
    // Define the transitions allowed by the state machine
    .when('stagnating', {allow: ['operate', 'sample']})
    .when('sampling', {allow: ['operate']})
    .when('operating', {allow: ['stagnate']})

    // Map the transitions to JavaScript methods
    .map('stagnate', this.stagnate)
    .map('sample', this.sample)
    .map('operate', this.operate)

    // Monitor the elapsed times for each state
    .monitor('elapsedStagnatingTime')
    .monitor('elapsedSamplingTime')
    .monitor('elapsedOperatingTime');

}

Tap.prototype.stagnate = function(cb) {
  this._stagnatingStopwatch.reset();
  this._stagnatingStopwatch.start();
  this._samplingStopwatch.reset();
  this._operatingStopwatch.reset();
  this.state = 'stagnating';
  cb();
}

Tap.prototype.sample = function(cb) {
  this._stagnatingStopwatch.reset();
  this._samplingStopwatch.reset();
  this._samplingStopwatch.start();
  this._operatingStopwatch.reset();
  this.state = 'sampling';
  cb();
}

Tap.prototype.operate = function(cb) {
  this._stagnatingStopwatch.reset();
  this._samplingStopwatch.reset();
  this._operatingStopwatch.reset();
  this._operatingStopwatch.start();

  this.state = 'operating';
	cb();
}

