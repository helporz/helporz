var exec = require('child_process').exec;

var plugin = 'cordova-plugin-jmessage';
var pluginPath = '/Users/Midstream/Documents/Dev/web/helporz/plugins_mdf/';
var cmd_remove = 'cordova plugin remove' + plugin;
var cmd_install = 'cordova plugin add' + pluginPath + plugin;

var cmd_full = 'cordova plugin add plugins_mdf/cordova-plugin-jmessage --variable APP_KEY=049e53804cad513c749bbd1c'

process.stdout.write('do reinstall: ' + '\n');
//exec(cmd_remove, function (err) {
//  if (err) {
//    process.stdout.write('cmd_remove exec err: ' + err + '\n');
//  }
//  else{
    exec(cmd_full, function(err){
      process.stdout.write('cmd_install exec err: ' + err + '\n');
    })
  //}
//});



