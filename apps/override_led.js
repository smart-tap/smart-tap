module.exports = function(server) {
  
  var overrideLEDQuery = server.where({ type: 'rgb-led', name: 'Override LED' });

  server.observe([overrideLEDQuery], function(overrideLED) {
    overrideLED.call('turn-on', 'red');
  });
}
