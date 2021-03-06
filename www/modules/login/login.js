/**
 * Created by binfeng on 16/3/3.
 */
;
(function (window) {
  "use strict;"

  angular.module('com.helporz.login', ['ngCordova', 'com.helporz.utils.service', 'com.helporz.user.netservice', 'com.helporz.jim.services',
    'com.helporz.playground', 'com.helporz.task.netservice', 'com.helporz.task.noticemessage'])
    .factory('loginService', loginServiceFn)
    .controller('loginCtrl', loginCtrl)
    .directive('getsmscode', ['$http', '$log', 'pushService', 'promptService', function ($http, $log, pushService, promptService) {
      return {
        restrict: 'E',
        replace: true,
        template: '<button class="button button-small" >发送验证码</button>',

        link: function (scope, element, attrs) {
          console.log(element);
          element.bind('click', function (event) {
            var phoneNo = scope.phoneno;
            if( phoneNo === null || phoneNo.length == 0 ) {
              promptService.promptMessage('请输入手机号',2000);
              return ;
            }

            console.log(phoneNo);
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
            }
            else {
              $log.error("undefined device");
            }

            var hid = pushService.getCurrentRegistrationID();
            if (hid != null && hid !== '') {
              deviceInfo.hid = hid;
              $log.info("device hid:" + hid);
            }
            else {
              $log.error("can't get hid");
            }

            var deviceInfoString = JSON.stringify(deviceInfo);
            $http({
              method: 'POST', url: appConfig.API_SVC_URL + "/user/dynamic_login",
              data: {userLoginInfo: phoneNo, terminalInfo: deviceInfoString}, headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).success(function () {
              $log.info("dynamic login success");
            }).error(function (event) {
              $log.error('dynamic login failed');
              $log.error(event);
              promptService.promptMessage('发送验证码失败，请稍后重试', 1500);
            });
          });
        }
      }
    }]);


  loginCtrl.$inject = ['$scope', '$state', '$log', '$ionicLoading', 'loginService', 'userNetService','taskNetService','promptService'];
  function loginCtrl($scope, $state, $log, $ionicLoading, loginService, userNetService, taskNetService,promptService) {
    $scope.phoneno = '';
    $scope.smscode = '';

    $scope.isAgreeProtocol = true;

    $scope.submitLogin = function (event) {
      if($scope.isAgreeProtocol == false) {
        //$ionicLoading.show({
        //  duration: 1500,
        //  template: '请同意《用户使用协议》'
        //});
        promptService.promptMessage('请同意《用户使用协议》', 1500);
        return;
      }
      var smsCode = $scope.smscode,
        phoneNo = $scope.phoneno;
      console.log(phoneNo);
      //var deviceInfo = deviceService.getDeviceInfo();

      if( smsCode === null || smsCode.length == 0 ) {
        promptService.promptMessage('请输入验证码',2000);
        return ;
      }

      if( phoneNo === null || phoneNo.length == 0 ) {
        promptService.promptMessage('请输入手机号',2000);
        return ;
      }

      $ionicLoading.show({
        template: "登录中..."
      });

      //var loginTicket;
      loginService.login(phoneNo, smsCode).then(function () {
        $ionicLoading.hide();

        if (userNetService.cache.selfInfo.avatar != '') {
          $state.go('main.near');

          taskNetService.observeNoticeMessage();
          taskNetService.fetchNoticeMessage();
        }
        else {
          $state.go('info');
        }
      }, function (error) {
        $ionicLoading.hide();
        promptService.promptErrorInfo(error, 1500);
      });

      return;

      //$http({
      //  method: 'POST', url: appConfig.API_SVC_URL + "/user/verify_sms", data: {
      //    type: deviceInfo.type,
      //    userinfo: phoneNo, smscode: smscode
      //  }, headers: {
      //    'Content-Type': 'application/x-www-form-urlencoded'
      //  }
      //})
      //  .then(processLoginResponse, processLoginFailedResponse)
      //  .then(getSelfInfo, processFailed)
      //  .then(loginIM, processFailed)
      //  .then(function () {
      //    $ionicLoading.hide();
      //    PlaygroundStartupService.initService(userLoginInfoService.getLoginInfo().userInfo.userId);
      //    $state.go('main.near');
      //  }, function (error) {
      //    $ionicLoading.hide();
      //    alert(error);
      //  });
      //
      //return;

      // 下面是内部方法定义
      //function processLoginResponse(response) {
      //  var data = response.data, status = response.status, headers = response.headers, config = response.config;
      //  var httpSuccessDef = $q.defer();
      //  $log.info("success data:" + data + " status:" + status + " headers:" + headers + " config:" + config);
      //
      //  debugHelpService.writeObj(data);
      //
      //  var loginResponse = data;
      //  if (errorCodeService.isSuccess(loginResponse.code)) {
      //    httpSuccessDef.resolve(loginResponse.data.ticket);
      //    var userInfo = {};
      //    userInfo.phoneNo = phoneNo;
      //    userLoginInfoService.saveLoginInfo(loginResponse.data.ticket, userInfo);
      //  }
      //  else {
      //    httpSuccessDef.reject(errorCodeService.getErrorCodeDescription(loginResponse.code));
      //  }
      //  return httpSuccessDef.promise;
      //}
      //
      //function processLoginFailedResponse(response) {
      //  var httpFailedDefer = $q.defer();
      //  httpFailedDefer.reject('访问服务器失败，网络状态码为' + response.status);
      //  return httpFailedDefer.promise;
      //}
      //
      //
      //function getSelfInfo(ticket) {
      //  loginTicket = ticket;
      //  return userNetService.getSelfInfoForPromise();
      //}
      //
      //function processFailed(error) {
      //  var getUserInfoFailedDefer = $q.defer();
      //  getUserInfoFailedDefer.reject(error);
      //  return getUserInfoFailedDefer.promise;
      //}
      //
      //function loginIM(userInfo) {
      //  userLoginInfoService.saveLoginInfo(loginTicket, userInfo);
      //  //return jimService.loginForPromise(userInfo.phoneNo + "-" + userInfo.userId, userInfo.imPassword);
      //  return jimService.testloginForPromise(userInfo.phoneNo + "-" + userInfo.userId, userInfo.imPassword);
      //}
    }

  }

  loginServiceFn.$inject = ['$ionicHistory', '$q', '$http', '$log', '$ionicLoading', 'deviceService', 'errorCodeService', 'httpErrorCodeService',
    'userLoginInfoService', 'userNetService', 'jimService', 'debugHelpService', 'PlaygroundStartupService',
    'utilConvertDateToString', 'taskNetService', 'NoticeMessageService', 'IMInterfaceService','taskNetService',
  'promptService'];
  function loginServiceFn($ionicHistory, $q, $http, $log, $ionicLoading, deviceService, errorCodeService, httpErrorCodeService,
                          userLoginInfoService, userNetService, jimService, debugHelpService, PlaygroundStartupService,
                          utilConvertDateToString, taskNetService, NoticeMessageService, IMInterfaceService,taskNetService,
                          promptService) {
    var loginTicket;
    var _login = function (phoneNo, smsCode) {
      var deviceInfo = deviceService.getDeviceInfo();
      //var _innerDefer = $q.defer();
      //$http({
      //  method: 'POST', url: appConfig.API_SVC_URL + "/user/verify_sms", data: {
      //    type: deviceInfo.type,
      //    userinfo: phoneNo, smscode: smsCode
      //  }, headers: {
      //    'Content-Type': 'application/x-www-form-urlencoded'
      //  }
      //})
      var netPromise = userNetService.login(deviceInfo.type, phoneNo, smsCode,JSON.stringify(deviceInfo));
      return _loginProcessForPromise(netPromise);
      //  userNetService.login(deviceInfo.type,phoneNo,smsCode)
      //  .then(processLoginResponse, processLoginFailedResponse)
      //  .then(getSelfInfo, processFailed)
      //  .then(loginIM, processFailed)
      //  .then(function () {
      //    PlaygroundStartupService.initService(userLoginInfoService.getLoginInfo().userInfo.userId);
      //    _innerDefer.resolve();
      //  }, function (error) {
      //    _innerDefer.reject();
      //  });
      //
      //return _innerDefer.promise;
    }

    var _loginByTicket = function () {
      var _innerDefer = $q.defer();
      var loginTicket = userLoginInfoService.getLoginTicket();
      if (loginTicket == null || loginTicket === '') {
        _innerDefer.reject();
        return _innerDefer.promise;
      }

      var deviceInfo = deviceService.getDeviceInfo();
      var date = utilConvertDateToString.getDateToString(new Date, 'yyyy-MM-dd HH:mm:ss');
      var netPromise = userNetService.loginByTicket(loginTicket, date,JSON.stringify(deviceInfo));
      return _loginProcessForPromise(netPromise);

      //userNetService.loginByTicket(loginTicket,date).then(processLoginResponse, processLoginFailedResponse)
      //  .then(getSelfInfo, processFailed)
      //  .then(loginIM, processFailed)
      //  .then(function () {
      //    PlaygroundStartupService.initService(userLoginInfoService.getLoginInfo().userInfo.userId);
      //    _innerDefer.resolve();
      //  }, function (error) {
      //    _innerDefer.reject();
      //  });
      //
      //return _innerDefer.promise;
    }

    var _loginProcessForPromise = function (netPromise) {
      var _innerDefer = $q.defer();
      netPromise.then(processLoginResponse, processLoginFailedResponse)
        .then(getSelfInfo, processFailed)
        .then(loginIM, processFailed)
        .then(function () {
          var userId = userLoginInfoService.getLoginInfo().userInfo.userId;
          PlaygroundStartupService.initService(userId);
          NoticeMessageService.initService(userId);
          taskNetService.initFlags();   //lkj: 换账号登陆后,任务列表需要重刷
          $ionicHistory.clearHistory();
          _innerDefer.resolve();
        }, function (error) {
          _innerDefer.reject(error);
        });
      return _innerDefer.promise;
    }
    var _logout = function () {
      var _innerDefer = $q.defer();
      var loginTicket = userLoginInfoService.getLoginTicket();
      if (loginTicket == null || loginTicket === '') {
        _innerDefer.resolve;
        return _innerDefer.promise;
      }

      userNetService.logout(loginTicket, 'sign').then(function () {
        jimService.logout();
        userLoginInfoService.clear();
        _innerDefer.resolve();
        $ionicHistory.clearHistory();
      }, function (err) {
        //即使调用服务器接口失败也要清除本地用户登陆数据
        jimService.logout();
        userLoginInfoService.clear();
        _innerDefer.resolve();
        $ionicHistory.clearHistory();
        promptService.promptErrorInfo(err, 1500);
      });

      return _innerDefer.promise;
    }

    var _isLogging = function () {
      var loginTicket = userLoginInfoService.getLoginTicket();
      if (loginTicket == null || loginTicket === '') {
        return false;
      }
      return true;
    }

    var _isShowIntro = function () {
      return userLoginInfoService.isShowIntro();
    }

    return {
      login: _login,
      loginByTicket: _loginByTicket,
      isLogging: _isLogging,
      isShowIntro: _isShowIntro,
      logout: _logout,
    }
    // 下面是内部方法定义
    function processLoginResponse(response) {
      var httpSuccessDef = $q.defer();

      httpSuccessDef.resolve(response.data.ticket);
      var userInfo = {};
      userLoginInfoService.saveLoginInfo(response.data.ticket, userInfo);

      return httpSuccessDef.promise;
    }

    function processLoginFailedResponse(error) {
      var httpFailedDefer = $q.defer();
      httpFailedDefer.reject(error);
      return httpFailedDefer.promise;
    }


    function getSelfInfo(ticket) {
      loginTicket = ticket;
      return userNetService.getSelfInfoForPromise();
    }

    function processFailed(error) {
      var getUserInfoFailedDefer = $q.defer();
      getUserInfoFailedDefer.reject(error);
      //promptService.promptErrorInfo(error, 1500);
      return getUserInfoFailedDefer.promise;
    }

    function loginIM(userInfo) {
      var _innerDefer = $q.defer();
      userLoginInfoService.saveLoginInfo(loginTicket, userInfo);
      IMInterfaceService.initService(userInfo.userId)
        .then(
        function () {
          return jimService.loginForPromise(userInfo.imLoginName, userInfo.imPassword);
        }, function (error) {
          $log.error("init im interface service failed:" + error);
          //promptService.promptErrorInfo(error, 1500);
          var _loginFailedDefer = $q.defer();
          _loginFailedDefer.reject(error);
          return _loginFailedDefer.promise;
        }
      )
        .then(
        function () {
          $log.info("登录IM成功");
          _innerDefer.resolve();
        }, function (error) {
          $log.error('登录IM失败 #loginName# #password#:#error#'
            .replace('#loginName#', userInfo.imLoginName)
            .replace('#password#', userInfo.imPassword)
            .replace('#error#', error));

          if (g_isDebug) {
            _innerDefer.resolve();
          }
          else {
            _innerDefer.reject(error);
          }
        });
      return _innerDefer.promise;
      //return jimService.testloginForPromise(userInfo.imLoginName, userInfo.imPassword);
    }
  }
})(this);

