/**
 * Created by Midstream on 16/3/29.
 */

(function(){
  'use strict';

  angular.module('main.near')
    .controller('mainNearCtrl', ['$log','$ionicLoading','$scope', 'taskNetService',  'taskUtils', mainNearCtrl]);

  function mainNearCtrl($log,$ionicLoading,$scope,taskNetService, taskUtils) {
    var vm = $scope.vm = {};

    vm.isFirstIn = true;

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

    vm.doRefresh = function() {
      taskNetService.queryNewTaskList().then(flushSuccessFn,flushFailedFn).finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });
    };

    $scope.$on("$ionicView.beforeEnter", function() {
      if(vm.isFirstIn) {
        vm.isFirstIn = false;

         $ionicLoading.show({
           template:'加载数据中...'
         });

         taskNetService.queryNewTaskList().then(flushSuccessFn,flushFailedFn).finally(function() {
           $ionicLoading.hide();
         });
      }
    });

    //////////////////////////////////////////////////
    //inner function

    function flushSuccessFn(newTaskList) {
      $log.info('new task list:' + JSON.stringify(newTaskList));

      taskNetService.cache.nearTaskList = newTaskList;
      $scope.vm.items = newTaskList;


      // process attr
      for(var i = 0; i < $scope.vm.items.length; i++){
        var item = $scope.vm.items[i];
        item.icon = taskUtils.iconByTypeValue(item.taskTypesId);
        item.typeName = taskUtils.nameByTypeValue(item.taskTypesId);
        item.commentCount = item.commentList? item.commentList.length: 0;
      }

      //避免 $digest / $apply digest in progress
      if(!$scope.$$phase) {
        $scope.$apply();
      }
      //$scope.$apply(function() {
      //  $log.info('new task list:' + JSON.stringify(newTaskList));
      //  vm.items = newTaskList;
      //});

    }

    function flushFailedFn(error) {
      alert(error);
    }

  }
})()
