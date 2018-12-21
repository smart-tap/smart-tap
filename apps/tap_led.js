module.exports = function(server) {
  var tapQuery = server.where({ type: 'tap' });
  var redLEDQuery = server.where({ type: 'led', pin: 'P8_14' });
  var greenLEDQuery = server.where({ type: 'led', pin: 'P8_16' });
  var blueLEDQuery = server.where({ type: 'led', pin: 'P8_18' });

  server.observe([tapQuery, redLEDQuery, greenLEDQuery, blueLEDQuery], function(tap, redLED, greenLED, blueLED){
    var tapState = tap.createReadStream('state');
    tapState.on('data', function(newState) {
      switch (newState.data) {
      case 'stagnating':
	// Red Light
      	redLED.call('turn-off');
      	greenLED.call('turn-on');
      	blueLED.call('turn-on');
        break;
      case 'sampling':
	// Green Light  
      	redLED.call('turn-on');
      	greenLED.call('turn-off');
      	blueLED.call('turn-on');
        break;
      case 'operating':
	  // Red Light
      	redLED.call('turn-off');
      	greenLED.call('turn-on');
      	blueLED.call('turn-on');
        break;
      default:
	  // No Light
    	redLED.call('turn-on');
      	greenLED.call('turn-on');
      	blueLED.call('turn-on');
        break;
      }
    });
  });
}
