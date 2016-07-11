/**
 * Created by Midstream on 16/7/1.
 */

(function () {
  'use strict'

  angular.module('app.user.utils.service', [
    'com.helporz.user.netservice',
    'main.userInfo'
  ])

    //////////////////////////////////////////////////
    // taskUtils
    .factory('userUtils', ['userNetService', '$state', '$ionicLoading', '$ionicPopup','mainUserInfoService',
      function (userNetService, $state, $ionicLoading, $ionicPopup, mainUserInfoService) {

        return {
          uiProcessFollow: uiProcessFollow,
          uiProcessFollowed: uiProcessFollowed,
          gotoUser: gotoUser
        };

        function uiProcessFollow(friend) {
          friend.ui_showFollow = false;
          friend.ui_showNeedHelp = friend.recentTaskIdArray.length > 0;
          friend.ui_showHasFollow = friend.isMutualAttention == false ? 1 : 2;
        }

        function uiProcessFollowed(friend) {
          friend.ui_showFollow = friend.isMutualAttention == false;
          friend.ui_showNeedHelp = false;
          friend.ui_showHasFollow = friend.isMutualAttention == false ? 0 : 1;
        }

        function gotoUser(userId, tabPath) {
          if(ho.isValid(userId) == false || userId == ''){
            return;
          }
          //var user = vm.meInfo.remoteData.accessUserList[index];
          var fullState = 'main.' + tabPath + '_user-info';
          mainUserInfoService.tabPath = tabPath;

          if (userNetService.cache.userInfo[userId]) {
            $state.go(fullState, {id: userId});
          }
          else {
            $ionicLoading.show();
            userNetService.getUserInfo(userId,
              function (data) {
                console.log(data);
                $state.go(fullState, {id: userId});
                $ionicLoading.hide();
              },
              function (data, status) {
                $ionicPopup.alert({
                  title: '错误提示',
                  template: data.data.message
                }).then(function (res) {
                  console.error(data);
                });
                $ionicLoading.hide();
              });
          }
        }
      }]);
})()
