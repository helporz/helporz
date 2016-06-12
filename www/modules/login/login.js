/**
 * Created by binfeng on 16/3/3.
 */
;
(function (window) {
  "use strict;"

  angular.module('com.helporz.login', ['ngCordova', 'com.helporz.utils.service', 'com.helporz.user.netservice', 'com.helporz.jim.services'])
    .controller('loginCtrl', ['$q', '$scope', '$http', '$state', '$log',
      '$ionicLoading', 'deviceService', 'errorCodeService', 'httpErrorCodeService', 'userLoginInfoService', 'userNetService',
      'jimService', 'debugHelpService', loginCtrl])

    .directive('getsmscode', ['$http', '$log', 'pushService', function ($http, $log, pushService) {
      return {
        restrict: 'E',
        template: '<button class="button button-small col-30" style="background-color:#FB9494; color: #ffffff;">发送验证码</button>',

        link: function (scope, element, attrs) {
          console.log(element);
          element.bind('click', function (event) {
            var phoneNo = scope.phoneno;
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

            var hid = pushService.getCurrentReistrationID();
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
            });
          });
        }
      }
    }]);


  function loginCtrl($q, $scope, $http, $state, $log, $ionicLoading,
                     deviceService, errorCodeService, httpErrorCodeService,
                     userLoginInfoService, userNetService, jimService, debugHelpService) {
    $scope.phoneno = '';
    $scope.smscode = '';

    $scope.submitLogin = function (event) {
      var smscode = $scope.smscode,
        phoneNo = $scope.phoneno;
      console.log(phoneNo);
      var deviceInfo = deviceService.getDeviceInfo();

      $ionicLoading.show({
        template: "登录中..."
      });

      var loginTicket;

      $http({
        method: 'POST', url: appConfig.API_SVC_URL + "/user/verify_sms", data: {
          type: deviceInfo.type,
          userinfo: phoneNo, smscode: smscode
        }, headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
        .then(processLoginResponse, processLoginFailedResponse)
        .then(getSelfInfo, processFailed)
        .then(loginIM, processFailed)
        .then(function () {
          $ionicLoading.hide();

          if (userNetService.cache.selfInfo.avatar != ''){
            $state.go('main.near');
          } else {
            $state.go('info');
          }
        }, function (error) {
          $ionicLoading.hide();
          alert(error);
        });

      return;

      // 下面是内部方法定义
      function processLoginResponse(response) {
        var data = response.data, status = response.status, headers = response.headers, config = response.config;
        var httpSuccessDef = $q.defer();
        $log.info("success data:" + data + " status:" + status + " headers:" + headers + " config:" + config);

        debugHelpService.writeObj(data);

        var loginResponse = data;
        if (errorCodeService.isSuccess(loginResponse.code)) {
          httpSuccessDef.resolve(loginResponse.data.ticket);
          var userInfo = {};
          userInfo.phoneNo = phoneNo;
          userLoginInfoService.saveLoginInfo(loginResponse.data.ticket, userInfo);
        }
        else {
          httpSuccessDef.reject(errorCodeService.getErrorCodeDescription(loginResponse.code));
        }
        return httpSuccessDef.promise;
      }

      function processLoginFailedResponse(response) {
        var httpFailedDefer = $q.defer();
        httpFailedDefer.reject('访问服务器失败，网络状态码为' + response.status);
        return httpFailedDefer.promise;
      }


      function getSelfInfo(ticket) {
        loginTicket = ticket;
        return userNetService.getSelfInfoForPromise();
      }

      function processFailed(error) {
        var getUserInfoFailedDefer = $q.defer();
        getUserInfoFailedDefer.reject(error);
        return getUserInfoFailedDefer.promise;
      }

      function loginIM(userInfo) {
        userLoginInfoService.saveLoginInfo(loginTicket, userInfo);
        //return jimService.loginForPromise(userInfo.phoneNo + "-" + userInfo.userId, userInfo.imPassword);
        return jimService.testloginForPromise(userInfo.phoneNo + "-" + userInfo.userId, userInfo.imPassword);
      }
    }

  }

})(this);

