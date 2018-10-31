// http://www.bwmstraining.com/

var zetta = require('zetta');
var ValveScout = require('./devices/valve_scout');
var LiquidFlowMeterScout = require('./devices/liquid_flow_meter_scout');
var Tap = require('./devices/tap');

var tapValve = require('./apps/tap_valve');

var LINK_URL = 'http://api.bwmstraining.com';

zetta()
  .name('Sample Tap')
  .use(ValveScout, "P8_10")
  .use(LiquidFlowMeterScout, "P8_19")
  .use(Tap)
  .use(tapValve)
  .link(LINK_URL)
  .listen(1337, function(){
     console.log('Zetta is running at http://127.0.0.1:1337');
});
