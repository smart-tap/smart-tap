module.exports = function(server) {
  var tapQuery = server.where({ type: 'tap' });
  var samplingLEDQuery = server.where({ type: 'rgb-led', name: 'Sampling LED' });

  server.observe([tapQuery, samplingLEDQuery], function(tap, samplingLED){
    var tapState = tap.createReadStream('state');
    samplingLED.call('turn-on', 'yellow');
    tapState.on('data', function(newState) {
      switch (newState.data) {
      case 'stagnating':
	// solid yellow
	samplingLED.call('turn-on', 'yellow');
        break;
      case 'sampling':
	// solid green
	samplingLED.call('turn-on', 'green');
        break;
      case 'operating':
	// solid white
	samplingLED.call('turn-on', 'white');
        break;
      case 'ready':
	// magenta
	samplingLED.call('turn-on', 'magenta');
        break;
      default:
	// no lights
	samplingLED.call('turn-off');
        break;
      }
    });
  });
}
