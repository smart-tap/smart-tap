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
    .name("Command Line");

  config
    // Define the transitions allowed by the state machine
    .when('ready', {allow: ['updateCode', 'restartSmartTap', 'shutdownComputer']})

    // Map the transitions to JavaScript methods
    .map('updateCode', this.updateCode)
    .map('restartSmartTap', this.restartSmartTap)
    .map('shutdownComputer', this.shutdownComputer, [{type: 'password', name: 'password'}])

    // Monitor the elapsed times for each state
    .monitor('execResultText')
    .monitor('execResultCode')
    .monitor('execResultStdOut')
    .monitor('execResultStdErr');
}

CommandLine.prototype.updateCode = function(cb) {
  this._execCommandLine('git pull origin master');
  cb();
}

CommandLine.prototype.restartSmartTap = function(cb) {
  this._execCommandLine('pm2 restart all --update-env');
  cb();
}

CommandLine.prototype.shutdownComputer = function(password, cb) {
  this._execCommandLine('echo ' + password + ' | sudo -S shutdown -h now');
  cb();
}

CommandLine.prototype._execCommandLine = function(cmd) {
  var lastCommand = this._shell.exec(cmd);
  this.execResultText = (lastCommand.code === 0) ? 'Good' : 'Error';
  this.execResultCode = lastCommand.code;
  this.execResultStdOut = lastCommand.stdout;
  this.execResultStdErr = lastCommand.stderr;
}
