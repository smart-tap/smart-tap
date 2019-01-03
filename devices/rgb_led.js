var Device = require('zetta-device');
var util = require('util');
var bone = require('bonescript');

var RGBLED = module.exports = function(params) {
  Device.call(this);
  Object.assign(this, params);
};
util.inherits(RGBLED, Device);

const RGB_COLOR_CONFIGS = {
  red:     {r: 0, g: 1, b: 1},
  green:   {r: 1, g: 0, b: 1},
  blue:    {r: 1, g: 1, b: 0},
  yellow:  {r: 0, g: 0, b: 1},
  magenta: {r: 0, g: 1, b: 0},
  cyan:    {r: 1, g: 0, b: 0},
  white:   {r: 0, g: 0, b: 0},  
};

const RGB_COLOR_RADIO_VALUES = Object.keys(RGB_COLOR_CONFIGS).map(colorLabel => {return {value: colorLabel}});

RGBLED.prototype.init = function(config) {
  config
    .type(this.type)
    .name(this.name)
    .state('off')
    .when('off', { allow: ['turn-on', 'turn-on-pulse', 'turn-on-alternating', 'flash']})
    .when('on', { allow: ['turn-off', 'turn-on', 'turn-on-pulse', 'turn-on-alternating', 'flash'] })
    .when('pulse', { allow: ['turn-off', 'turn-on', 'turn-on-pulse', 'turn-on-alternating', 'flash'] })
    .when('alternating', { allow: ['turn-off', 'turn-on', 'turn-on-pulse', 'turn-on-alternating', 'flash'] })
    .when('flash', { allow: [] })
    .map('flash', this.flash, [{type: 'radio', name: 'color',
				   value: RGB_COLOR_RADIO_VALUES}])
    .map('turn-on', this.turnOn, [{type: 'radio', name: 'color',
				   value: RGB_COLOR_RADIO_VALUES}])
    .map('turn-on-pulse', this.turnOnPulse, [{type: 'radio', name: 'color',
				   value: RGB_COLOR_RADIO_VALUES}])
    .map('turn-on-alternating', this.turnOnAlternating, [{type: 'radio', name: 'color',
				   value: RGB_COLOR_RADIO_VALUES}])
    .map('turn-off', this.turnOff);

  //Everything is set to output
  bone.pinMode(this.redPin, bone.OUTPUT);
  bone.pinMode(this.greenPin, bone.OUTPUT);
  bone.pinMode(this.bluePin, bone.OUTPUT);
  // force the LED off
  this._stopEmittingLight();
};

RGBLED.prototype.turnOn = function(color, cb) {
  var state = 'on';
  var onDuration = Infinity;
  var offDuration = 0;
  this._pattern(color, onDuration, offDuration, state, cb);
};

RGBLED.prototype.turnOnPulse = function(color, cb) {
  var state = 'pulse';
  var onDuration = 150;
  var offDuration = 100;
  this._pattern(color, onDuration, offDuration, state, cb);
};

RGBLED.prototype.turnOnAlternating = function(color, cb) {
  var state = 'alternating';
  var onDuration = 100;
  var offDuration = 400;
  this._pattern(color, onDuration, offDuration, state, cb);
};

RGBLED.prototype.flash = function(color, cb) {
  this.state = 'flash';
  var self = this;
  this.turnOff(function() {
    self._emitLight(color, 100);
  });
  cb();
};

RGBLED.prototype.turnOff = function(cb) {
  if (this._timer != undefined) {
    clearInterval(this._timer);
  }
  this._stopEmittingLight();
  this.state = 'off';
  cb();
};

RGBLED.prototype._pattern = function(color, onDuration, offDuration, state, cb) {
  var self = this;
  this.turnOff(function(){
    if (onDuration === Infinity || offDuration === 0) {
      self._emitColoredLight(color);
    } else {
      self._timer = setInterval(self._emitLight.bind(self, color, onDuration), onDuration + offDuration);
    }
    self.state = state;
    cb();
  });
};

RGBLED.prototype._stopEmittingLight = function() {
  bone.digitalWrite(this.redPin, 1);
  bone.digitalWrite(this.greenPin, 1);
  bone.digitalWrite(this.bluePin, 1);
}

RGBLED.prototype._emitLight = function(color, delay) {
  var self = this;

  this._emitColoredLight(color);
  setTimeout(function() {
    self._stopEmittingLight();
  }, delay);
};

RGBLED.prototype._emitColoredLight = function(color, cb) {
  var rgbConfig = RGB_COLOR_CONFIGS.hasOwnProperty(color) ? RGB_COLOR_CONFIGS[color] : RGB_COLOR_CONFIGS['white'];
  bone.digitalWrite(this.redPin, rgbConfig.r);
  bone.digitalWrite(this.greenPin, rgbConfig.g);
  bone.digitalWrite(this.bluePin, rgbConfig.b);
}  
