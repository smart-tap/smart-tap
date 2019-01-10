var Device = require('zetta').Device;
var util = require('util');

var CommandLine = module.exports = function(shell) {
  Device.call(this);
  this.execResultText = 'no results yet';
  this.execResultCode = '';
  this.execResultStdOut = '';
  this.execResultStdErr = '';
  this._shell = shell;
}

util.inherits(CommandLine, Device);

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
    .monitor('execResultText')
    .monitor('execResultCode')
    .monitor('execResultStdOut')
    .monitor('execResultStdErr');
}

CommandLine.prototype.updateSoftware = function(cb) {
  this.state = 'updatingSoftware';
  cb();
  this._execCommandLine('git pull origin master && npm install', cb);
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
  var self = this;
  this._shell.exec(cmd, function(code, stdout, stderr) {
    self.execResultText = (code === 0) ? 'Good' : 'Error';
    self.execResultCode = code;
    self.execResultStdOut = stdout;
    self.execResultStdErr = stderr;
    self.state = 'ready';
    cb();
  });
}
