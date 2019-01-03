module.exports = function(server) {
  var tapQuery = server.where({ type: 'tap' });
  var valveQuery = server.where({ type: 'valve' });
  var samplingButtonQuery = server.where({ type: 'button', name: 'Sampling Button' });

  server.observe([tapQuery, valveQuery, samplingButtonQuery], function(tap, valve, samplingButton){
    
    // setup tap
    var samplingButtonState = samplingButton.createReadStream('state');
    samplingButtonState.on('data', function(newState) {
      if (tap.state === 'sampling') {
	switch (newState.data) {
	case 'pressed':
      	  valve.call('open');
          break;
	case 'released':
      	  valve.call('close');
          break;
	default:
          break;
	}
      }
    });
  });
}
