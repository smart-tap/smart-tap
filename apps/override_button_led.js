module.exports = function(server) {
  
  var overrideLEDQuery = server.where({ type: 'rgb-led', name: 'Override LED' });
  var overrideButtonQuery = server.where({ type: 'button', name: 'Override Button' });

  server.observe([overrideLEDQuery, overrideButtonQuery], function(overrideLED, overrideButton) {
    overrideLED.call('turn-on', 'red');
    var overrideButtonState = overrideButton.createReadStream('state');
    overrideButtonState.on('data', function(newState) {
      switch (newState.data) {
      case 'pressed':
	// flashing red
	overrideLED.call('turn-on-alternating', 'red');
        break;
      case 'released':
	// solid red
	overrideLED.call('turn-on', 'red');
        break;
      default:
	// no lights
	overrideLED.call('turn-off');
        break;
      }
    });
  });
}
