var Scout = require('zetta').Scout;
var util = require('util');
var CommandLine = require('./command_line');

var CommandLineScout = module.exports = function() {
  Scout.call(this);
}

util.inherits(CommandLineScout, Scout);

CommandLineScout.prototype.init = function(next) {
  var self = this;
  
  var commandLineQuery = self.server.where({type: 'command-line'});
  self.server.find(commandLineQuery, function(err, results) {
    var commandLine;
    if (results[0]) {
      commandLine = self.provision(results[0], CommandLine);
    } else {
      commandLine = self.discover(CommandLine);
    }
  });
 
  next();
};
