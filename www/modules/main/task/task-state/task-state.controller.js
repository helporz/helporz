/**
 * Created by Midstream on 16/4/11 .
 */

(function () {
  'use strict';

  angular.module('main.task.taskState')
    .controller('mainTaskTaskStateCtrl', ['$scope', '$timeout', '$stateParams', 'taskNetService', 'taskUtils',
      'impressUtils', 'userNetService', mainTaskTaskStateCtrl]);

  function mainTaskTaskStateCtrl($scope, $timeout, $stateParams, taskNetService, taskUtils,
                                 impressUtils, userNetService) {
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
      var impressUI = impressUtils.impressUI();
      vm.task.ui_tags = vm.task.poster.tags.concat();
      vm.task.ui_tags = [impressUI[0], impressUI[2], impressUI[3]];


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

      if (isPosterOrAccepter===true){
        if(vm.task.posterComment){
					vm.showMyComment = true;
					vm.ui_myComment = vm.task.posterComment;
					vm.ui_myCommentLevel = vm.task.posterCommentLevel;
					vm.ui_myCommentTags = vm.task.posterTags;
        }
        if(vm.task.accepterComment) {
          vm.showOtherComment = true;
          vm.ui_otherComment = vm.task.accepterComment;
          vm.ui_otherCommentLevel = vm.task.otherCommentLevel;
          vm.ui_otherCommentTags = vm.task.otherTags;
        }
      }

      else {
        if(vm.task.posterComment){
					vm.showOtherComment = true;
					vm.ui_otherComment = vm.task.posterComment;
					vm.ui_otherCommentLevel = vm.task.posterCommentLevel;
					vm.ui_otherCommentTags = vm.task.posterTags;
        }
        if(vm.task.accepterComment) {
          vm.showMyComment = true;
          vm.ui_myComment = vm.task.accepterComment;
          vm.ui_myCommentLevel = vm.task.otherCommentLevel;
          vm.ui_myCommentTags = vm.task.otherTags;
        }
      }

      $timeout(function () {
          $scope.$apply();
        },
        0
      );
    });

  }
})()
