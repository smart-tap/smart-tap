module.exports = function(server) {
  var tapQuery = server.where({ type: 'tap' });
  var samplingLEDQuery = server.where({ type: 'rgb-led', name: 'Sampling LED' });

  server.observe([tapQuery, samplingLEDQuery], function(tap, samplingLED){
    var tapState = tap.createReadStream('state');
    var defaultColor = 'magenta';
    samplingLED.call('turn-on', defaultColor);
    tapState.on('data', function(newState) {
      switch (newState.data) {
      case 'stagnating':
	samplingLED.call('turn-on', 'white');
        break;
      case 'sampling':
	samplingLED.call('turn-on', 'green');
        break;
      case 'operating':
	samplingLED.call('turn-on', 'blue');
        break;
      case 'ready':
	samplingLED.call('turn-on', defaultColor);
        break;
      default:
	samplingLED.call('turn-off');
        break;
      }
    });
  });
}
