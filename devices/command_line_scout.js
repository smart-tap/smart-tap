var Scout = require('zetta').Scout;
var util = require('util');
var shell = require('shelljs');
var CommandLine = require('./command_line');

var CommandLineScout = module.exports = function() {
  Scout.call(this);
}

util.inherits(CommandLineScout, Scout);

CommandLineScout.prototype.init = function(next) {
  if (!shell.which('git')) {
    shell.echo('Sorry, Command Line device requires git to be installed on the computer.');
    shell.exit(1);
  } else {
  
    var self = this;
    
    var commandLineQuery = self.server.where({type: 'commandLine'});
    self.server.find(commandLineQuery, function(err, results) {
      var commandLine;
      if (results[0]) {
	commandLine = self.provision(results[0], CommandLine, shell);
      } else {
	commandLine = self.discover(CommandLine, shell);
      }
    });
  }
 
  next();
};
