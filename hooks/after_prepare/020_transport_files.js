#!/usr/bin/env node

// Add Platform Class
// v1.0
// Automatically adds the platform class to the body tag
// after the `prepare` command. By placing the platform CSS classes
// directly in the HTML built for the platform, it speeds up
// rendering the correct layout/style for the specific platform
// instead of waiting for the JS to figure out the correct classes.

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

var rootdir = process.argv[2];

process.stdout.write('start transport js...\n');
//process.stdout.write('\nprocess argv 0:' + process.argv[0] + ' arg 1:' + process.argv[1] + ' arg 2:' + process.argv[2] + '\n');


var platforms = (process.env.CORDOVA_PLATFORMS ? process.env.CORDOVA_PLATFORMS.split(',') : []);
var str_pfs = JSON.stringify(platforms);
process.stdout.write('platforms: ' + str_pfs + '\n');

var cmd = 'gulp transport';

for(var i = 0; i < platforms.length; i++){
  try {

    if(platforms[i] == 'ios'){
      cmd = cmd + '-ios';
    } else if (platforms[i] == 'android') {
      cmd = cmd + '-android';
    }

    process.stdout.write('do gulp: ' + cmd + '\n');
    exec(cmd, function(err){
      if(err){
        //process.stdout.write('gulp exec err: ' + err);
      }
    });

  } catch(e) {
    process.stdout.write(e);
  }
}



