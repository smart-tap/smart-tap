module.exports = function(server) {
  var tapQuery = server.where({ type: 'tap' });
  var operatingLEDQuery = server.where({ type: 'led' });

  server.observe([tapQuery, operatingLEDQuery], function(tap, operatingLED){
    var tapState = tap.createReadStream('state');
    tapState.on('data', function(newState) {
      switch (newState.data) {
      case 'operating':
      	operatingLED.call('turn-on');
        break;
      default:
      	operatingLED.call('turn-off');
        break;
      }
    });
  });
}
