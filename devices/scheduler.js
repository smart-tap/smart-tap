var Device = require('zetta').Device;
var util = require('util');
var Stopwatch = require("statman-stopwatch");

var Scheduler = module.exports = function() {
	Device.call(this);

  this.startCycleHour = 6;
  this.startCycleMinute = 0;

  this.elapsedRunningTime = 0;
  this._runningStopwatch = new Stopwatch();

  this.elapsedStoppedTime = 0;
  this._stoppedStopwatch = new Stopwatch();

  var self = this;

  setInterval(function() {
    self.elapsedRunningTime = (self._runningStopwatch.read() || 0) / 3.6e+6
;
    self.elapsedStoppedTime = (self._stoppedStopwatch.read() || 0) / 3.6e+6
;
  },1000);

}

util.inherits(Scheduler, Device);

Scheduler.prototype.init = function(config) {

    // Set up the state machine 
  config
    .type('scheduler')
    .state('ready')
    .name("Scheduler");

  config
      // Define the transitions allowed by the state machine
    .when('ready', {allow: ['run', 'stop', 'updateStartCycleHour', 'updateStartCycleMinute']})
    .when('stopped', {allow: ['run']})
    .when('running', {allow: ['stop']})

    // Map the transitions to JavaScript methods
    .map('run', this.run)
    .map('stop', this.stop)
    .map('updateStartCycleHour', this.updateStartCycleHour, [{ type: 'number', name: 'Start Cycle Hour (ex. 6 for 6am)' }])
    .map('updateStartCycleMinute', this.updateStartCycleMinute, [{ type: 'number', name: 'Start Cycle Minute (ex. 30 for 6:30am)' }])

    .monitor('elapsedRunningTime')
    .monitor('elapsedStoppedTime');

}

Scheduler.prototype.run = function(cb) {
  this._runningStopwatch.start();
  this._stoppedStopwatch.reset();
  this.state = 'running';
	cb();
}

Scheduler.prototype.stop = function(cb) {
  this._runningStopwatch.reset();
  this._stoppedStopwatch.start();
	this.state = 'stopped';
	cb();
}

Scheduler.prototype.updateStartCycleHour = function(startCycleHour, cb) {
  this.startCycleHour = startCycleHour;
  cb();
}

Scheduler.prototype.updateStartCycleMinute = function(startCycleMinute, cb) {
  this.startCycleMinute = startCycleMinute;
  cb();
}
