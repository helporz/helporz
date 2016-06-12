/**
 * Created by Midstream on 16/3/29.
 */

(function () {
  'use strict';

  angular.module('wall')
    .controller('wallCtrl', ['$state', '$scope', '$ionicHistory', '$ionicLoading', '$ionicPopup', '$ionicScrollDelegate',
      '$ionicActionSheet',
      '$cordovaCamera', '$cordovaImagePicker', '$timeout', '$interval', 'userNetService',
      'errorCodeService', 'schoolSelectService', wallCtrl])

  function wallCtrl($state, $scope, $ionicHistory, $ionicLoading, $ionicPopup, $ionicScrollDelegate,
                    $ionicActionSheet,
                  $cordovaCamera, $cordovaImagePicker, $timeout, $interval, userNetService, errorCodeService, schoolSelectService) {
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
        //if (!window.Wechat) return;

        var title = "title";
        var thumbnail = null;
        var description = 'description';


        description += ' 图虫日报，精选每日图虫热门图片。'

        if (ho.isValid(window.cordova.plugins.Wechat) == false) {
          alert(window.cordova.plugins.Wechat);
        }
        Wechat.share({
          message: {
            title: title,
            description: description,
            thumb: 'http://ww2.sinaimg.cn/large/61ff0de3gw1emj19ju7p4j2030030745.jpg',
            media: {
              type: Wechat.Type.WEBPAGE,
              webpageUrl: 'http://www.helporz.com'
            }
          },
          scene: index
        });

        //window.cordova.plugins.Wechat.share({
        //  message: {
        //    title: title,
        //    description: description,
        //    thumb:  'http://ww2.sinaimg.cn/large/61ff0de3gw1emj19ju7p4j2030030745.jpg' ,
        //    media: {
        //      type: Wechat.Type.WEBPAGE,
        //      webpageUrl: post.url
        //    }
        //  },
        //  scene: index
        //});

      }
    }

  }

})()
