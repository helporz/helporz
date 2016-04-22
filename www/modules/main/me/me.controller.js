/**
 * Created by Midstream on 16/3/29.
 */

(function () {
  'use strict';

  angular.module('main.me')
    .controller('mainMeCtrl', ['$state', '$scope', '$ionicScrollDelegate', '$timeout', '$interval', mainMeCtrl])

  function mainMeCtrl($state, $scope, $ionicScrollDelegate, $timeout, $interval) {
    var vm = $scope.vm = {};

    vm.edit = function () {
      $state.go('main.me.friend');
    }

    // tab logic
    vm.meScroll = $ionicScrollDelegate.$getByHandle('meScroll');
    vm.activeTab = 0;
    vm.onChangeTab = function (index) {
      //vm.meScroll.scrollTop();
      //$state.go(href);

      vm.activeTab = index==0 ? 0 : 1;
      $scope.$broadcast('changeTab', vm.activeTab);

      $timeout(function(){
        vm.meScroll.resize();
      }, 300);
    };


    // self
    var self = vm.self = {};
    self.fiveStarsValue = 2.5;
    self.level = 25;
    self.hasExp = 1389;
    self.totalExp = 2320;

  }


})()
