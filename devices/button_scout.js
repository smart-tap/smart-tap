var Scout = require('zetta').Scout;
var util = require('util');
var Button = require('./button');

var ButtonScout = module.exports = function() {
  this.pin = arguments[0];
  this.name = arguments[1];
  Scout.call(this);
}
util.inherits(ButtonScout, Scout);

ButtonScout.prototype.init = function(next) {
  var self = this;

  var buttonQuery = self.server.where({type: 'button', pin: this.pin, name: this.name});
  self.server.find(buttonQuery, function(err, results) {
    if (results[0]) {
      self.provision(results[0], Button, self.pin, self.name);
    } else {
      self.discover(Button, self.pin, self.name);
    }
  });
  next();
};
