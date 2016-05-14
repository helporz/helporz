/**
 * Created by Midstream on 16/4/11 .
 */

(function () {
  'use strict';

  angular.module('main.task.taskState')
    .controller('mainTaskTaskStateCtrl', ['$scope', '$timeout', '$stateParams', 'taskNetService', 'taskUtils',
      'userNetService', mainTaskTaskStateCtrl]);

  function mainTaskTaskStateCtrl($scope, $timeout, $stateParams, taskNetService, taskUtils, userNetService) {
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
      vm.showMyComment = true;
      vm.showOtherComment = true;

      if (vm.task.posterComment) {
        vm.showOtherComment = true;
      }

      if (vm.task.accepterComment) {
        vm.showMyComment = true;
      }

      $timeout(function () {
          $scope.$apply();
        },
        0
      );
    });

  }
})()
