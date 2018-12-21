// http://www.bwmstraining.com/

var zetta = require('zetta');

// for parsing command line custom options
const argv = require('yargs').argv;
// for assigning unique server name
var GetMac = require('getmac');	

// devices
var ValveScout = require('./devices/valve_scout');
var LiquidFlowMeterScout = require('./devices/liquid_flow_meter_scout');
var TapScout = require('./devices/tap_scout');
var LED = require('zetta-led-bonescript-driver');

// apps
var tapValve = require('./apps/tap_valve');
var tapLED = require('./apps/tap_led');

var LINK_URL = 'http://api.bwmstraining.com';

var serverName = 'Smart Tap';

if (argv.name) {
  serverName = argv.name;
}

var z = zetta()
  .name(serverName)
  .use(ValveScout, "P9_18")
  .use(LiquidFlowMeterScout, "P8_26")
  .use(LED, "P8_7", "P8_8", "P8_9")
  .use(TapScout, argv.tap)
  .use(tapValve)
  .use(tapLED)
  .link(LINK_URL)
  .listen(1337, function(){});

GetMac.getMac(function(err, macAddress){
  if (err)  throw err
  z.name(z._name + ' ' + macAddress);
})
