/**
 * Created by Midstream on 16/4/11 .
 */

(function () {
  'use strict';

  angular.module('main.task.taskState')
    .controller('mainTaskTaskStateCtrl', ['$scope', '$timeout', '$stateParams', '$ionicTabsDelegate','taskNetService', 'taskUtils',
      'impressUtils', 'userNetService','userUtils',  mainTaskTaskStateCtrl]);

  function mainTaskTaskStateCtrl($scope, $timeout, $stateParams, $ionicTabsDelegate, taskNetService, taskUtils,
                                 impressUtils, userNetService, userUtils) {
    console.log($stateParams);

    var vm = $scope.vm = {};

    $scope.$on("$ionicView.beforeEnter", function () {
      var isPosterOrAccepter = true;
      vm.task = taskNetService.getTaskInPostList($stateParams.id);
      if(vm.task == null){
        isPosterOrAccepter = false;
        vm.task = taskNetService.getTaskInAcceptList($stateParams.id);
      }

      vm.task.icon = taskUtils.iconByTypeValue(vm.task.taskTypesId);
      vm.task.typeName = taskUtils.nameByTypeValue(vm.task.taskTypesId);
      vm.task.commentCount = vm.task.commentList ? vm.task.commentList.length : 0;


      // impresses
      //var impressUI = impressUtils.impressUI();
      //vm.task.ui_tags = vm.task.poster.tags.concat();
      //vm.task.ui_tags = [impressUI[0], impressUI[2], impressUI[3]];

      vm.task.ui_tags = [];
      impressUtils.netTagsToUiTags(vm.task.ui_tags, vm.task.poster.tags);

      taskUtils.taskStateToUiState(vm.task, vm.task.status, isPosterOrAccepter);

      vm.task.state = 2;

      //////////////////////////////////////////////////
      var selfInfo = userNetService.cache.selfInfo;
      if(selfInfo == undefined){
        console.error('err: no selfInfo');
        return;
      }

      //if (vm.task.poster) {
      //  if (vm.task.poster.userId == selfInfo.userId) {
      //    isPosterOrAccepter = true;
      //  } else {
      //    isPosterOrAccepter = false;
      //  }
      //}
      //
      //if (vm.task.accepter) {
      //  if (vm.task.accepter.userId == selfInfo.userId) {
      //    isPosterOrAccepter = false;
      //  } else {
      //    isPosterOrAccepter = true;
      //  }
      //}


      //////////////////////////////////////////////////
      //temp show all
      vm.showMyComment = false;
      vm.showOtherComment = false;
      vm.showState = 0; // 0 none, 1 my, 2 other

      if (isPosterOrAccepter===true){   // user is poster
        if(vm.task.posterCommentLevel != 0){
					vm.showMyComment = true;
					vm.ui_myComment = vm.task.posterComment;
					vm.ui_myCommentLevel = '' + vm.task.posterCommentLevel;

          vm.ui_myCommentTags = [];
          impressUtils.netTagsToUiTags(vm.ui_myCommentTags, vm.task.posterTags);
        }
        if(vm.task.accepterCommentLevel != 0 && vm.task.posterCommentLevel != 0) {    // 如果自己没有评价,那么看不到对方的评价
          vm.showOtherComment = true;
          vm.ui_otherComment = vm.task.accepterComment;
          vm.ui_otherCommentLevel = '' + vm.task.accepterCommentLevel;

          vm.ui_otherCommentTags = [];
          impressUtils.netTagsToUiTags(vm.ui_otherCommentTags, vm.task.accepterTags);
        }

        if(vm.task.status == '128' || vm.task.status == '256') {  // 发单人确认'成功' or '失败'
          if (vm.task.posterCommentLevel == 0) {
            vm.showState = 1;
          } else {
            if (vm.task.accepterCommentLevel == 0) {
              vm.showState = 2;
            } else {
              vm.showState = 0;
            }
          }
        }
        if(vm.task.status == '32') {    // 接单人放弃,那么只有user可以单向评价他
          if(!vm.task.posterComment) {
            vm.showState = 1;
          }
        }

      }

      else {  // user is accepter

        if(vm.task.posterCommentLevel != 0 && vm.task.accepterCommentLevel != 0){   // 如果自己没有评价,那么看不到对方的评价
					vm.showOtherComment = true;
					vm.ui_otherComment = vm.task.posterComment;
					vm.ui_otherCommentLevel = '' + vm.task.posterCommentLevel;

          vm.ui_otherCommentTags = [];
          impressUtils.netTagsToUiTags(vm.ui_otherCommentTags, vm.task.posterTags);
        }
        if(vm.task.accepterCommentLevel != 0) {
          vm.showMyComment = true;
          vm.ui_myComment = vm.task.accepterComment;
          vm.ui_myCommentLevel = '' + vm.task.accepterCommentLevel;

          vm.ui_myCommentTags = [];
          impressUtils.netTagsToUiTags(vm.ui_myCommentTags, vm.task.accepterTags);
        }

        if(vm.task.status == '128' || vm.task.status == '256') {
          if (vm.task.accepterCommentLevel == 0) {
            vm.showState = 1;
          } else {
            if (vm.task.posterCommentLevel == 0) {
              vm.showState = 2;
            } else {
              vm.showState = 0;
            }
          }
        }
      }

      $timeout(function () {
          $scope.$apply();
        },
        0
      );
    });

    $scope.$on("$ionicView.leave", function () {
      alert('123');
    });

    vm.cb_gotoUser = function(userId) {
      var index = $ionicTabsDelegate.$getByHandle('rootTabs').selectedIndex();
      var tabName;
      if(index==0) {
        tabName = 'near';
      }else if(index ==4) {
        tabName = 'me';
      }else if(index==3){
        tabName = 'task';
      }
      else{
        ho.alert('gotoUser tab invalid, tabIndex=' + index);
      }

      userUtils.gotoUser(userId, tabName);
    }

  }
})()
