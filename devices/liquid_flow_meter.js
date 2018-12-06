// https://www.adafruit.com/product/997

var Device = require('zetta').Device;
var util = require('util');
var Stopwatch = require("statman-stopwatch");
var bone = require('bonescript');

var LiquidFlowMeter = module.exports = function(pin) {
  Device.call(this);
  this.pin = pin;
  this.beagleboneInput = 0;
}

util.inherits(LiquidFlowMeter, Device);

LiquidFlowMeter.prototype.init = function(config) {

  // Set up the state machine 
  config
    .type('liquid-flow-meter')
    .state('ready')
    .name('LiquidFlowMeter')
    .monitor('beagleboneInput');

  //Everything is off to start
  bone.pinMode(this.pin, bone.INPUT);
  bone.attachInterrupt(this.pin, true, bone.RISING, measureFlow);

}

function measureFlow(beagleboneInput) {
  // this.beagleboneInput = beagleboneInput;
  // console.log(JSON.stringify(beagleboneInput));
  // console.log(JSON.stringify(this.beagleboneInput));
  // console.log("beagleboneInput: " + beagleboneInput);
  // console.log("this.beagleboneInput: " + this.beagleboneInput);
  console.log('flow pulse');
}
