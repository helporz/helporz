/**
 * Created by Midstream on 16/3/29.
 */

(function () {
  'use strict';

  angular.module('main.me')
    .controller('mainMeCtrl', ['$log','$state', '$scope', '$ionicLoading', '$ionicPopup', '$ionicScrollDelegate', '$ionicActionSheet',
      '$timeout', '$interval', 'userNetService', 'impressUtils',
      'errorCodeService','SharePageWrapService', mainMeCtrl])

  function mainMeCtrl($log,$state, $scope, $ionicLoading, $ionicPopup, $ionicScrollDelegate, $ionicActionSheet,
                      $timeout, $interval, userNetService, impressUtils,
                      errorCodeService,SharePageWrapService) {
    var vm = $scope.vm = {};

    vm.cb_edit = function () {
      $state.go('main.edit');
    }
    vm.cb_setting = function () {
      $state.go('main.setting');
    }

    vm.cb_share = function () {
      SharePageWrapService.shareApp();
      //var sheet = {};
      //sheet.titleText = '与朋友们分享好图';
      //sheet.cancelText = '算了';
      //sheet.buttonClicked = buttonClicked;
      //sheet.buttons = [{
      //  text: '<i class="icon ion-at"></i> 分享给微信小伙伴'
      //}, {
      //  text: '<i class="icon ion-chatbubbles"></i> 分享到微信朋友圈'
      //}, {
      //  text: '<i class="icon ion-star"></i> 添加到微信收藏夹'
      //}];


      //$ionicActionSheet.show(sheet);

      //function buttonClicked(index) {
      //  //if (!window.Wechat) return;
      //
      //  var title = "title";
      //  var thumbnail = null;
      //  var description = 'description';
      //
      //
      //  description += ' 图虫日报，精选每日图虫热门图片。'
      //
      //  if (ho.isValid(window.cordova.plugins.Wechat) == false) {
      //    alert(window.cordova.plugins.Wechat);
      //  }
      //  Wechat.share({
      //    message: {
      //      title: title,
      //      description: description,
      //      thumb: 'http://ww2.sinaimg.cn/large/61ff0de3gw1emj19ju7p4j2030030745.jpg',
      //      media: {
      //        type: Wechat.Type.WEBPAGE,
      //        webpageUrl: 'http://www.helporz.com'
      //      }
      //    },
      //    scene: index
      //  });
      //
      //  //window.cordova.plugins.Wechat.share({
      //  //  message: {
      //  //    title: title,
      //  //    description: description,
      //  //    thumb:  'http://ww2.sinaimg.cn/large/61ff0de3gw1emj19ju7p4j2030030745.jpg' ,
      //  //    media: {
      //  //      type: Wechat.Type.WEBPAGE,
      //  //      webpageUrl: post.url
      //  //    }
      //  //  },
      //  //  scene: index
      //  //});
      //
      //}
    }

    vm.cb_im = function() {
      $log.info('跳转到IM列表页');
      $state.go('main.im');
    }

    // me info
    vm.meInfo = {};

    vm.meInfo.cb_avatar = function () {
      console.log('me avatar');
      //var arr = 'user-123'.split('-');
      //$state.go('main.user-info', {id: 'user-123'});
    }

    $scope.$on("$ionicView.beforeEnter", function () {

      var selfInfo = userNetService.cache.selfInfo;

      //vm.meInfo.accessUserList = selfInfo.accessUserList || [];
      //vm.meInfo.nickname = selfInfo.nickname;
      //vm.meInfo.sign = selfInfo.sign;
      //vm.meInfo.avatar = selfInfo.avator || '';
      //vm.meInfo.completedTaskCount = selfInfo.completedTaskCount;
      //vm.meInfo.credit = selfInfo.credit || 0;
      //vm.meInfo.department = selfInfo.department || '';
      //vm.meInfo.dormitory = selfInfo.dormitory;
      //
      //vm.meInfo.experience = selfInfo.experience || 0;
      //vm.meInfo.funsCount = selfInfo.funsCount || 0;
      //
      //vm.meInfo.gem = selfInfo.gem;
      //vm.meInfo.gender = selfInfo.gender;
      //vm.meInfo.helpUserCount = selfInfo.helpUserCount;
      //vm.meInfo.hometown = selfInfo.hometown;
      //vm.meInfo.level = selfInfo.level;
      //
      //vm.meInfo.userPropInfoList = selfInfo.userPropInfoList;

      vm.meInfo.remoteData = selfInfo;

      var impressUI = impressUtils.impressUI();
      //vm.meInfo.ui_tags = vm.meInfo.remoteData.tags.concat();
      vm.meInfo.ui_tags = [impressUI[0], impressUI[2], impressUI[3]];

      $timeout(function () {
        $scope.$apply();
      });
    });

    vm.meInfo.accessUserAvatar = function (index) {
      if (ho.isValid(vm.meInfo.remoteData)) {
        var size = vm.meInfo.remoteData.accessUserList.length;
        if (index < size) {
          return vm.meInfo.remoteData.accessUserList[index].avatar;
        } else {
          return '';
        }
      } else {
        return '';
      }
    }

    //////////////////////////////////////////////////
    // tab logic
    vm.meScroll = $ionicScrollDelegate.$getByHandle('meScroll');
    vm.activeTab = 0;
    vm.onChangeTab = function (index) {
      //vm.meScroll.scrollTop();
      //$state.go(href);

      $timeout(function () {
        vm.meScroll.resize();
      }, 300);

      if (index == 0) {
        vm.self.repeatList = [];
      }
      else {
        vm.self.repeatList = vm.self.friendList;
      }

      console.log('xxx'+ho.trace(vm.self.repeatList));

      vm.activeTab = index == 0 ? 0 : 1;
    };

    ////test:
    //vm.onChangeTab(0);

    //////////////////////////////////////////////////
    // self
    var self = vm.self = {};

    // stars
    self.fiveStarsValue = 2.5;

    // level
    self.level = 25;
    self.hasExp = 1389;
    self.totalExp = 2320;

    // belongings
    self.smallCards = 10;
    self.bigCards = 20;

    // visitors
    self.visitors = [
      {
        url: 'http://t3.gstatic.cn/shopping?q=tbn:ANd9GcSCrdZNZUIlGriVTE3ZWMU_W5voV8527Q6PL8RGkMjtCFO1knnY6oIS1soNKN4&usqp=CAI'
      },
      {
        url: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=545887065,3542527475&fm=58'
      },
      {
        url: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=1902539898,1226346465&fm=58'
      },
      {
        url: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=4123988153,51280834&fm=58'
      },
      {
        url: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=4127652755,2340829936&fm=58'
      },
      //{
      //  url: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=1226112392,1303867474&fm=58g'
      //},
      //{
      //  url: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=1226112392,1303867474&fm=58g'
      //}
    ]
    self.visitorImgWithIndex = function (index) {
      if (angular.isDefined(self.visitors[index])) {
        return self.visitors[index].url;
      } else {
        return '';
      }
    }

    self.cb_visitorImg = function (index) {
      console.log('click on image [' + index + ']');

      var user = vm.meInfo.remoteData.accessUserList[index];

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

    //////////////////////////////////////////////////
    // friend
    self.friendList = [
      {
        name: '小刚',
        desc: '华中科技大学 光电子系',
        follow: false
      },
      {
        name: '小刚',
        desc: '华中科技大学 光电子系',
        follow: true
      },
      {
        name: '小刚',
        desc: '华中科技大学 光电子系',
        follow: true
      },
      {
        name: '小刚',
        desc: '华中科技大学 光电子系',
        follow: false
      },
      {
        name: '小刚',
        desc: '华中科技大学 光电子系',
        follow: false
      },
      {
        name: '小刚',
        desc: '华中科技大学 光电子系',
        follow: false
      },
      {
        name: '小刚',
        desc: '华中科技大学 光电子系',
        follow: true
      },
      {
        name: '小刚',
        desc: '华中科技大学 光电子系',
        follow: true
      },
      {
        name: '小刚',
        desc: '华中科技大学 光电子系',
        follow: false
      },
      {
        name: '小刚',
        desc: '华中科技大学 光电子系',
        follow: false
      }
    ]

    self.repeatList = [];
  }


})()
