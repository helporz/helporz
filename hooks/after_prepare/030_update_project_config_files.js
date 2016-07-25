#!/usr/bin/env node

// Add Platform Class
// v1.0
// Automatically adds the platform class to the body tag
// after the `prepare` command. By placing the platform CSS classes
// directly in the HTML built for the platform, it speeds up
// rendering the correct layout/style for the specific platform
// instead of waiting for the JS to figure out the correct classes.

var fs = require('fs-extra');
var path = require('path');
var exec = require('child_process').exec;


process.stdout.write('start update project config files ...\n');


var platforms = (process.env.CORDOVA_PLATFORMS ? process.env.CORDOVA_PLATFORMS.split(',') : []);
var str_pfs = JSON.stringify(platforms);
process.stdout.write('platforms: ' + str_pfs + '\n');


for (var i = 0; i < platforms.length; i++) {
  try {

    var srcFile;
    var destFile;
    process.stdout.write( platforms[i] + '\n');
    if (platforms[i] == 'ios') {
      srcFile = './config_mdf/ios/helporz-Info.plist';
      destFile = './platforms/ios/helporz/helporz-Info.plist'
    } else if (platforms[i] == 'android') {
      srcFile = './config_mdf/android/strings.xml';
      destFile = './platforms/android/res/values/strings.xml';
    }

    fs.copy(srcFile, destFile, function(err) {
      if (err) return console.error(err);
      console.log("success!");
    });

  } catch (e) {
    process.stdout.write(e);
  }
}






