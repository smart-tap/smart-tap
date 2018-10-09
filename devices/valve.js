// https://www.adafruit.com/product/997

var Device = require('zetta').Device;
var util = require('util');

var Valve = module.exports = function() {
	Device.call(this);
}

util.inherits(Valve, Device);

Valve.prototype.init = function(config) {

    // Set up the state machine 
  config
    .type('valve')
    .state('closed')
    .name("Valve");

  config
      // Define the transitions allowed by the state machine
    .when('closed', {allow: ['open']})
    .when('open', {allow: ['close']})

    // Map the transitions to JavaScript methods
    .map('open', this.openValve)
    .map('close', this.closeValve);
}

Valve.prototype.openValve = function(cb) {
	this.state = 'open';
	cb();
}

Valve.prototype.closeValve = function(cb) {
	this.state = 'closed';
	cb();
}