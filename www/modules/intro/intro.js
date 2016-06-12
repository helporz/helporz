/**
 * Created by binfeng on 16/3/17.
 */
;(function(window) {
  "use strict";
    var intro = angular.module("com.helporz.intro",["ionic",'com.helporz.login', 'com.helporz.utils.service']);
    intro.controller("introCtrl",["$scope","$state",'$log','loginService','userLoginInfoService',
      function($scope,$state,$log,loginService,userLoginInfoService) {
      $scope.index = 0;
      $scope.onChanged = function(index) {
        if( index == 4){
          $state.go("login");
        }
      };

      $scope.enterApp = function() {
        if(loginService.isLogging()) {
          loginService.loginByTicket().then(function(){
            $log.info("登录成功");
          },function() {
            $state.go('login');
          });
        }
        else {
          $state.go('login');
        }

        userLoginInfoService.updateShowIntroInfo();
      }
    }]);
  }
)(this);


