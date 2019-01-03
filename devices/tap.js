// https://www.adafruit.com/product/997

// start
// 6:00pm operating - flashing blue
// 12:00am stagnating - flashing yellow
// 6:00am sampling - flashing green (only time the sample button works)
// 12:00pm off - solid yellow
// restart

// override button works at any time
// moves tap state to off
// unlatched - solid red
// latched - flashing red

var Device = require('zetta').Device;
var util = require('util');
var Stopwatch = require("statman-stopwatch");
const MS_PER_HOUR = 3.6e+6;
const S_PER_HOUR = 3.6e+3;
const M_PER_HOUR = 60;

var operatingTimeout;
var stagnatingTimeout;
var samplingTimeout;

var Tap = module.exports = function(bootCommand) {
  Device.call(this);
  this.bootCommand = bootCommand;
  
  // for development purposes 
  this.stagnatingPeriod =  2 / M_PER_HOUR;    // hours
  this.samplingPeriod = 2 / M_PER_HOUR;      // hours
  this.operatingPeriod = 2 / M_PER_HOUR;    // hours

  this.elapsedStagnatingTime = 0;            // hours
  this.elapsedSamplingTime = 0;              // hours
  this.elapsedOperatingTime = 0;             // hours

  this._stagnatingStopwatch = new Stopwatch();
  this._samplingStopwatch = new Stopwatch();
  this._operatingStopwatch = new Stopwatch();

  var self = this;

  setInterval(function() {
    self.elapsedStagnatingTime = (self._stagnatingStopwatch.read() || 0) / MS_PER_HOUR
;
    self.elapsedSamplingTime = (self._samplingStopwatch.read() || 0) / MS_PER_HOUR
;
    self.elapsedOperatingTime = (self._operatingStopwatch.read() || 0) / MS_PER_HOUR
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
  clearTimeout(operatingTimeout);

  stagnatingTimeout = setTimeout(function(self) {
    self.call('sample');
  }, this.stagnatingPeriodMS(), this);

  this._stagnatingStopwatch.start();
  this._samplingStopwatch.reset();
  this._operatingStopwatch.reset();
  this.state = 'stagnating';
  cb();
}

Tap.prototype.sample = function(cb) {
  clearTimeout(stagnatingTimeout);

  samplingTimeout = setTimeout(function(self) {
    self.call('operate');
  }, this.samplingPeriodMS(), this);

  this._stagnatingStopwatch.reset();
  this._samplingStopwatch.start();
  this._operatingStopwatch.reset();
  this.state = 'sampling';
  cb();
}

Tap.prototype.operate = function(cb) {
  clearTimeout(samplingTimeout);

  operatingTimeout = setTimeout(function(self) {
    self.call('stagnate');
  }, this.operatingPeriodMS(), this);

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

  clearTimeout(operatingTimeout);
  clearTimeout(stagnatingTimeout);
  clearTimeout(samplingTimeout);

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

Tap.prototype.operatingPeriodMS = function() {
  return this.operatingPeriod*MS_PER_HOUR;
}

Tap.prototype.stagnatingPeriodMS = function() {
  return this.stagnatingPeriod*MS_PER_HOUR;
}

Tap.prototype.samplingPeriodMS = function() {
  return this.samplingPeriod*MS_PER_HOUR;
}
