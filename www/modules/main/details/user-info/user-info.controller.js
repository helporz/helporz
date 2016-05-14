/**
 * Created by Midstream on 16/4/25 .
 */

(function () {
  'use strict';

  angular.module('main.userInfo')
    .controller('mainUserInfoCtrl', ['$scope', '$timeout', '$state', '$stateParams', '$ionicLoading', 'taskNetService', 'userNetService', 'taskUtils',
      '$ionicHistory', mainUserInfoCtrl]);

  function mainUserInfoCtrl($scope, $timeout, $state, $stateParams, $ionicLoading, taskNetService, userNetService, taskUtils, $ionicHistory) {
    console.log($stateParams);

    var vm = $scope.vm = {};

    vm.userInfo = {};
    $scope.$on("$ionicView.enter", function () {
      vm.userInfo.remoteData = userNetService.cache.userInfo[$stateParams.id];
    });

    vm.userInfo.accessUserAvatar = function (index) {
      if (ho.isValid(vm.userInfo.remoteData)) {
        var size = vm.userInfo.remoteData.accessUserList.length;
        if (index < size) {
          return vm.userInfo.remoteData.accessUserList[index].avatar;
        } else {
          return '';
        }
      } else {
        return '';
      }
    }

    vm.cb_back = function () {
      $ionicHistory.goBack(-1);
    }


    vm.userInfo.cb_visitorImg = function (index) {
      console.log('click on image [' + index + ']');

      var user = vm.userInfo.remoteData.accessUserList[index];

      if (userNetService.cache.userInfo[user.userId]) {
        $state.go('main.user-info', {id: user.userId});
      }
      else {
        $ionicLoading.show();
        userNetService.getUserInfo(user.userId,
          function (data) {
            console.log(data);
            $state.go('main.user-info', {id: user.userId});
          },
          function (data, status) {
            $ionicPopup.alert({
              title: '错误提示',
              template: data.data.message
            }).then(function (res) {
              console.error(data);
            })
          });
        $ionicLoading.hide();
      }

    }

  };

})()
