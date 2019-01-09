// https://www.adafruit.com/product/997

var Device = require('zetta').Device;
var util = require('util');
var Stopwatch = require("statman-stopwatch");
var bone = require('bonescript');

const SAMPLES_PER_SECOND = 10;
const MS_PER_S = 1000;
const S_PER_H = 3600;
const SAMPLE_INTERVAL = MS_PER_S / SAMPLES_PER_SECOND; // ms
const ML_PER_PULSE = 2.63;
const ML_PER_GALLON = 3785.41;
const GALLON_S_PER_PULSE_H = ML_PER_PULSE / ML_PER_GALLON * S_PER_H;

var LiquidFlowMeter = module.exports = function(pin) {
  Device.call(this);
  this.pin = pin;
  this.flow = 0.0; // gallons per hour
  this._pulses = 0;
  this.pulseCount = 0;
}

util.inherits(LiquidFlowMeter, Device);

LiquidFlowMeter.prototype.init = function(config) {

  // Set up the state machine 
  config
    .type('liquid-flow-meter')
    .state('ready')
    .name('LiquidFlowMeter')
    .when('ready', {allow: ['resetPulseCount']})
    .map('resetPulseCount', this.resetPulseCount)
    .monitor('pulseCount')
    .monitor('flow');

  bone.pinMode(this.pin, bone.INPUT);
  bone.attachInterrupt(this.pin, true, bone.RISING, this.pulseObserved.bind(this));

  setInterval(this.calculateFlow.bind(this), SAMPLE_INTERVAL);
}

LiquidFlowMeter.prototype.resetPulseCount = function(cb) {
  this.pulseCount = 0;
  cb();
}

LiquidFlowMeter.prototype.pulseObserved = function(pinInfo) {
  this._pulses++;
  this.pulseCount++;
}

LiquidFlowMeter.prototype.calculateFlow = function() {
  var pulsesPerSecond = this._pulses * SAMPLES_PER_SECOND;
  this.flow = pulsesPerSecond * GALLON_S_PER_PULSE_H; // gallons per hour
  this._pulses = 0;
}
