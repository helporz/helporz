/**
 * Created by Midstream on 16/3/29.
 */

(function () {
  'use strict';

  angular.module('info')
    .controller('infoCtrl', ['$state', '$scope', '$ionicLoading', '$ionicPopup', '$ionicScrollDelegate', '$ionicActionSheet',
      '$timeout', '$interval', 'userNetService',
      'errorCodeService', infoCtrl])

  function infoCtrl($state, $scope, $ionicLoading, $ionicPopup, $ionicScrollDelegate, $ionicActionSheet,
                      $timeout, $interval, userNetService, errorCodeService) {
    var vm = $scope.vm = {};

    vm.info = {
      avatar: "",
    }

    vm.info.cb_gender = function () {
      $state.go('main.edit');
    }
    vm.info.cb_school = function () {
      $state.go('searchSchool');
    }

    vm.info.cb_avator = function() {

    }

    vm.info.onChangeTab = function(index) {

    }




    $scope.$on("$ionicView.enter", function () {

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

      //vm.meInfo.remoteData = selfInfo;
      //
      //$timeout(function () {
      //  $scope.$apply();
      //});
    });


    //////////////////////////////////////////////////
    // tab logic
    //vm.meScroll = $ionicScrollDelegate.$getByHandle('meScroll');
    vm.activeTab = 0;


  }


})()
