/**
 * Created by binfeng on 16/4/6.
 */
;
(function () {
  'use strict';
  angular.module('com.helporz.utils.service', ['ngCordova']).factory('localStorageService', [function () {
    return {
      get: function localStorageServiceGet(key, defaultValue) {
        var stored = localStorage.getItem(key);
        try {
          stored = angular.fromJson(stored);
        } catch (error) {
          stored = null;
        }
        if (stored === null || stored.length == 0) {
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
  }]).factory('errorCodeService', function () {
    var errorCodeServiceFactory = {};
    var _isSuccess = function (errCode) {
      if (errCode == 200) {
        return true;
      }
      else {
        return false;
      }
    }
    var _getErrorCodeDescription = function (errCode) {
      if (errCode == 200) {
        return "成功";
      }
      else if (errCode == 400) {
        return "未定义错误";
      }
      else if (errCode == 403) {
        return "参数错误";
      }
      else if (errCode == 500) {
        return "服务器内部错误";
      }
      else if (errCode == 501) {
        return "请先登陆";
      }
      else if (errCode == 502) {
        return "上传文件失败";
      }
      else if (errCode == 503) {
        return "用户已经注册";
      }
      else if (errCode == 504) {
        return "无效的序列号";
      }
      else if (errCode == 505) {
        return "无效的登陆令牌";
      }
      else if (errCode == 506) {
        return "无对应记录";
      }
      else if (errCode == 507) {
        return "取消等待任务失败,已经有人接单";
      }
      else if (errCode == 508) {
        return "无效的登陆密码";
      }
      else if (errCode == 510) {
        return "注册用户未验证通过";
      }
      else if (errCode == 511) {
        return "任务超时";
      }
      else if (errCode == 512) {
        return "该求助已不存在";
      }
      else if (errCode == 513) {
        return "该求助已被取消";
      }
      else if (errCode == 514) {
        return "不能接自己发的任务";
      }
      else if (errCode == 515) {
        return "不能取消任务";
      }
      else if (errCode == 516) {
        return "已经提交任务评价";
      }
      else if (errCode == 517) {
        return "无效的任务ID";
      }
      else if (errCode == 518) {
        return "不允许处理任务";
      }
      else if (errCode == 519) {
        return "用户不存在";
      }
      else {
        return null;
      }
    }

    errorCodeServiceFactory.isSuccess = _isSuccess;
    errorCodeServiceFactory.getErrorCodeDescription = _getErrorCodeDescription;
    return errorCodeServiceFactory;
  }).factory("httpErrorCodeService", function () {
    var httpErrorCodeServiceFactory = {};
    var _getErrCodeDescription = function (errCode) {
      return "网络不给力,请调整后重试:" + errCode;
    }

    httpErrorCodeServiceFactory.getErrCodeDescription = _getErrCodeDescription;
    httpErrorCodeServiceFactory.getErrorCodeDescription = _getErrCodeDescription;
    return httpErrorCodeServiceFactory;
  }).factory("userLoginInfoService", ['localStorageService', 'utilConvertDateToString', function (localStorageService, utilConvertDateToString) {
    var userLoginInfoServiceFactory = {};
    var _saveLoginInfo = function (ticket, userInfo) {
      var loginInfo = {
        ticket: ticket,
        userInfo: userInfo
      };
      localStorageService.update('userLoginInfo', loginInfo);
    }
    var _getLoginInfo = function () {
      return localStorageService.get('userLoginInfo', null);
    };

    var _getLoginTicket = function () {
      var loginInfo = _getLoginInfo();
      if (loginInfo == null) {
        return null;
      }
      return loginInfo.ticket;
    }

    var _getLoginPhoneNo = function () {
      var loginInfo = _getLoginInfo();
      if (loginInfo == null) {
        return null;
      }
      return loginInfo.userInfo.phoneNo;
    }

    var _clear = function () {
      localStorageService.update('userLoginInfo', null);
    }

    var _isShowIntro = function () {
      var showIntroInfo = localStorageService.get('showIntroInfo', null);
      if (showIntroInfo == null) {
        return true;
      }
      return false;
      //var currentDate = new Date();
      //var expireTime = utilConvertDateToString.getStringToDate(showIntroInfo.expireTime);
      //if (expireTime < currentDate) {
      //  return true;
      //}
      //else {
      //  return false;
      //}
    }

    var _updateShowIntroInfo = function () {
      var lastTime = new Date();
      var expireTime = new Date();
      expireTime.setDate(expireTime.getDate() + 30);
      var showIntroInfo = {
        lastTime: utilConvertDateToString.getDateToString(lastTime, 'yyyy-MM-dd HH:mm:ss'),
        expireTime: utilConvertDateToString.getDateToString(expireTime, 'yyyy-MM-dd HH:mm:ss'),
      }
      localStorageService.update('showIntroInfo', showIntroInfo);
    }

    return {
      saveLoginInfo: _saveLoginInfo,
      getLoginInfo: _getLoginInfo,
      getLoginTicket: _getLoginTicket,
      getLoginPhoneNo: _getLoginPhoneNo,
      clear: _clear,
      isShowIntro: _isShowIntro,
      updateShowIntroInfo: _updateShowIntroInfo,
    };
  }]).factory('deviceService', ['$log', 'pushService', function ($log, pushService) {
    var deviceServiceFactory = {};
    var _getDeviceInfo = function () {
      var deviceInfo = {
        type: 2,
        os: "android",
        version: '1.0',
        hid: "111",
        imsi: "123",
        serial: ''
      };

      if (typeof(device) !== 'undefined') {
        deviceInfo.os = device.platform;
        deviceInfo.version = device.version;
        deviceInfo.serial = device.serial;
        $log.info("device platform:" + device.platform);
        if (deviceInfo.os == 'iOS') {
          deviceInfo.type = 1;
        }
        else if (deviceInfo.os == 'Android') {
          deviceInfo.type = 2;
        }
        else if (deviceInfo.os == 'WinCE') {
          deviceInfo.type = 3;
        }
        else {
          deviceInfo.type = 100;
        }

        var hid = pushService.getCurrentRegistrationID();
        if (hid != null && hid !== '') {
          deviceInfo.hid = hid;
          $log.info("device hid:" + hid);
        }
        else {
          $log.error("can't get hid");
        }
      }
      else {
        $log.error("undefined device");
      }
      return deviceInfo;
    }

    deviceServiceFactory.getDeviceInfo = _getDeviceInfo;
    return deviceServiceFactory;
  }])
    .factory('httpBaseService', ['$q', '$http', '$log', '$state', '$timeout', '$ionicLoading', 'userLoginInfoService', 'errorCodeService', 'httpErrorCodeService',
      function ($q, $http, $log, $state, $timeout, $ionicLoading, userLoginInfoService, errorCodeService, httpErrorCodeService) {
        var _post = function (url, data, onSuccessFn, onFailedFn, onHttpFailedFn) {
          $http({
            method: 'POST', url: appConfig.API_SVC_URL + url, data: data,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'x-login-key': userLoginInfoService.getLoginTicket()
            }
          }).success(function (data, status, headers, config) {
            var resp = data;
            if (errorCodeService.isSuccess(resp.code)) {
              onSuccessFn(resp, status, headers, config);
            }
            else {
              if (resp.code == 501 || resp.code == 510) {
                $ionicLoading.hide();
                $ionicLoading.show({
                  duration: 1500,
                  templateUrl: 'modules/components/templates/ionic-loading/user-relogin-hint.html'
                });
                //$timeout(function () {
                  $state.go('login');
                //}, 3000);
              }
              else {
                onFailedFn(resp.code, data, status, headers, config);
              }
            }
          }).error(function (data, status, headers, config) {
            onHttpFailedFn(data, status, headers, config);
          });
        };


        var _postForPromise = function (url, data) {
          var _postDefer = $q.defer();
          if (url.indexOf('?') == -1) {
            url = url + '?_t=' + (new Date()).getTime();
          }
          else {
            url = url + '&_t=' + (new Date()).getTime();
          }

          $http({
            method: 'POST', url: appConfig.API_SVC_URL + url, data: data,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'x-login-key': userLoginInfoService.getLoginTicket()
            }
          }).success(function (data, status, headers, config) {
            var resp = data;
            if (errorCodeService.isSuccess(resp.code)) {
              _postDefer.resolve(resp);
            }
            else {
              if (resp.code == 501 || resp.code == 510) {
                $ionicLoading.hide();
                $ionicLoading.show({
                  duration: 1500,
                  templateUrl: 'modules/components/templates/ionic-loading/user-relogin-hint.html'
                });
                //$timeout(function () {
                  $state.go('login');
                //}, 3000);
              }
              else {
                _postDefer.reject(resp.code);
              }
            }
          }).error(function (data, status) {
            alert(data);
            alert('error status:' + status)
            _postDefer.reject(status);
          });
          return _postDefer.promise;
        };

        var _get = function (url, params, onSuccessFn, onFailedFn, onHttpFailedFn) {
          $http({
            method: 'GET', url: appConfig.API_SVC_URL + url, params: params, headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'x-login-key': userLoginInfoService.getLoginTicket()
            }
          }).success(function (data, status, headers, config) {
            var resp = data;
            if (errorCodeService.isSuccess(resp.code)) {
              onSuccessFn(resp, status, headers, config);
            }
            else {
              if (resp.code == 501 || resp.code == 510) {
                $ionicLoading.hide();
                $ionicLoading.show({
                  duration: 1500,
                  templateUrl: 'modules/components/templates/ionic-loading/user-relogin-hint.html'
                });
                //$timeout(function () {
                  $state.go('login');
                //}, 3000);
              }
              else {
                onFailedFn(resp.code, data, status, headers, config);
              }
            }
          }).error(function (data, status, headers, config) {
            onHttpFailedFn(data, status, headers, config);
          });
        };

        var _getForPromise = function (url, params) {
          var _getDefer = $q.defer();
          params = params || {};
          params._t = (new Date()).getTime();
          $http({
            method: 'GET', url: appConfig.API_SVC_URL + url, params: params, headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'x-login-key': userLoginInfoService.getLoginTicket()
            }
          }).success(function (data, status, headers, config) {
            //$log.info('getForPromise url=' + url + ' response data=' + JSON.stringify(data));
            var resp = data;
            if (errorCodeService.isSuccess(resp.code)) {
              _getDefer.resolve(resp.data);
            }
            else {
              if (resp.code == 501 || resp.code == 510) {
                $ionicLoading.hide();
                $ionicLoading.show({
                  duration: 1500,
                  templateUrl: 'modules/components/templates/ionic-loading/user-relogin-hint.html'
                });
                //$timeout(function () {
                  $state.go('login');
                //}, 3000);
              }
              else {
                _getDefer.reject(resp);
              }
            }
          }).error(function (data, status) {
            _getDefer.reject(status);
          });
          return _getDefer.promise;
        };

        return {
          post: _post,
          get: _get,
          getForPromise: _getForPromise,
          postForPromise: _postForPromise
        }
      }]).factory('uploadService', UploadServiceFactoryFn)
    .factory('downloadService', ['$log', DownloadServiceFactoryFn])
    .factory('UtilsService', UtilsServiceFn)
    .factory('debugHelpService', ['$log', DebugHelpServiceFactoryFn])
    .factory('utilConvertDateToString', ['$filter', function ($filter) {
      return {
        getDateToString: function (date, format) {
          if (angular.isDate(date) && angular.isString(format)) {
            return $filter('date')(date, format);
          }
        },
        getStringToDate: function (string) {
          if (angular.isString(string)) {
            return new Date(string.replace(/-/g, "/"));
          }
        }
      };
    }])
    .factory('promptService', promptServiceFn)
    .constant('base64', (Base64ConstantFn)())
    .filter('DateShow', DateShowFn)
    .filter('IMDateShow', IMDateShowFn)
    .filter('BorrowDateShowFn', BorrowDateShowFn)
    .filter('String2Date', String2DateFn)
    .directive('focusMe', focusMeFn);

  promptServiceFn.$inject = ['$log', '$timeout', '$ionicLoading', 'errorCodeService', 'httpErrorCodeService'];
  function promptServiceFn($log, $timeout, $ionicLoading, errorCodeService, httpErrorCodeService) {

    var promptMessage = function (message, duration) {
      if (typeof duration === 'undefined' || duration == null || duration == 0) {
        duration = 1000;
      }
      $ionicLoading.show({
        duration: duration,
        template: message,
      });
      $timeout(function () {
        $ionicLoading.hide();
      }, duration * 2);
    }

    var promptErrorInfo = function (errorCode, duration) {
      var errorMessage = errorCodeService.getErrorCodeDescription(errorCode);
      if (errorMessage == null) {
        errorMessage = httpErrorCodeService.getErrorCodeDescription(errorCode);
      }
      promptMessage(errorMessage, duration);
    }

    return {
      promptMessage: promptMessage,
      promptErrorInfo: promptErrorInfo,
    }
  }

  UtilsServiceFn.$inject = [];
  function UtilsServiceFn() {
    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    Date.prototype.Format = function (fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    }
    var date2String = function (date) {
      return date.Format("yyyy-MM-dd hh:mm:ss");
    }

    var currentDate2String = function () {
      return date2String(new Date());
    }

    var getLocalTime = function (nS) {
      return date2String(new Date(parseInt(nS)));
    }

    return {
      date2String: date2String,
      currentDate2String: currentDate2String,
      getLocalTime: getLocalTime,
    }
  }

  function String2DateFn() {
    var filterFn = function (dateString) {
      return new Date(dateString);
    }

    return filterFn;
  }

  focusMeFn.$inject = ['$timeout'];
  function focusMeFn($timeout) {
    return {
      scope: {
        isFocusMe: '@focusMe',

      },
      link: function (scope, element) {
        scope.$watch('isFocusMe', function (value) {
          if (value != null && value !== '' && value !== "false") {
            $timeout(function () {
              element[0].focus();
            });
          }
        });
      }
    };
  }

  function DateShowFn() {
    var filterFn = function (dateString) {
      var d = new Date(dateString.replace(/-/g, "/")).getTime();
      var currentDate = new Date().getTime();
      var diffTimes = currentDate - d;
      if (diffTimes < 2 * 60 * 1000) {
        return "刚才";
      }
      else if (diffTimes < 60 * 60 * 1000) {
        return Math.round(diffTimes / (60 * 1000)) + "分钟前";
      }
      else if (diffTimes < 24 * 60 * 60 * 1000) {
        return Math.round((diffTimes / (60 * 60 * 1000))) + "小时前";
      }
      else {
        return Math.round((diffTimes / (24 * 60 * 60 * 1000))) + "天前";
      }
    }

    return filterFn;
  }

  function IMDateShowFn() {
    var filterFn = function (dateString) {
      var d = new Date(dateString.replace(/-/g, "/"));
      var currentDate = new Date();
      if (d.getFullYear() === currentDate.getFullYear() &&
        d.getMonth() === currentDate.getMonth()) {

        var diffDay = d.getDay() - currentDate.getDay()
        if (diffDay == 0) {
          return d.getHours() + ":" + d.getMinutes();
        }
        else if (-1) {
          return "昨天" + " " + d.getHours() + ":" + d.getMinutes();
        }
      }

      //return d.Format("yyyy-MM-dd hh:mm");
      return d.Format("M月d日 hh:mm");
    }

    return filterFn;
  }

  // copy from IMDateShowFn..
  function BorrowDateShowFn() {
    var filterFn = function (dateString) {
      var d = new Date(dateString.replace(/-/g, "/"));
      var currentDate = new Date();
      if (d.getFullYear() === currentDate.getFullYear() &&
        d.getMonth() === currentDate.getMonth()) {

        var diffDay = d.getDay() - currentDate.getDay()
        if (diffDay == 0) {
          return d.getHours() + ":" + d.getMinutes();
        }
        else if (-1) {
          return "昨天" + " " + d.getHours() + ":" + d.getMinutes();
        }
      }
      return d.Format("M月d日");
    }

    return filterFn;
  }

  function Base64ConstantFn() {
    // existing version for noConflict()
    var version = "2.1.8";
    // if node.js, we use Buffer
    var buffer;
    if (typeof module !== 'undefined' && module.exports) {
      buffer = require('buffer').Buffer;
    }
    // constants
    var b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var b64tab = function (bin) {
      var t = {};
      for (var i = 0,
             l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
      return t;
    }(b64chars);
    var fromCharCode = String.fromCharCode;
    // encoder stuff
    var cb_utob = function (c) {
      if (c.length < 2) {
        var cc = c.charCodeAt(0);
        return cc < 0x80 ? c : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6)) + fromCharCode(0x80 | (cc & 0x3f))) : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f)) + fromCharCode(0x80 | ((cc >>> 6) & 0x3f)) + fromCharCode(0x80 | (cc & 0x3f)));
      } else {
        var cc = 0x10000 + (c.charCodeAt(0) - 0xD800) * 0x400 + (c.charCodeAt(1) - 0xDC00);
        return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07)) + fromCharCode(0x80 | ((cc >>> 12) & 0x3f)) + fromCharCode(0x80 | ((cc >>> 6) & 0x3f)) + fromCharCode(0x80 | (cc & 0x3f)));
      }
    };
    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var utob = function (u) {
      return u.replace(re_utob, cb_utob);
    };
    var cb_encode = function (ccc) {
      var padlen = [0, 2, 1][ccc.length % 3],
        ord = ccc.charCodeAt(0) << 16 | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8) | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
        chars = [b64chars.charAt(ord >>> 18), b64chars.charAt((ord >>> 12) & 63), padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63), padlen >= 1 ? '=' : b64chars.charAt(ord & 63)];
      return chars.join('');
    };
    var btoa = function (b) {
      return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };
    var _encode = buffer ?
      function (u) {
        return (u.constructor === buffer.constructor ? u : new buffer(u)).toString('base64')
      } : function (u) {
      return btoa(utob(u))
    };
    var encode = function (u, urisafe) {
      return !urisafe ? _encode(String(u)) : _encode(String(u)).replace(/[+\/]/g,
        function (m0) {
          return m0 == '+' ? '-' : '_';
        }).replace(/=/g, '');
    };
    var encodeURI = function (u) {
      return encode(u, true)
    };
    // decoder stuff
    var re_btou = new RegExp(['[\xC0-\xDF][\x80-\xBF]', '[\xE0-\xEF][\x80-\xBF]{2}', '[\xF0-\xF7][\x80-\xBF]{3}'].join('|'), 'g');
    var cb_btou = function (cccc) {
      switch (cccc.length) {
        case 4:
          var cp = ((0x07 & cccc.charCodeAt(0)) << 18) | ((0x3f & cccc.charCodeAt(1)) << 12) | ((0x3f & cccc.charCodeAt(2)) << 6) | (0x3f & cccc.charCodeAt(3)),
            offset = cp - 0x10000;
          return (fromCharCode((offset >>> 10) + 0xD800) + fromCharCode((offset & 0x3FF) + 0xDC00));
        case 3:
          return fromCharCode(((0x0f & cccc.charCodeAt(0)) << 12) | ((0x3f & cccc.charCodeAt(1)) << 6) | (0x3f & cccc.charCodeAt(2)));
        default:
          return fromCharCode(((0x1f & cccc.charCodeAt(0)) << 6) | (0x3f & cccc.charCodeAt(1)));
      }
    };
    var btou = function (b) {
      return b.replace(re_btou, cb_btou);
    };
    var cb_decode = function (cccc) {
      var len = cccc.length,
        padlen = len % 4,
        n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0) | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0) | (len > 2 ? b64tab[cccc.charAt(2)] << 6 : 0) | (len > 3 ? b64tab[cccc.charAt(3)] : 0),
        chars = [fromCharCode(n >>> 16), fromCharCode((n >>> 8) & 0xff), fromCharCode(n & 0xff)];
      chars.length -= [0, 0, 2, 1][padlen];
      return chars.join('');
    };
    var atob = function (a) {
      return a.replace(/[\s\S]{1,4}/g, cb_decode);
    };
    var _decode = buffer ?
      function (a) {
        return (a.constructor === buffer.constructor ? a : new buffer(a, 'base64')).toString();
      } : function (a) {
      return btou(atob(a))
    };
    var decode = function (a) {
      return _decode(String(a).replace(/[-_]/g,
        function (m0) {
          return m0 == '-' ? '+' : '/'
        }).replace(/[^A-Za-z0-9\+\/]/g, ''));
    };

    return {
      encode: encode,
      decode: decode,
    };
  }

  function DebugHelpServiceFactoryFn($log) {
    var obj2String = function (o, maxDeepCount, currentDeepIndex) {
      var r = [];
      if (o == null) {
        return '';
      }
      if (currentDeepIndex >= maxDeepCount) {
        return o.toString();
      }

      if (typeof o == "string") {
        return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
      }
      if (typeof o == "object") {

        if (!o.sort) {
          for (var i in o) {
            r.push(i + ":" + obj2String(o[i], maxDeepCount, currentDeepIndex + 1));
          }
          if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
            r.push("toString:" + o.toString.toString());
          }
          r = "{" + r.join() + "}";
        } else {
          for (var i = 0; i < o.length; i++) {
            r.push(obj2String(o[i], maxDeepCount, currentDeepIndex + 1))
          }
          r = "[" + r.join() + "]";
        }
        $log.debug(r);
        return r;
      }
      $log.debug(o.toString());
      return o.toString();
    }

    var writeObj = function (obj, maxDeepCount) {
      if (typeof maxDeepCount !== 'undefined' || maxDeepCount !== null) {
        maxDeepCount = 100;
      }
      //$log.debug('maxDeepCount' + maxDeepCount);
      var description = "";
      for (var i in obj) {
        var property = obj[i];
        //$log.error('i' + i + '= property ' + property);
        description += i + " = " + obj2String(property, maxDeepCount, 0) + "\n";
      }
      $log.debug(description);
      return description;
    }

    return {
      writeObj: writeObj
    }
  }

  UploadServiceFactoryFn.$inject = ['$log', '$q', '$cordovaFileTransfer'];
  function UploadServiceFactoryFn($log, $q, $cordovaFileTransfer) {
    var _uploadFile = function (fileUrl, serverUrl, headers, mimeType) {
      var _innerDefer = $q.defer();

      var win = function (r) {
        $log.info("Code = " + r.responseCode);
        $log.info("Response = " + r.response);
        $log.info("Sent = " + r.bytesSent);
        _innerDefer.resolve(fileUrl);
      }

      var fail = function (error) {
        $log.error("An error has occurred: Code = " + error.code);
        $log.error("upload error source " + error.source);
        $log.error("upload error target " + error.target);
        _innerDefer.reject({
          fileUrl: fileUrl,
          error: error
        });
      }

      var options = new FileUploadOptions();
      options.fileKey = "file";
      options.fileName = fileUrl.substr(fileUrl.lastIndexOf('/') + 1);
      options.mimeType = mimeType;

      options.headers = headers;
      options.params = {
        framework: 'Ionic' // <<<<< This is sent
      };

      //options.params = params;

      //var ft = new FileTransfer();
      //ft.upload(fileUrl, encodeURI(serverUrl), win, fail, options);
      //return {transferHandle: ft, promise: _innerDefer.promise};
      return $cordovaFileTransfer.upload(encodeURI(serverUrl), fileUrl, options);
    };

    var _uploadImgFile = function (fileUrl, serverUrl, header) {
      return _uploadFile(fileUrl, serverUrl, header, 'image/jpeg');
    }
    var _uploadAudioFile = function (fileUrl, serverUrl, header, onSuccess, onFailed) {

    };

    var _abortUpload = function (transferHandle) {
      if (transferHandle != null) {
        transferHandle.abort();
      }
    }

    return {
      uploadImgFile: _uploadImgFile,
      uploadAudioFile: _uploadAudioFile,
      abortUpload: _abortUpload
    };
  };

  function DownloadServiceFactoryFn($log) {
    var _downloadFile = function (fileUrl, serverUrl, headers, onSuccess, onFailed) {
      var fileTransfer = new FileTransfer();
      var uri = encodeURI(serverUrl);

      fileTransfer.download(
        uri,
        fileUrl,
        function (entry) {
          console.log("download complete: " + entry.toURL());
          onSuccess(fileUrl, serverUrl);
        },
        function (error) {
          console.log("download error source " + error.source);
          console.log("download error target " + error.target);
          console.log("upload error code" + error.code);
          onFailed(fileUrl, serverUrl, error.code);
        },
        false,
        {
          headers: headers
        });
      return fileTransfer;
    }

    var _abortDownload = function (ftObject) {
      if (ftObject != null) {
        ftObject.abort();
      }
    }

    return {
      downloadFile: _downloadFile,
      abortDownload: _abortDownload
    };
  };

})();
