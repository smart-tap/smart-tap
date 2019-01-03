module.exports = function(server) {
  var tapQuery = server.where({ type: 'tap' });
  var valveQuery = server.where({ type: 'valve' });
  var openTimeout;
  var closedTimeout;

  server.observe([tapQuery, valveQuery], function(tap, valve){
    
    // setup tap
    var tapState = tap.createReadStream('state');
    tapState.on('data', function(newState) {
      // reset valve to close
      valve.call('close');
      switch (newState.data) {
      case 'operating':
	// kick off the operating mode
      	valve.call('open');
        break;
      default:
	clearTimeout(openTimeout);
	clearTimeout(closedTimeout);
        break;
      }
    });
    
    // setup valve
    var valveState = valve.createReadStream('state');
    valveState.on('data', function(newState) {
      if (tap.state === 'operating') {
	switch (newState.data) {
        case 'open':
      	  openTimeout = setTimeout(function(valve) {
      	    valve.call('close');
      	  }, valve.openPeriodMS(), valve);
          break;
        case 'closed':
	  closedTimeout = setTimeout(function(valve) {
      	    valve.call('open');
	  }, valve.closedPeriodMS(), valve);
	  break;
  	}
      }
    });
  });
}
