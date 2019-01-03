module.exports = function(server) {
  var tapQuery = server.where({ type: 'tap' });
  var valveQuery = server.where({ type: 'valve' });
  var overrideButtonQuery = server.where({ type: 'button', name: 'Override Button' });
  
  server.observe([tapQuery, valveQuery, overrideButtonQuery], function(tap, valve, overrideButton){
    var overrideButtonState = overrideButton.createReadStream('state');
    overrideButtonState.on('data', function(newState) {
      switch (newState.data) {
      case 'pressed':
	tap.call('stop');
      	valve.call('open');
        break;
      case 'released':
	tap.call('stagnate');
      	valve.call('close');
        break;
      default:
        break;
      }
    });
  });
}
			  
