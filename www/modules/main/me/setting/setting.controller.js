/**
 * Created by Midstream on 16/4/25 .
 */

(function(){
  'use strict';

  angular.module('main.setting')
    .controller('mainSettingCtrl', ['$scope', '$timeout', '$state', '$stateParams', 'taskNetService', 'taskUtils',
      'mainEditSheetService','SharePageWrapService', mainSettingCtrl]);

  function mainSettingCtrl($scope, $timeout, $state, $stateParams, taskNetService, taskUtils, mainEditSheetService,SharePageWrapService) {
    console.log($stateParams);

    var vm = $scope.vm = {};

    $scope.$on("$ionicView.beforeEnter", function() {

    });


    vm.cb_feedback = function() {
      mainEditSheetService.title = '意见与反馈';
      mainEditSheetService.isInputOrTextarea = false;
      mainEditSheetService.placeholder = '感谢您提出的宝贵意见';
      mainEditSheetService.className = 'textarea-big';
      $state.go('main.edit-sheet');
    }

    vm.cb_about = function(){
      $state.go('main.about');
    }
    vm.SharePageWrapService = SharePageWrapService;
  }
})()
