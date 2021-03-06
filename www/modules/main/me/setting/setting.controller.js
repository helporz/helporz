/**
 * Created by Midstream on 16/4/25 .
 */

(function(){
  'use strict';

  angular.module('main.setting')
    .controller('mainSettingCtrl', ['$scope', '$timeout', '$state', '$stateParams', 'taskNetService', 'taskUtils',
      'mainEditSheetService','SharePageWrapService', 'loginService',
      '$ionicLoading','feedbackService','$ionicHistory','promptService',
      mainSettingCtrl]);

  function mainSettingCtrl($scope, $timeout, $state, $stateParams, taskNetService, taskUtils,
                           mainEditSheetService,SharePageWrapService, loginService,
                           $ionicLoading, feedbackService,$ionicHistory, promptService) {
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
      mainEditSheetService.cb = function(txt) {
        $ionicLoading.hide();
        feedbackService.feedback(txt).then(
          function (data) {
            $ionicLoading.show({
              duration: 1500,
              templateUrl: 'modules/components/templates/ionic-loading/com-submit-success.html'
            });
            $timeout(function () {
              $ionicHistory.goBack(-1);
            }, 1500);
          }, function (err) {
            promptService.promptMessage(err, 1500);
          }).finally(function () {
          });
        return true;
      };
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
          promptService.promptErrorInfo(data, 1500);
        }).finally(function () {
        });
    }

    vm.SharePageWrapService = SharePageWrapService;
  }
})()
