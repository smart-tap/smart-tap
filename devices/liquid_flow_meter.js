// https://www.adafruit.com/product/997

var Device = require('zetta').Device;
var util = require('util');
var Stopwatch = require("statman-stopwatch");
var bone = require('bonescript');

const SAMPLES_PER_SECOND = 10;
const MS_PER_S = 1000;
const S_PER_HOUR = 3600;
const SAMPLE_INTERVAL = MS_PER_S / SAMPLES_PER_SECOND; // ms
const ML_PER_PULSE = 2.25;
const ML_PER_GALLON = 3785.41;
const GALLON_S_PER_PULSE_HOUR = ML_PER_PULSE / ML_PER_GALLON * S_PER_HOUR;

var LiquidFlowMeter = module.exports = function(pin) {
  Device.call(this);
  this.pin = pin;
  this.flow = 0.0; // gallons per hour
  this._pulses = 0;
}

util.inherits(LiquidFlowMeter, Device);

LiquidFlowMeter.prototype.init = function(config) {

  // Set up the state machine 
  config
    .type('liquid-flow-meter')
    .state('ready')
    .name('LiquidFlowMeter')
    .monitor('flow');

  bone.pinMode(this.pin, bone.INPUT);
  bone.attachInterrupt(this.pin, true, bone.RISING, pulseObserved);

  setTimeout(calculateFlow, SAMPLE_INTERVAL);
}

LiquidFlowMeter.prototype.pulseObserved = function(pinInfo) {
  console.log('flow pulse');
  this._pulses++;
  console.log('pulses: ' + this._pulses);
}

LiquidFlowMeter.prototype.calculateFlow = function() {
  var pulsesPerSecond = this._pulses * SAMPLES_PER_SECOND;
  this.flow = pulsesPerSecond * GALLON_S_PER_PULSE_HOUR;
  this._pulses = 0;
  setTime(calculateFlow, SAMPLE_INTERVAL);
}
