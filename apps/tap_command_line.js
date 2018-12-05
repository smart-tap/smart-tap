module.exports = function(server, tapCommand) {
  var tapQuery = server.where({ type: 'tap' });

  server.observe([tapQuery], function(tap) {
    switch(tapCommand) {
    case 'operate':
      tap.call('operate');
      break;
    }
  });
}
