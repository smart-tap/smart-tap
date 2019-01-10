var Device = require('zetta').Device;
var util = require('util');
const { exec } = require('child_process');

var CommandLine = module.exports = function() {
  Device.call(this);
  this._resetStatus();
}

util.inherits(CommandLine, Device);

// command line is called controller
CommandLine.prototype.init = function(config) {

    // Set up the state machine 
  config
    .type('command-line')
    .state('ready')
    .name("Controller");

  config
    // Define the transitions allowed by the state machine
    .when('ready', {allow: ['updateSoftware', 'restartSoftware', 'shutDownHardware']})
    .when('updatingSoftware', {allow: []})
    .when('shuttingDownHardware', {allow: []})
    .when('restartingSoftware', {allow: []})

    // Map the transitions to JavaScript methods
    .map('updateSoftware', this.updateSoftware)
    .map('restartSoftware', this.restartSoftware)
    .map('shutDownHardware', this.shutdownHardware, [{type: 'password', name: 'password'}])

    // Monitor the elapsed times for each state
    .monitor('execCmd')
    .monitor('execResultText')
    .monitor('execResultStdOut')
    .monitor('execResultStdErr');
}

CommandLine.prototype.updateSoftware = function(cb) {
  this.state = 'updatingSoftware';
  cb();
  var self = this;
  this._execCommandLine('git pull origin master', function() {
    if (self.execResultStdOut.indexOf('Already up-to-date') < 0) {
      self.state = 'updatingSoftware';
      cb();
      self._execCommandLine('npm install', cb);
    }
  });
}

CommandLine.prototype.restartSoftware = function(cb) {
  this.state = 'restartingSoftware';
  cb();  
  this._execCommandLine('pm2 restart all --update-env', cb);
}

CommandLine.prototype.shutdownHardware = function(password, cb) {
  this.state = 'shuttingDownHardware';
  cb();
  this._execCommandLine('echo ' + password + ' | sudo -S shutdown -h now', cb);
}

CommandLine.prototype._execCommandLine = function(cmd, cb) {
  this._resetStatus();
  this.execCmd = cmd;
  var self = this;
  exec(cmd, function(err, stdout, stderr) {
    self.execResultText = (err) ? 'error' : 'good';
    self.execResultStdOut = stdout;
    self.execResultStdErr = stderr;
    self.state = 'ready';
    cb();
  });
}

CommandLine.prototype._resetStatus = function() {
  this.execResultText = '';
  this.execResultStdOut = '';
  this.execResultStdErr = '';
  this.execCmd = '';
}
