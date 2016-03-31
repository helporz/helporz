/**
 * Created by binfeng on 16/3/3.
 */
;(function(window) {
  "use strict;"

  angular.module('com.helporz.login',['ngCordova']).controller('loginCtrl',['$scope','$http',loginCtrl])
    .controller('dynamicLogin',function($scope) {

      $http.post('login/dynamic_login',{}).success(
        function() {

        }
      ).error(
        function() {

        }
      );
    })
    .controller('verifySMS',function($scope) {
      $http.post('login/verify_sms',{}).success(
        function() {

        }
      ).error(
        function() {

        }
      );
    })
    .directive('getsmscode', [ '$http',function($http) {
      return {
        restrict:'E',
        template:'<button class="button button-small col-30" style="background-color:#FB9494; color: #ffffff;">发送验证码</button>',

        link:function(scope,element,attrs){
          console.log(element);
          //var dynamicLoginBtn = element.children("#dynamicLoginBtn");
          //console.log(dynamicLoginBtn);
          //
          //dynamicLoginBtn.bind('mouseenter',function(event) {
          //  console.log(event);
          //});

          //element.bind('mousedown',function(event) {
          //  console.log('getsmscode mouse enter');
          //});

          element.bind('click', function(event) {
            var phoneNo = scope.phoneno;
            console.log(phoneNo);
            var deviceInfo = {type:2,os:"android",hid:"111",imsi:"123"};
            var deviceInfoString = JSON.stringify(deviceInfo);
            $http({method:'POST',url:appConfig.API_SVC_URL + "/user/dynamic_login",data:{userLoginInfo:phoneNo,terminalInfo:deviceInfoString},headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }}).success(function() {
              console.log("success");
            }).error(function(event) {
              console.log(event);
            });
          });
        }
      }
    }]);


  function loginCtrl($scope,$http,$state) {
    $scope.phoneno = '';
    $scope.smscode = '';

    $scope.submitLogin = function(event) {
      var smscode = $scope.smscode,
        phoneNo = $scope.phoneno;
        console.log(phoneNo);
        var deviceInfo = {type:2,os:"android",hid:"111",imsi:"123"};
        $http({method:'POST',url:appConfig.API_SVC_URL + "/user/verify_sms",data:{ type:1, userinfo:phoneNo,smscode:smscode},headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }}).success(function() {
          console.log("success");
        }).error(function(event) {
          console.log(event);
        });

      //lkj test:
      $state.go("main.near")
    }

    //document.addEventListener("deviceready", function () {
    //
    //  var device = $cordovaDevice.getDevice();
    //
    //  var cordova = $cordovaDevice.getCordova();
    //
    //  var model = $cordovaDevice.getModel();
    //
    //  var platform = $cordovaDevice.getPlatform();
    //
    //  var uuid = $cordovaDevice.getUUID();
    //
    //  var version = $cordovaDevice.getVersion();
    //
    //  console.log($cordovaDevice);
    //
    //}, false);

    //$scope.dynamicLogin = function(event) {
    //$scope.dynamicLogin = function(event,type) {
    //  var phoneNo = scope.userinfo.phoneno;
    //  console.log(phoneNo);
    //  var deviceInfo = {type:2,os:"android",hid:"111",imsi:"123"};
    //  $http({method:'POST',url:appConfig.API_SVC_URL + "/user/dynamic_login",data:{userLoginInfo:phoneNo,terminalInfo:deviceInfo},headers: {
    //    'Content-Type': 'application/x-www-form-urlencoded'
    //  }}).success(function() {
    //    console.log("success");
    //  }).error(function(event) {
    //    console.log(event);
    //  });
    //};

  }

})(this);


//$http({
//  url: 'your/webservice',
//  method: 'POST',
//  responseType: 'arraybuffer',
//  data: json, //this is your json data string
//  headers: {
//    'Content-type': 'application/json',
//    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//  }
//}).success(function(data){
//  var blob = new Blob([data], {
//    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//  });
//  saveAs(blob, 'File_Name_With_Some_Unique_Id_Time' + '.xlsx');
//}).error(function(){
//  //Some error log
//});
