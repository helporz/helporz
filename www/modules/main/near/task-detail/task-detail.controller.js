/**
 * Created by Midstream on 16/4/11 .
 */

(function(){
  'use strict';

  angular.module('main.near.taskdetail')
    .controller('mainNearTaskDetailCtrl', ['$state', '$scope', '$timeout', '$stateParams', 'taskNetService', 'taskUtils', mainNearTaskDetailCtrl]);

  function mainNearTaskDetailCtrl($state, $scope, $timeout, $stateParams, taskNetService, taskUtils) {
    console.log($stateParams);

    var vm = $scope.vm = {};

    $scope.$on("$ionicView.beforeEnter", function() {
      vm.task = taskNetService.getTaskInNearList($stateParams.id);

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

    vm.submit = function(){
      $ionicLoading.show();
      taskNetService.acceptTask(task.id).then(
        function (data, status) {
          console.log(data);
          if (status == 200) {
            //成功
            taskNetService.cache.isNearTaskNeedRefresh = true;
            $state.go('main.near');

          } else {
          }
        }, function (data, status) {
          $ionicPopup.alert({
            title: '错误提示',
            template: data.data.message
          }).then(function (res) {
            console.error(data);
          })
        }).finally(function () {
          $ionicLoading.hide();
          vm.clearClickTarget();
        });
    }
  }
})()
