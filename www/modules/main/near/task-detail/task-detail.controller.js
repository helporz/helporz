/**
 * Created by Midstream on 16/4/11 .
 */

(function(){
  'use strict';

  angular.module('main.near.taskdetail')
    .controller('mainNearTaskDetailCtrl', ['$scope', '$timeout', '$stateParams', 'taskNetService', 'taskUtils', mainNearTaskDetailCtrl]);

  function mainNearTaskDetailCtrl($scope, $timeout, $stateParams, taskNetService, taskUtils) {
    console.log($stateParams);

    var vm = $scope.vm = {};

    $scope.$on("$ionicView.beforeEnter", function() {
      vm.task = taskNetService.getTaskInfo($stateParams.id);

      vm.task.icon = taskUtils.iconByTypeValue(vm.task.taskTypesId);
      vm.task.typeName = taskUtils.nameByTypeValue(vm.task.taskTypesId);
      vm.task.commentCount = vm.task.commentList? vm.task.commentList.length: 0;

      $timeout( function() {
          $scope.$apply();
        },
        0
      );
    });

    //vm.iconByType = function(v) {
    //  return taskUtils.iconByTypeValue(v);
    //};
    //
    //vm.nameByType = function(v) {
    //  return taskUtils.nameByTypeValue(v);
    //};
    //
    //vm.commentCount = function(list) {
    //  if (list == undefined) {
    //    return 0;
    //  } else {
    //    return list.length;
    //  }
    //};
  }
})()
