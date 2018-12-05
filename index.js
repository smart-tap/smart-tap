// http://www.bwmstraining.com/

var zetta = require('zetta');
var ValveScout = require('./devices/valve_scout');
var LiquidFlowMeterScout = require('./devices/liquid_flow_meter_scout');
var Tap = require('./devices/tap');
var LED = require('zetta-led-bonescript-driver');

var tapValve = require('./apps/tap_valve');
var tapLED = require('./apps/tap_led');
var tapCommandLine = require('./apps/tap_command_line');

var LINK_URL = 'http://api.bwmstraining.com';

zetta()
  .name('Sample Tap')
  .use(ValveScout, "P8_10")
  .use(LiquidFlowMeterScout, "P8_19")
  .use(LED, "P8_14", "P8_16", "P8_18")
  .use(tapCommandLine)
  .use(Tap)
  .use(tapValve)
  .use(tapLED)
  .link(LINK_URL)
  .listen(1337, function(){
     console.log('Zetta is running at http://127.0.0.1:1337');
});
