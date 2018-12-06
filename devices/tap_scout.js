var Scout = require('zetta').Scout;
var util = require('util');
var Tap = require('./tap');

var TapScout = module.exports = function() {
  this.bootCommand = arguments[0];
  Scout.call(this);
}
util.inherits(TapScout, Scout);

TapScout.prototype.init = function(next) {
  var self = this;

  var tapQuery = self.server.where({type: 'tap'});
  self.server.find(tapQuery, function(err, results) {
    var tap;
    if (results[0]) {
      tap = self.provision(results[0], Tap);
    } else {
      tap = self.discover(Tap);
    }
    switch(self.bootCommand) {
    case 'operate':
      tap.call(self.bootCommand);
      break;
    }
  });
  next();
};
