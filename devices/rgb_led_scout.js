var Scout = require('zetta-scout');
var util = require('util');
var RGBLED = require('./rgb_led');

var RGBLEDScout = module.exports = function() {
  this.params = arguments[0];
  Scout.call(this);
}
util.inherits(RGBLEDScout, Scout);

RGBLEDScout.prototype.init = function(next) {
  var self = this;
  var queryParams = Object.assign({type: 'rgb-led'}, this.params);
  var query = self.server.where(queryParams);
  self.server.find(query, function(err, results) {
    if (results[0]) {
      self.provision(results[0], RGBLED, queryParams);
    } else {
      self.discover(RGBLED, queryParams);
    }
  });
  next();
};
