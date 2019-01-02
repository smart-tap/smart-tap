// https://www.adafruit.com/product/3423

var Device = require('zetta').Device;
var util = require('util');
var bone = require('bonescript');

var Button = module.exports = function(pin, name) {
  Device.call(this);
  this.pin = pin;
  this._name = name;

  var self = this;

  setInterval(function() {
    self._checkButtonState();
  }, 240);
}

util.inherits(Button, Device);

Button.prototype.init = function(config) {

    // Set up the state machine 
  config
    .type('button')
    .state('ready')
    .name(this._name)
  
    // Define the transitions allowed by the state machine
    .when('ready', {allow: ['release', 'press']})
    .when('pressed', {allow: ['release']})
    .when('released', {allow: ['press']})

    .map('press', this.pressButton)
    .map('release', this.releaseButton);

  // set pin to input mode
  bone.pinMode(this.pin, bone.INPUT);
}

Button.prototype.pressButton = function(cb) {
  this.state = 'pressed';
  cb();
}

Button.prototype.releaseButton = function(cb) {
  this.state = 'released';
  cb();
}

Button.prototype._checkButtonState = function() {
  var self = this;
  bone.digitalRead(this.pin, function(button) {
    if (button.value === 1) {
      self.available('press') && self.call('press');
    } else {
      self.available('release') && self.call('release');
    }
  });
}
