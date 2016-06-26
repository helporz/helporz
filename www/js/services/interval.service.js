/**
 * Created by Midstream on 16/6/25.
 * ionic angular的$interval在反复new和cancel后,ios(至少是ios)的cup会越来越高
 * 为了解决这个问题,使用以下全局intervalCenter,注入回调函数
 */

(function () {
  'use strict'

  angular.module('interval.service', [])

    .factory('intervalCenter', ['$interval', function ($interval) {

      var intervals = [
        {}, //  frequency
        {}  // infrequence
        ];

      $interval(function(){
        var v = intervals[0];
        for(var k in v) {
          v[k]();
        }
      }, 200);

      $interval(function() {
        var v = intervals[1];
        for(var k in v) {
          v[k]();
        }
      }, 7000);

      return {
        add: add,
        remove: remove
      }

      //function add(key, objNeedInterval) {
      //  if(objNeedInterval.$intervalFunc == undefined) {
      //    console.error('' + key + ' need $intervalFunc, but not have');
      //    return;
      //  }
      //  intervals.key = objNeedInterval;
      //}

      function add(frequencyLevel, key, func) {
        if(func == undefined) {
          console.error('' + key + ' need intervalFunc, but not');
          return;
        }
        intervals[frequencyLevel].key = func;
      }

      function remove(frequencyLevel, key) {
        if(intervals[frequencyLevel][key]){
          delete intervals[frequencyLevel][key];
        }
      }

    }])
})()

