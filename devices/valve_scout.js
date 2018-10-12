var Scout = require('zetta').Scout;
var util = require('util');
var Valve = require('./valve');

var ValveScout = module.exports = function() {
  this.pin = arguments[0];
  Scout.call(this);
}
util.inherits(ValveScout, Scout);

ValveScout.prototype.init = function(next) {
  var self = this;

  var valveQuery = self.server.where({type: 'valve', pin: this.pin});
  self.server.find(valveQuery, function(err, results) {
    if (results[0]) {
      self.provision(results[0], Valve, self.pin);
    } else {
      self.discover(Valve, self.pin);
    }
  });
  next();
};