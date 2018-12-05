module.exports = function(server) {
  var tapQuery = server.where({ type: 'tap' });
  var stagnatingLEDQuery = server.where({ type: 'led', pin: 'USR1' });
  var samplingLEDQuery = server.where({ type: 'led', pin: 'USR2' });
  var operatingLEDQuery = server.where({ type: 'led', pin: 'USR3' });

  server.observe([tapQuery, stagnatingLEDQuery, samplingLEDQuery, operatingLEDQuery], function(tap, stagnatingLED, samplingLED, operatingLED){
    var tapState = tap.createReadStream('state');
    tapState.on('data', function(newState) {
      switch (newState.data) {
      case 'stagnating':
      	stagnatingLED.call('turn-on');

      	samplingLED.call('turn-off');
      	operatingLED.call('turn-off');
        break;
      case 'sampling':
      	samplingLED.call('turn-on');

      	stagnatingLED.call('turn-off');
      	operatingLED.call('turn-off');
        break;
      case 'operating':
      	operatingLED.call('turn-on');

      	samplingLED.call('turn-off');
      	stagnatingLED.call('turn-off');
        break;
      default:
      	stagnatingLED.call('turn-off');
      	samplingLED.call('turn-off');
      	operatingLED.call('turn-off');
        break;
      }
    });
  });
}
