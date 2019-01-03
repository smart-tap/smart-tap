module.exports = function(server) {
  var tapQuery = server.where({ type: 'tap' });
  var samplingLEDQuery = server.where({ type: 'rgb-led', name: 'Sampling LED' });

  server.observe([tapQuery, samplingLEDQuery], function(tap, samplingLED){
    var tapState = tap.createReadStream('state');
    samplingLED.call('turn-on', 'yellow');
    tapState.on('data', function(newState) {
      switch (newState.data) {
      case 'stagnating':
	// flashing yellow
	samplingLED.call('turn-on-alternating', 'yellow');
        break;
      case 'sampling':
	// flashing green
	samplingLED.call('turn-on-alternating', 'green');
        break;
      case 'operating':
	// flashing blue
	samplingLED.call('turn-on-alternating', 'blue');
        break;
      case 'ready':
	// solid yellow
	samplingLED.call('turn-on', 'yellow');
        break;
      default:
	// no lights
	samplingLED.call('turn-off');
        break;
      }
    });
  });
}
