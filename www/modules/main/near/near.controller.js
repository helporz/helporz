/**
 * Created by Midstream on 16/3/29.
 */

(function(){
  'use strict';

  angular.module('main.near')
    .controller('mainNearCtrl', ['$log','$ionicLoading','$scope', 'taskNetService',  'taskUtils', 'timeUtils', mainNearCtrl]);

  function mainNearCtrl($log,$ionicLoading,$scope,taskNetService, taskUtils, timeUtils) {
    var vm = $scope.vm = {};

    //test:
    $scope.items = [];
    for(var i=0;i<100;i++)
      $scope.items.push("line " + i);

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

        //计算出发帖和现在的时间差
        var pieces = item.created.split(/[\:\-\s]/);
        if (pieces.length != 6) alert('network err: task created time is not valid')
        var before = new Date(pieces[0], parseInt(pieces[1])-1, pieces[2], pieces[3], pieces[4], pieces[5]);
        item.ui_createTime = timeUtils.formatSimpleTimeBeforeNow(before);
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
