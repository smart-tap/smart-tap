module.exports = function(server) {
  var tapQuery = server.where({ type: 'tap' });
  var schedulerQuery = server.where({ type: 'scheduler' });

  server.observe([tapQuery, schedulerQuery], function(tap, scheduler){
    
    // setTimeout(function() {
    //   if (tap.available('operate')) {
    //     tap.call('operate');
    //   }
    // },5000);

  });
}