/**
 * Created by binfeng on 16/3/3.
 */
;(function(window) {
  "use strict;"

  angular.module('com.helporz.login',['ngCordova','com.helporz.utils.service']).controller('loginCtrl',['$scope','$http','$state','$log',
    '$ionicLoading', 'deviceService','errorCodeService','httpErrorCodeService','userLoginInfoService',loginCtrl])

    .directive('getsmscode', [ '$http','$log','pushService',function($http,$log,pushService) {
      return {
        restrict:'E',
        template:'<button class="button button-small col-30" style="background-color:#FB9494; color: #ffffff;">发送验证码</button>',

        link:function(scope,element,attrs){
          console.log(element);
          element.bind('click', function(event) {
            var phoneNo = scope.phoneno;
            console.log(phoneNo);
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

            var hid = pushService.getCurrentReistrationID();
            if( hid != null ) {
              deviceInfo.hid = hid;
              $log.info("device hid:" + hid);
            }
            else {
              $log.error("can't get hid");
            }

            var deviceInfoString = JSON.stringify(deviceInfo);
            $http({method:'POST',url:appConfig.API_SVC_URL + "/user/dynamic_login",
              data:{userLoginInfo:phoneNo,terminalInfo:deviceInfoString},headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }}).success(function() {
              $log.info("dynamic login success");
            }).error(function(event) {
                $log.error('dynamic login failed');
              $log.error(event);
            });
          });
        }
      }
    }]);


  function loginCtrl($scope,$http,$state,$log,$ionicLoading,deviceService,errorCodeService,httpErrorCodeService,userLoginInfoService) {
    $scope.phoneno = '';
    $scope.smscode = '';

    $scope.submitLogin = function(event) {
      var smscode = $scope.smscode,
        phoneNo = $scope.phoneno;
        console.log(phoneNo);
        var deviceInfo = deviceService.getDeviceInfo();

      $ionicLoading.show({
        template:"登录中..."
      });
        $http({method:'POST',url:appConfig.API_SVC_URL + "/user/verify_sms",data:{ type:deviceInfo.type,
            userinfo:phoneNo,smscode:smscode},headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }}).success(function(data,status,headers,config) {
          $log.info("success data:" + data + " status:" + status + " headers:" + headers +  " config:" + config);
          var loginResponse = angular.json.parse(data);
          if( errorCodeService.isSuccess(loginResponse.code)) {
            var ticket = loginResponse.data.ticket;
            userLoginInfoService.saveLoginInfo(ticket,phoneNo);

            $ionicLoading.hide();
            $state.go('main.near');

          }
          else {
            $ionicLoading.hide();
              alert(errorCodeService.getErrorCodeDescription(loginResponse.code));
          }
        }).error(function(data,status,headers,config) {
          $ionicLoading.hide();
          $log.error("failed data:" + data + " status:" + status + " headers:" + headers +  " config:" + config);
          alert(httpErrorCodeService.getErrorCodeDescription(status));
        });

    }

  }

})(this);

