/**
 * Created by Midstream on 16/4/25 .
 */

(function(){
  'use strict';

  angular.module('main.setting')
    .controller('mainSettingCtrl', ['$scope', '$timeout', '$state', '$stateParams', 'taskNetService', 'taskUtils',
      'mainEditSheetService','SharePageWrapService', 'loginService',
      '$ionicLoading',
      mainSettingCtrl]);

  function mainSettingCtrl($scope, $timeout, $state, $stateParams, taskNetService, taskUtils,
                           mainEditSheetService,SharePageWrapService, loginService,
                           $ionicLoading) {
    console.log($stateParams);

    var vm = $scope.vm = {};

    $scope.$on("$ionicView.beforeEnter", function() {

    });


    vm.cb_feedback = function() {
      mainEditSheetService.title = '意见与反馈';
      mainEditSheetService.isInputOrTextarea = false;
      mainEditSheetService.placeholder = '感谢您提出的宝贵意见';
      mainEditSheetService.className = 'textarea-big';
      mainEditSheetService.max = 280;
      $state.go('main.edit-sheet');
    }

    vm.cb_about = function(){
      $state.go('main.about');
    }

    vm.cb_logout = function() {
      $ionicLoading.show();
      loginService.logout().then(
        function (data) {
          $ionicLoading.hide();
          //$state.go('login');
          $ionicLoading.show({
            duration: 1500,
            templateUrl: 'modules/components/templates/ionic-loading/user-logout-success.html'
          });
          $timeout(function () {
            $ionicLoading.hide();
            $state.go('login');
          }, 1500);

        }, function (data) {
          $ionicLoading.hide();
          ho.alertObject(data);
        }).finally(function () {
        });
    }

    vm.SharePageWrapService = SharePageWrapService;
  }
})()
