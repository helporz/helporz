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
    .factory('userUtils', ['userNetService', '$state', '$ionicLoading', '$ionicPopup', '$location','$log','mainUserInfoService',
      function (userNetService, $state, $ionicLoading, $ionicPopup, $location,$log, mainUserInfoService) {

        return {
          uiProcessFollow: uiProcessFollow,
          uiProcessFollowed: uiProcessFollowed,
          gotoUser: gotoUser,
          gotoIM:gotoIM,
          gotoUserTasks:gotoUserTasks,
          gotoTaskDetail:gotoTaskDetail,
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

        function gotoIM(userId) {
          if(ho.isValid(userId) == false || userId == ''){
            return;
          }

          var pathList = $location.path().split('/');

          if( pathList.length > 0 ) {
            var mainIndex = 0;
            for( ;mainIndex < pathList.length; ++ mainIndex ) {
              if( pathList[mainIndex] === 'main') {
                break;
              }
            }
            if( mainIndex < pathList.length ) {
              var fullState = 'main.' + pathList[mainIndex + 1] + '_im-detail';
              $state.go(fullState, {cid: userId});
            }
            else {
              $state.go('main.me');
            }

          }
          else {
            $state.go('main.me');
          }
        }

        function gotoUserTasks(userId,nickname) {
          $log.debug('go user tasks:' + userId + " " + nickname);
          if(ho.isValid(userId) == false || userId == ''){
            return;
          }

          var pathList = $location.path().split('/');

          if( pathList.length > 0 ) {
            var mainIndex = 0;
            for( ;mainIndex < pathList.length; ++ mainIndex ) {
              if( pathList[mainIndex] === 'main') {
                break;
              }
            }
            if( mainIndex < pathList.length ) {
              var fullState = 'main.' + pathList[mainIndex + 1] + '_user-tasks';
              $state.go(fullState, {userId: userId,nickname:nickname});
            }
            else {
              $state.go('main.me');
            }

          }
          else {
            $state.go('main.me');
          }
        }

        function gotoTaskDetail(taskId) {
          if(ho.isValid(taskId) == false || taskId == ''){
            return;
          }

          var pathList = $location.path().split('/');

          if( pathList.length > 0 ) {
            var mainIndex = 0;
            for( ;mainIndex < pathList.length; ++ mainIndex ) {
              if( pathList[mainIndex] === 'main') {
                break;
              }
            }
            if( mainIndex < pathList.length ) {
              var fullState = 'main.' + pathList[mainIndex + 1] + '_user-tasks_task-detail';
              $state.go(fullState, {id: taskId});
            }
            else {
              $state.go('main.me');
            }

          }
          else {
            $state.go('main.me');
          }
        }
      }]);
})()
