module.exports = function(server) {
  var tapQuery = server.where({ type: 'tap' });

  server.observe([tapQuery], function(tap) {
    var deviceCommand = process.argv[2];
    if (typeof deviceCommand !== 'undefined') {
      var [device, command] = deviceCommand.split('.');
      if (device === 'tap') {
	switch(command) {
	case 'operate':
	  tap.call('operate');
	  break;
	}
      }
    }
  });
}
