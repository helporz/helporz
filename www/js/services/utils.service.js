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
        else if ( errCode == 503 ) {
          return "用户已经注册";
        }
        else if ( errCode == 504 ) {
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
        return "网络不给力,请调整后重试:" + errCode;
      }

      httpErrorCodeServiceFactory.getErrCodeDescription = _getErrCodeDescription;
      httpErrorCodeServiceFactory.getErrorCodeDescription = _getErrCodeDescription;
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

      var _getLoginTicket = function() {
        var loginInfo = _getLoginInfo();
        if( loginInfo == null ) {
          return null;
        }
        return loginInfo.ticket;
      }

      var _getLoginPhoneNo = function() {
        var loginInfo = _getLoginInfo();
        if( loginInfo == null ) {
          return null;
        }
        return loginInfo.userInfo.phoneNo;
      }

      return {
        saveLoginInfo:_saveLoginInfo,
        getLoginInfo:_getLoginInfo,
        getLoginTicket:_getLoginTicket,
        getLoginPhoneNo:_getLoginPhoneNo
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
    }])
    .factory('httpBaseService',['$q','$http','$log','userLoginInfoService','errorCodeService','httpErrorCodeService',
        function($q,$http,$log,userLoginInfoService,errorCodeService,httpErrorCodeService) {
        var _post = function(url,data,onSuccessFn,onFailedFn,onHttpFailedFn) {
          $http({
            method:'POST',url:appConfig.API_SVC_URL + url,data:data,
            headers: {
              'Content-Type':'application/x-www-form-urlencoded',
              'x-login-key':userLoginInfoService.getLoginTicket()
            }
          }).success(function(data,status,headers,config)
          {
            var resp = data;
            if( errorCodeService.isSuccess(resp.code) ) {
              onSuccessFn(resp,status,headers,config);
            }
            else {
              onFailedFn(resp.code,data,status,headers,config);
            }
          }).error(function(data,status,headers,config)
          {
            onHttpFailedFn(data,status,headers,config);
          });
        };


          var _postForPromise = function(url,data) {
            var _postDefer = $q.defer();
            if( url.indexOf('?') == -1 ) {
              url = url + '?_t=' + (new Date()).getTime();
            }
            else {
              url = url + '&_t=' + (new Date()).getTime();
            }

            $http({
              method:'POST',url:appConfig.API_SVC_URL + url,data:data,
              headers: {
                'Content-Type':'application/x-www-form-urlencoded',
                'x-login-key':userLoginInfoService.getLoginTicket()
              }
            }).success(function(data,status,headers,config)
            {
              var resp = data;
              if( errorCodeService.isSuccess(resp.code) ) {
                _postDefer.resolve(resp);
              }
              else {
                _postDefer.reject(errorCodeService.getErrorCodeDescription(resp.code));
              }
            }).error(function(data,status)
            {
              _postDefer.reject(httpErrorCodeService.getErrCodeDescription(status));
            });
            return _postDefer.promise;
          };

        var _get = function(url,params,onSuccessFn,onFailedFn,onHttpFailedFn) {
          $http({
            method:'GET',url:appConfig.API_SVC_URL + url,params:params,headers: {
              'Content-Type':'application/x-www-form-urlencoded',
              'x-login-key':userLoginInfoService.getLoginTicket()
            }
          }).success(function(data,status,headers,config)
            {
              var resp = data;
              if( errorCodeService.isSuccess(resp.code) ) {
                onSuccessFn(resp,status,headers,config);
              }
              else {
                onFailedFn(resp.code,data,status,headers,config);
              }
            }).error(function(data,status,headers,config)
            {
              onHttpFailedFn(data,status,headers,config);
            });
        };

        var _getForPromise = function(url,params) {
          var _getDefer = $q.defer();
          params._t = (new Date()).getTime();
          $http({
            method:'GET',url:appConfig.API_SVC_URL + url,params:params,headers: {
              'Content-Type':'application/x-www-form-urlencoded',
              'x-login-key':userLoginInfoService.getLoginTicket()
            }
          }).success(function(data,status,headers,config)
          {
            //$log.info('getForPromise url=' + url + ' response data=' + JSON.stringify(data));
            var resp = data;
            if( errorCodeService.isSuccess(resp.code) ) {
              _getDefer.resolve(resp.data);
            }
            else {
              _getDefer.reject(errorCodeService.getErrorCodeDescription(resp.code));
            }
          }).error(function(data,status)
          {
            _getDefer.reject(httpErrorCodeService.getErrorCodeDescription(status));
          });
          return _getDefer.promise;
        };

        return {
          post:_post,
          get:_get,
          getForPromise:_getForPromise,
          postForPromise:_postForPromise
        }
      }]).factory('uploadService',['$log',UploadServiceFactoryFn])
      .factory('downloadService',['$log',DownloadServiceFactoryFn])
    .factory('debugHelpService',['$log',DebugHelpServiceFactoryFn]);

    function DebugHelpServiceFactoryFn($log) {
      var obj2String = function (o){
        var r=[];
        if( o == null ) {
          return '';
        }
        if(typeof o=="string"){
          return "\""+o.replace(/([\'\"\\])/g,"\\$1").replace(/(\n)/g,"\\n").replace(/(\r)/g,"\\r").replace(/(\t)/g,"\\t")+"\"";
        }
        if(typeof o=="object"){

          if(!o.sort){
            for(var i in o){
              r.push(i+":"+obj2String(o[i]));
            }
            if(!!document.all&&!/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)){
              r.push("toString:"+o.toString.toString());
            }
            r="{"+r.join()+"}";
          }else{
            for(var i=0;i<o.length;i++){
              r.push(obj2String(o[i]))
            }
            r="["+r.join()+"]";
          }
          return r;
        }
        return o.toString();
      }

      var writeObj = function (obj){
        var description = "";
        for(var i in obj){
          var property=obj[i];
          description+=i+" = "+obj2String(property)+"\n";
        }
        $log.debug(description);
        return description;
      }

      return {
        writeObj:writeObj
      }
    }

    function UploadServiceFactoryFn($log) {
      var _uploadFile = function(fileUrl,serverUrl,headers,mimeType,onSuccess,onFailed) {
        var win = function (r) {
          $log.info("Code = " + r.responseCode);
          $log.info("Response = " + r.response);
          $log.info("Sent = " + r.bytesSent);
          onSuccess(fileUrl);
        }

        var fail = function (error) {
          $log.error("An error has occurred: Code = " + error.code);
          $log.error("upload error source " + error.source);
          $log.error("upload error target " + error.target);
          onFailed(fileUrl,error.code);
        }

        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = fileURL.substr(fileUrl.lastIndexOf('/') + 1);
        options.mimeType = mimeType;

        options.headers = headers;

        options.params = params;

        var ft = new FileTransfer();
        ft.upload(fileUrl, encodeURI(serverUrl), win, fail, options);
        return ft;
      };

      var _uploadImgFile = function(fileUrl,serverUrl,header,onSuccess,onFailed) {
        return _uploadFile(fileUrl,serverUrl,header,'image/jpeg',onSuccess,onFailed);
      }
      var _uploadAudioFile = function(fileUrl,serverUrl,header,onSuccess,onFailed) {

      };

      var _abortUpload = function(ftObject) {
        if( ftObject != null ) {
          ftObject.abort();
        }
      }

      return {
        uploadImgFile:_uploadImgFile,
        uploadAudioFile:_uploadAudioFile,
        abortUpload:_abortUpload
      };
    };

    function DownloadServiceFactoryFn($log) {
      var _downloadFile = function(fileUrl,serverUrl,headers,onSuccess,onFailed) {
        var fileTransfer = new FileTransfer();
        var uri = encodeURI(serverUrl);

        fileTransfer.download(
          uri,
          fileUrl,
          function(entry) {
            console.log("download complete: " + entry.toURL());
            onSuccess(fileUrl,serverUrl);
          },
          function(error) {
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("upload error code" + error.code);
            onFailed(fileUrl,serverUrl,error.code);
          },
          false,
          {
            headers: headers
          });
        return fileTransfer;
      }

      var _abortDownload = function(ftObject) {
        if( ftObject != null ) {
          ftObject.abort();
        }
      }

      return {
        downloadFile:_downloadFile,
        abortDownload:_abortDownload
      };
    };

  }
)();
