/**
 * Created by Midstream on 16/3/29.
 */

(function () {
  'use strict';

  angular.module('main.me')
    .controller('mainMeCtrl', ['$state', '$scope', '$ionicLoading', '$ionicPopup', '$ionicScrollDelegate', '$ionicActionSheet',
      '$timeout', '$interval', 'userNetService', 'impressUtils', 'userUtils',
      'errorCodeService','SharePageWrapService', mainMeCtrl])

  function mainMeCtrl($state, $scope, $ionicLoading, $ionicPopup, $ionicScrollDelegate, $ionicActionSheet,
                      $timeout, $interval, userNetService, impressUtils, userUtils,
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

      vm.meInfo.remoteData = selfInfo;

      //var impressUI = impressUtils.impressUI();
      ////vm.meInfo.ui_tags = vm.meInfo.remoteData.tags.concat();
      //vm.meInfo.ui_tags = [impressUI[0], impressUI[2], impressUI[3]];

      vm.meInfo.ui_tags = [];
      impressUtils.netTagsToUiTags(vm.meInfo.ui_tags, selfInfo.tags);


      $timeout(function () {
        $scope.$apply();
      });


      //// test:
      //vm._repeatList = userNetService.cache.selfInfo.attentionList;
      //for(var i = 0; i < 100; ++i ){
      //  vm._repeatList.push(userNetService.cache.selfInfo.attentionList)
      //}

      //vm.self.followList = [];
      //for(var i = 0; i < 3; i++){
      //
      //  vm.self.followList.push({
      //    avatar: '',
      //    nickname: 'fjjjjjjeeee',
      //    sign: 'fjeifj',
      //    recentTaskIdArray: [1,2]
      //  });
      //}

      // pre-calc
      var friends = userNetService.cache.selfInfo.attentionList;
      for(var i in friends){
        userUtils.uiProcessFollow(friends[i]);
      }

      friends = userNetService.cache.selfInfo.funsList;
      for(var i in friends) {
        userUtils.uiProcessFollowed(friends[i]);
      }

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
        //vm.self.repeatList = vm.self.friendList;
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

    //// visitors
    //self.visitors = [
    //  {
    //    url: 'http://t3.gstatic.cn/shopping?q=tbn:ANd9GcSCrdZNZUIlGriVTE3ZWMU_W5voV8527Q6PL8RGkMjtCFO1knnY6oIS1soNKN4&usqp=CAI'
    //  },
    //  {
    //    url: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=545887065,3542527475&fm=58'
    //  },
    //  {
    //    url: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=1902539898,1226346465&fm=58'
    //  },
    //  {
    //    url: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=4123988153,51280834&fm=58'
    //  },
    //  {
    //    url: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=4127652755,2340829936&fm=58'
    //  },
    //  //{
    //  //  url: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=1226112392,1303867474&fm=58g'
    //  //},
    //  //{
    //  //  url: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=1226112392,1303867474&fm=58g'
    //  //}
    //]
    //self.visitorImgWithIndex = function (index) {
    //  if (angular.isDefined(self.visitors[index])) {
    //    return self.visitors[index].url;
    //  } else {
    //    return '';
    //  }
    //}

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
    self.tabFollow = 0;

    self.ui_showFriendList = true;
    self.cb_tabFollow = function(index) {
      //if(index == 0) {
      //  //vm.self.repeatList = userNetService.cache.selfInfo.attentionList;
      //  //vm.self.repeatList = [];
      //  vm.self.repeatList = userNetService.cache.selfInfo.attentionList;
      //  self.ui_showFriendList = false;
      //  $timeout(function() {
      //    self.ui_showFriendList = true;
      //    //vm.self.repeatList = userNetService.cache.selfInfo.attentionList;
      //  },200);
      //}else { //index==1
      //  //vm.self.repeatList = userNetService.cache.selfInfo.funsList;
      //  vm.self.repeatList = userNetService.cache.selfInfo.funsList;
      //  self.ui_showFriendList = false;
      //  $timeout(function() {
      //    self.ui_showFriendList = true;
      //  },200);


      if(index == 0) {
        vm.self.repeatList = (userNetService.cache.selfInfo.attentionList)
          //.concat(userNetService.cache.selfInfo.attentionList);
        //vm.self.repeatList = vm.self.repeatList.concat(userNetService.cache.selfInfo.attentionList)

        //var xxx = []
        //for(var i = 0; i < 3; i++){
        //  xxx = xxx.concat(userNetService.cache.selfInfo.attentionList);
        //}
        //for(var i = 0; i < 300; i++){
        //  vm.self.repeatList.push({
        //    avatar: '',
        //    nickname: 'fjjjjjjeeee',
        //    sign: 'fjeifj'
        //  });
        //  //vm.self.repeatList.push(userNetService.cache.selfInfo.attentionList[i]);
        //}
        //vm.self.repeatList = xxx;
        //vm.self.repeatList = vm._repeatList;

        //vm.self.repeatList = vm.self.followList;

      }else { //index==1
        vm.self.repeatList = userNetService.cache.selfInfo.funsList;
        //vm.self.funsList = userNetService.cache.selfInfo.funsList;
      }

      self.tabFollow = index;

      //$timeout(function () {
      //  $scope.$apply();
      //});
    };

    // friend callbacks
    self.cb_follow = function(index) {
      var friend = vm.self.repeatList[index];

      $ionicLoading.show();
      userNetService.attention(friend.userId).then(
        function (data) {
          $ionicLoading.hide();
          $ionicLoading.show({
            duration: 1500,
            templateUrl: 'modules/components/templates/ionic-loading/user-follow-success.html'
          });

          friend = data.data
          vm.self.repeatList[index] = friend;
          //friend.isMutualAttention = true;

          var follow = ho.clone(friend);
          userUtils.uiProcessFollow(follow);
          userNetService.cache.selfInfo.attentionList.splice(0, 0, follow);

          userUtils.uiProcessFollowed(friend);

          //$timeout(function () {
          //  $scope.$apply();
          //});

        }, function (data) {
          $ionicLoading.hide();
          ho.alertObject(data);
        }).finally(function () {
        });
    };

    self.cb_postList = function(index) {

    };

    self.cb_cancelFocus = function($index) {
      $ionicActionSheet.show({
        titleText: "真的要取消关注么",
        buttons: [
          {text: "<b>是</b>"},
          {text: "<b>否</b>"}
        ],
        buttonClicked: function (index) {
          if(index == 0) {
            var friend = vm.self.repeatList[$index];

            $ionicLoading.show();
            userNetService.unattention(friend.userId).then(
              function (data) {
                $ionicLoading.hide();
                $ionicLoading.show({
                  duration: 1500,
                  templateUrl: 'modules/components/templates/ionic-loading/com-cancel-success.html'
                });

                // 如果互关注,取消funs里面的互关注状态
                if(friend.isMutualAttention) {
                  var funsList = userNetService.cache.selfInfo.funsList;
                  for(var i in funsList) {
                    if(funsList[i].userId == friend.userId) {
                      funsList[i].isMutualAttention = false;
                      userUtils.uiProcessFollowed(funsList[i]);
                      break;
                    }
                  }
                }

                userNetService.cache.selfInfo.attentionList.splice($index, 1);

              }, function (data) {
                $ionicLoading.hide();
                ho.alertObject(data);
              }).finally(function () {
              });
          }

          return true;
        },
        cancelText: "取消",
        cancel: function () {
          // add cancel code..
        },
        destructiveButtonClicked: function () {
        }
      })
    };


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
