/**
 * Created by Midstream on 16/3/29.
 */

(function () {
  'use strict';

  angular.module('main.me')
    .controller('mainMeCtrl', ['$state', '$scope', '$ionicScrollDelegate', '$timeout', '$interval', mainMeCtrl])

  function mainMeCtrl($state, $scope, $ionicScrollDelegate, $timeout, $interval) {
    var vm = $scope.vm = {};

    vm.cb_edit = function () {
      $state.go('main.edit');
    }
    vm.cb_setting =function() {
      $state.go('main.setting');
    }

    // me info
    vm.meInfo = {};

    vm.meInfo.avatar = 'http://t3.gstatic.cn/shopping?q=tbn:ANd9GcSCrdZNZUIlGriVTE3ZWMU_W5voV8527Q6PL8RGkMjtCFO1knnY6oIS1soNKN4&usqp=CAI';
    vm.meInfo.cb_avatar = function() {
      console.log('me avatar');
      //var arr = 'user-123'.split('-');
      //$state.go('main.user-info', {id: 'user-123'});
    }
    //////////////////////////////////////////////////
    // tab logic
    vm.meScroll = $ionicScrollDelegate.$getByHandle('meScroll');
    vm.activeTab = 0;
    vm.onChangeTab = function (index) {
      //vm.meScroll.scrollTop();
      //$state.go(href);

      vm.activeTab = index == 0 ? 0 : 1;
      $scope.$broadcast('changeTab', vm.activeTab);

      $timeout(function () {
        vm.meScroll.resize();
      }, 300);

      if(index==0){
        vm.self.repeatList = [];
      }
      else{
        vm.self.repeatList = vm.self.friendList;
      }
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
      $state.go('main.user-info', {id: 'user-'+index});
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

    self.repeatList = self.friendList;
  }


})()
