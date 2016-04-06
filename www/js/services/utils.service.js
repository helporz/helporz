/**
 * Created by binfeng on 16/4/6.
 */
;(
  function(){
    'use strict';
    angular.module('com.helporz.utils.service',['ngCordova']).factory('localStorageService', [function() {
      return {
        get: function localStorageServiceGet(key, defaultValue) {
          var stored = localStorage.getItem(key);
          try {
            stored = angular.fromJson(stored);
          } catch (error) {
            stored = null;
          }
          if (stored === null || stored.length == 0 ) {
            stored = defaultValue;
          }
          return stored;
        },
        update: function localStorageServiceUpdate(key, value) {
          if (value) {
            localStorage.setItem(key, angular.toJson(value));
          }
        },
        clear: function localStorageServiceClear(key) {
          localStorage.removeItem(key);
        }
      };
    }]).factory('errorCodeService',function() {
      var errorCodeServiceFactory = {};
      var _isSuccess = function(errCode) {
        if( errCode == 200 ) {
          return true;
        }
        else {
          return false;
        }
      }
      var _getErrorCodeDescription = function(errCode) {
        if( errCode == 200 ) {
          return "成功";
        }
        else if( errCode == 400 ) {
          return "未定义错误";
        }
        else if (errCode == 403 ) {
          return "参数错误";
        }
        else if ( errCode == 500 ) {
          return "服务器内部错误";
        }
        else if (errCode == 501) {
          return "请先登陆";
        }
        else if ( errCode == 502 ) {
          return "上传文件失败";
        }
        else if ( errCode = 503 ) {
          return "用户已经注册";
        }
        else if ( errCode = 504 ) {
          return "无效的序列号";
        }
        else if ( errCode == 505) {
          return "无效的登陆令牌";
        }
        else if (errCode == 506 ) {
          return "无对应记录";
        }
        else if ( errCode == 507 ) {
          return "取消等待任务失败,已经有人接单";
        }
        else if ( errCode == 508 ) {
          return "无效的登陆密码";
        }
        else if ( errCode == 510) {
          return "注册用户未验证通过";
        }
        else if ( errCode == 511 ) {
          return "任务超时";
        }
        else if ( errCode == 512) {
          return "该求助已不存在";
        }
        else if ( errCode == 513 ) {
          return "该求助已被取消" ;
        }
        else if ( errCode == 514) {
          return "不能接自己发的任务";
        }
        else if ( errCode == 515) {
          return "不能取消任务";
        }
        else if( errCode == 516) {
          return "已经提交任务评价";
        }
        else if( errCode == 517) {
          return "无效的任务ID";
        }
        else if( errCode == 518) {
          return "不允许处理任务";
        }
        else if ( errCode == 519) {
          return "用户不存在";
        }
        else {
          return "未知错误";
        }
      }

      errorCodeServiceFactory.isSuccess = _isSuccess;
      errorCodeServiceFactory.getErrorCodeDescription = _getErrorCodeDescription;
      return errorCodeServiceFactory;
    }).factory("httpErrorCodeService",function() {
      var httpErrorCodeServiceFactory = {};
      var _getErrCodeDescription = function(errCode) {
        return "网络不给力,请调整后重试";
      }

      httpErrorCodeServiceFactory.getErrCodeDescription = _getErrCodeDescription;
      return httpErrorCodeServiceFactory;
    }).factory("userLoginInfoService",['localStorageService',function(localStorageService) {
      var userLoginInfoServiceFactory = {};
      var _saveLoginInfo = function(ticket,userInfo) {
        var loginInfo = {
          ticket:ticket,
          userInfo:userInfo
        };
        localStorageService.update('userLoginInfo',loginInfo);
      }
      var _getLoginInfo = function() {
        return localStorageService.get('userLoginInfo',null);
      };

      return {
        saveLoginInfo:_saveLoginInfo,
        getLoginInfo:_getLoginInfo
      };
    }]).factory('deviceService',['$log',function($log) {
      var deviceServiceFactory = {};
      var _getDeviceInfo = function() {
        var deviceInfo = {
          type:2,
          os:"android",
          version:'1.0',
          hid:"111",
          imsi:"123",
          serial:''
        };

        if( typeof(device) !== 'undefined') {
          deviceInfo.os = device.platform;
          deviceInfo.version = device.version;
          deviceInfo.serial = device.serial;
          $log.info("device platform:" + device.platform);
          if(deviceInfo.os == 'iOS') {
            deviceInfo.type = 1;
          }
          else if( deviceInfo.os == 'Android') {
            deviceInfo.type = 2;
          }
          else if( deviceInfo.os == 'WinCE'){
            deviceInfo.type = 3;
          }
          else {
            deviceInfo.type = 100;
          }
        }
        else {
          $log.error("undefined device");
        }
        return deviceInfo;
      }

      deviceServiceFactory.getDeviceInfo = _getDeviceInfo;
      return deviceServiceFactory;
    }]);
  }
)();
