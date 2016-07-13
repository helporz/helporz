/**
 * Created by Midstream on 16/3/29.
 */

(function () {
  'use strict';

  angular.module('wall')
    .controller('wallCtrl', ['$state', '$scope', '$ionicHistory', '$ionicLoading', '$ionicPopup', '$ionicScrollDelegate',
      '$ionicActionSheet',
      '$cordovaCamera', '$cordovaImagePicker', '$timeout', '$interval', 'userNetService',
      'errorCodeService', 'schoolSelectService', 'SharePageService', wallCtrl])

  function wallCtrl($state, $scope, $ionicHistory, $ionicLoading, $ionicPopup, $ionicScrollDelegate,
                    $ionicActionSheet,
                    $cordovaCamera, $cordovaImagePicker, $timeout, $interval, userNetService, errorCodeService, schoolSelectService,
                    SharePageService) {
    var vm = $scope.vm = {};


    vm.ui_person = 12;
    vm.ui_hasEnter = "已加入华中科技大学";

    $scope.$on("$ionicView.enter", function () {

    });


    //////////////////////////////////////////////////
    // tab logic
    //vm.meScroll = $ionicScrollDelegate.$getByHandle('meScroll');
    vm.activeTab = 0;


    vm.cb_share = function () {
      var sheet = {};
      sheet.titleText = '召唤小伙伴';
      sheet.cancelText = '下次再说';
      sheet.buttonClicked = buttonClicked;
      sheet.buttons = [{
        text: '<i class="icon ion-at"></i> 分享给微信小伙伴'
      }, {
        text: '<i class="icon ion-chatbubbles"></i> 分享到微信朋友圈'
      }];

      $ionicActionSheet.show(sheet);

      function buttonClicked(index) {
        SharePageService.shareApp(index);
      }
    }

  }

})()
