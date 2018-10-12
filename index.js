// http://www.bwmstraining.com/

var zetta = require('zetta');
var Valve = require('./devices/valve');
var Tap = require('./devices/tap');
var LED = require('zetta-led-bonescript-driver'); 

var tapValve = require('./apps/tap_valve');

var LINK_URL = 'http://api.bwmstraining.com';

zetta()
  .name('Sample Tap')
  .use(Valve)
  .use(Tap)
  .use(LED, 'USR0', 'USR1', 'USR2', 'USR3')
  .use(tapValve)
  .link(LINK_URL)
  .listen(1337, function(){
     console.log('Zetta is running at http://127.0.0.1:1337');
});
