module.exports = function(server) {
  var tapQuery = server.where({ type: 'tap' });
  var schedulerQuery = server.where({ type: 'scheduler' });
  var operatingTimeout;
  var stagnatingTimeout;
  var samplingTimeout;

  server.observe([tapQuery, schedulerQuery], function(tap, scheduler){
    
	// setup scheduler
	var schedulerState = scheduler.createReadStream('state');
    schedulerState.on('data', function(newState) {
      switch (newState.data) {
      case 'running':
        tap.call('operate');
        break;
      case 'ready':
        tap.call('stop');
        break;
      }
  	});

    // setup tap
	var tapState = tap.createReadStream('state');
    tapState.on('data', function(newState) {
      if (scheduler.state === 'running') {
	      switch (newState.data) {
	      case 'operating':
		    operatingTimeout = setTimeout(function(tap) {
	   		  tap.call('stagnate');
	        }, tap.operatingPeriodMS(), tap)
	        break;
	      case 'stagnating':
		    stagnatingTimeout = setTimeout(function(tap) {
	 		  tap.call('sample');
	        }, tap.stagnatingPeriodMS(), tap)
	        break;
	      case 'sampling':
		    samplingTimeout = setTimeout(function(tap) {
	 		  tap.call('stop');
	        }, tap.samplingPeriodMS(), tap)
	        break;
	      case 'ready':
	         clearTimeout(operatingTimeout);
	         clearTimeout(stagnatingTimeout);
	         clearTimeout(samplingTimeout);
	        break;
	      }
  	  }
  	});
  });
}
