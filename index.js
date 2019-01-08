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
var ButtonScout = require('./devices/button_scout');
var RGBLEDScout = require('./devices/rgb_led_scout');

// apps
var tapValveApp = require('./apps/tap_valve');
var tapSamplingLEDApp = require('./apps/tap_sampling_led');
var tapValveSamplingButtonApp = require('./apps/tap_valve_sampling_button');
var tapValveOverrideButtonApp = require('./apps/tap_valve_override_button');
var overrideLEDApp = require('./apps/override_led');

var LINK_URL = 'http://api.bwmstraining.com';

var serverName = 'Smart Tap';

if (argv.name) {
  serverName = argv.name;
}

var z = zetta()
  .name(serverName)
  .use(ValveScout, "P9_30")
  .use(LiquidFlowMeterScout, "P8_26")
  .use(RGBLEDScout, {bluePin: "P9_23", greenPin: "P9_25", redPin: "P9_27", name: "Sampling LED"})
  .use(ButtonScout, "P9_15", "Sampling Button")
  .use(RGBLEDScout, {bluePin: "P8_7", greenPin: "P8_9", redPin: "P8_11", name: "Override LED"})
  .use(ButtonScout, "P8_15", "Override Button")
  .use(TapScout, argv.tap)
  .use(tapValveApp)
  .use(tapSamplingLEDApp)
  .use(tapValveSamplingButtonApp)
  .use(overrideLEDApp)
  .use(tapValveOverrideButtonApp)
  .link(LINK_URL)
  .listen(1337, function(){});

GetMac.getMac(function(err, macAddress){
  if (err)  throw err
  z.name(z._name + ' ' + macAddress);
})
