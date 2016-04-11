/**
 * Created by Midstream on 16/3/29.
 */

(function(){
  'use strict';

  angular.module('main.near')
    .controller('mainNearCtrl', ['$log','$ionicLoading','$scope', 'taskNetService',mainNearCtrl]);

  function mainNearCtrl($log,$ionicLoading,$scope,taskNetService) {
    var vm = $scope.vm = {};

    vm.doRefresh = function() {
      taskNetService.queryNewTaskList().then(flushSuccessFn,flushFailedFn).finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

    $scope.$on("$ionicView.afterEnter", function() {
      $ionicLoading.show({
        template:'加载数据中...'
      });

      taskNetService.queryNewTaskList().then(flushSuccessFn,flushFailedFn).finally(function() {
        $ionicLoading.hide();
      });
    });

    //inner function

    function flushSuccessFn(newTaskList) {
      $log.info('new task list:' + JSON.stringify(newTaskList));
      $scope.vm.items = newTaskList;

      //避免 $digest / $apply digest in progress
      if(!$scope.$$phase) {
        $scope.$apply();
      }
      //$scope.$apply(function() {
      //  $log.info('new task list:' + JSON.stringify(newTaskList));
      //  vm.items = newTaskList;
      //});

    };

    function flushFailedFn(error) {
      alert(error);
    };

  }
})()
