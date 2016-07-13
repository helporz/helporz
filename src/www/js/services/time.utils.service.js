/**
 * Created by Midstream on 16/5/3.
 */

(function () {
  'use strict'

  angular.module('app.time.utils.service', [])

    //////////////////////////////////////////////////
    // timeUtils: 时间服务
    .factory('timeUtils', [function () {

      return {
        formatTimeBeforeNow: formatTimeBeforeNow,
        formatSimpleTimeBeforeNow: formatSimpleTimeBeforeNow
      }

      function formatTimeBeforeNow(before) {
        var beforeMilliSec = before.getTime();

        var now = new Date();
        var nowMilliSec = now.getTime();

        //计算出相差天数
        var left = nowMilliSec - beforeMilliSec;
        var days = Math.floor(left / (24 * 3600 * 1000));

        //小时数
        //var left = now % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
        left = left - days * 24 * 3600 * 1000;
        var hours = Math.floor(left / (3600 * 1000));

        //计算相差分钟数
        left = left -  hours * (3600 * 1000)        //计算小时数后剩余的毫秒数
        var minutes = Math.floor(left / (60 * 1000))

        var ret = '';
        if (days > 0) {
          ret += days + '天';
        }
        if (hours > 0) {
          ret += hours + '小时';
        }
        if (minutes > 0) {
          ret += minutes + '分钟';
        }
        if (ret == '') {
          ret = '现在';
        }else{
          ret += '前';
        }
        return ret;
      }

      function formatSimpleTimeBeforeNow(before) {
        var beforeMilliSec = before.getTime();

        var now = new Date();
        var nowMilliSec = now.getTime();

        //计算出相差天数
        var left = nowMilliSec - beforeMilliSec;
        var days = Math.floor(left / (24 * 3600 * 1000));

        //小时数
        //var left = now % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
        left = left - days * 24 * 3600 * 1000;
        var hours = Math.floor(left / (3600 * 1000));

        //计算相差分钟数
        left = left -  hours * (3600 * 1000)        //计算小时数后剩余的毫秒数
        var minutes = Math.floor(left / (60 * 1000))

        var ret = '';
        if (days > 0) {
          ret += days + '天';
          if (days < 2 && hours > 0) {
            ret += hours + '小时';
          }
        }
        else {
          if (hours > 0) {
            ret += hours + '小时';
          }
          if (minutes > 0) {
            ret += minutes + '分钟';
          }
        }

        if (ret == '') {
          ret = '现在';
        } else {
          ret += '前';
        }
        return ret;
      }

    }])
})
()

