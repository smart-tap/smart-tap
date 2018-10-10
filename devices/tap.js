// https://www.adafruit.com/product/997

var Device = require('zetta').Device;
var util = require('util');
var Stopwatch = require("statman-stopwatch");

var Tap = module.exports = function() {
	Device.call(this);

  this.stagnatingPeriod = 6;            // hours
  this.samplingPeriod = 6;              // hours
  this.operatingPeriod = 12;            // hours

  this.elapsedStagnatingTime = 0;       // hours
  this.elapsedSamplingTime = 0;         // hours
  this.elapsedOperatingTime = 0;        // hours

  this._stagnatingStopwatch = new Stopwatch();
  this._samplingStopwatch = new Stopwatch();
  this._operatingStopwatch = new Stopwatch();

  var self = this;

  setInterval(function() {
    self.elapsedStagnatingTime = (self._stagnatingStopwatch.read() || 0) / 3.6e+6
;
    self.elapsedSamplingTime = (self._samplingStopwatch.read() || 0) / 3.6e+6
;
    self.elapsedOperatingTime = (self._operatingStopwatch.read() || 0) / 3.6e+6
;
  },1000);

}

util.inherits(Tap, Device);

Tap.prototype.init = function(config) {

    // Set up the state machine 
  config
    .type('tap')
    .state('ready')
    .name("Tap");

  config
    // Define the transitions allowed by the state machine
    .when('ready', {allow: ['stagnate', 'sample', 'operate', 'updateStagnatingPeriod', 'updateSamplingPeriod', 'updateOperatingPeriod' ]})
    .when('stagnating', {allow: ['sample', 'stop']})
    .when('sampling', {allow: ['operate', 'stop']})
    .when('operating', {allow: ['stagnate', 'stop']})

    // Map the transitions to JavaScript methods
    .map('stagnate', this.stagnate)
    .map('sample', this.sample)
    .map('operate', this.operate)
    .map('stop', this.stop)
    .map('updateStagnatingPeriod', this.updateStagnatingPeriod, [{ type: 'number', name: 'Stagnating Period (hrs)' }])
    .map('updateSamplingPeriod', this.updateSamplingPeriod, [{ type: 'number', name: 'Sampling Period (hrs)' }])
    .map('updateOperatingPeriod', this.updateOperatingPeriod, [{ type: 'number', name: 'Operating Period (hrs)' }])

    // Monitor the elapsed times for each state
    .monitor('elapsedStagnatingTime')
    .monitor('elapsedSamplingTime')
    .monitor('elapsedOperatingTime');

}

Tap.prototype.stagnate = function(cb) {
  this._stagnatingStopwatch.start();
  this._samplingStopwatch.reset();
  this._operatingStopwatch.reset();
  this.state = 'stagnating';
  cb();
}

Tap.prototype.sample = function(cb) {
  this._stagnatingStopwatch.reset();
  this._samplingStopwatch.start();
  this._operatingStopwatch.reset();
  this.state = 'sampling';
  cb();
}

Tap.prototype.operate = function(cb) {
  this._stagnatingStopwatch.reset();
  this._samplingStopwatch.reset();
  this._operatingStopwatch.start();

  this.state = 'operating';
	cb();
}

Tap.prototype.stop = function(cb) {
  this._stagnatingStopwatch.reset();
  this._samplingStopwatch.reset();
  this._operatingStopwatch.reset();
  this.state = 'ready';
  cb();
}

Tap.prototype.updateStagnatingPeriod = function(stagnatingPeriod, cb) {
  this.stagnatingPeriod = stagnatingPeriod;
  cb();
}

Tap.prototype.updateSamplingPeriod = function(samplingPeriod, cb) {
  this.samplingPeriod = samplingPeriod;
  cb();
}

Tap.prototype.updateOperatingPeriod = function(operatingPeriod, cb) {
  this.operatingPeriod = operatingPeriod;
  cb();
}
