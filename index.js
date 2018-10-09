// http://www.bwmstraining.com/

var zetta = require('zetta');
var Valve = require('./devices/valve.js');
var Tap = require('./devices/tap.js');

zetta()
  .name('Sample Tap')
  .use(Valve)
  .use(Tap)
  .listen(1337, function(){
     console.log('Zetta is running at http://127.0.0.1:1337');
});