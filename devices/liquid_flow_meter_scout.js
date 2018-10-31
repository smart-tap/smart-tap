var Scout = require('zetta').Scout;
var util = require('util');
var LiquidFlowMeter = require('./liquid_flow_meter');

var LiquidFlowMeterScout = module.exports = function() {
  this.pin = arguments[0];
  Scout.call(this);
}
util.inherits(LiquidFlowMeterScout, Scout);

LiquidFlowMeterScout.prototype.init = function(next) {
  var self = this;

  var liquidFlowMeterQuery = self.server.where({type: 'liquid-flow-meter', pin: this.pin});
  self.server.find(liquidFlowMeterQuery, function(err, results) {
    if (results[0]) {
      self.provision(results[0], LiquidFlowMeter, self.pin);
    } else {
      self.discover(LiquidFlowMeter, self.pin);
    }
  });
  next();
};