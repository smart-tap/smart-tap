// https://www.adafruit.com/product/997

var Device = require('zetta').Device;
var util = require('util');
var Stopwatch = require("statman-stopwatch");
var pretty = require("format-duration");
var bone = require('bonescript');

const MS_PER_HOUR = 3.6e+6;
const MS_PER_MINUTE = 6.0e+4;
const S_PER_HOUR = 3.6e+3;

var Valve = module.exports = function(pin) {
  Device.call(this);
  this.pin = pin;

  this.openPeriod = 5 / S_PER_HOUR;     // hours
  this.closedPeriod = 10 / S_PER_HOUR;   // hours

  this.elapsedOpenTime = 0.0;   // hours
  this._openStopwatch = new Stopwatch();

  this.elapsedClosedTime = 0.0; // hours
  this._closedStopwatch = new Stopwatch();
  
  var self = this;

  setInterval(function() {
    self.elapsedOpenTime = pretty(self._openStopwatch.read() || 0);
    self.elapsedClosedTime = pretty(self._closedStopwatch.read() || 0);
  },1000);
}

util.inherits(Valve, Device);

Valve.prototype.init = function(config) {

    // Set up the state machine 
  config
    .type('valve')
    .state('ready')
    .name("Valve")
  
    // Define the transitions allowed by the state machine
    .when('ready', {allow: ['open', 'close', 'updateOpenPeriod', 'updateClosedPeriod']})
    .when('closed', {allow: ['open', 'stop']})
    .when('open', {allow: ['close', 'stop']})

    // Map the transitions to JavaScript methods
    .map('open', this.openValve)
    .map('close', this.closeValve)
    .map('stop', this.stop)
    .map('updateOpenPeriod', this.updateOpenPeriod, [{ type: 'number', name: 'Open Period (hours)' }])
    .map('updateClosedPeriod', this.updateClosedPeriod, [{ type: 'number', name: 'Closed Period (hours)' }])

    .monitor('elapsedOpenTime')
    .monitor('elapsedClosedTime');

  //Everything is off to start
  bone.pinMode(this.pin, bone.OUTPUT);
  this._closeValve();

}

Valve.prototype.openValve = function(cb) {
  this._openValve();
	this._openStopwatch.start();
	this._closedStopwatch.reset();
	this.state = 'open';
	cb();
}

Valve.prototype.closeValve = function(cb) {
  this._closeValve();
	this._openStopwatch.reset();
	this._closedStopwatch.start();
	this.state = 'closed';
	cb();
}

Valve.prototype.stop = function(cb) {
  this._closeValve();
  this._openStopwatch.reset();
  this._closedStopwatch.reset();
  this.state = 'ready';
  cb();
}

Valve.prototype.updateOpenPeriod = function(openPeriod, cb) {
  this.openPeriod = openPeriod;
  cb();
}

Valve.prototype.updateClosedPeriod = function(closedPeriod, cb) {
  this.closedPeriod = closedPeriod;
  cb();
}

Valve.prototype.openPeriodMS = function() {
  return this.openPeriod * MS_PER_HOUR;
}

Valve.prototype.closedPeriodMS = function() {
  return this.closedPeriod * MS_PER_HOUR;
}

Valve.prototype._openValve = function() {
  // close the valve
  bone.digitalWrite(this.pin, bone.HIGH);
}

Valve.prototype._closeValve = function() {
  // close the valve
  bone.digitalWrite(this.pin, bone.LOW);
}
