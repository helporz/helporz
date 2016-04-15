/**
 * Created by Midstream on 16/3/29.
 */

(function(){
  'use strict';

  angular.module('main.near')
    .controller('mainNearCtrl', ['$log','$ionicLoading','$scope', 'taskNetService', 'taskDesc', 'taskUtils', mainNearCtrl]);

  function mainNearCtrl($log,$ionicLoading,$scope,taskNetService, taskDesc, taskUtils) {
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

    vm.iconByType = function(v) {
      //if(angular.isNumber(v)){
      //  var main = taskDesc[taskUtils.mainByTypeValue(v)];
      //  var sub = main.subtype[taskUtils.subByTypeValue(v)];
      //  var relIcon = sub.icon;
      //  var absIcon = 'img/task/icon/' + relIcon + '@2x.png';
      //  return absIcon;
      //} else {
      //  return '';
      //}
      return taskUtils.iconByTypeValue(v);
    }

    vm.nameByType = function(v) {
      return taskUtils.nameByTypeValue(v);
    }

    //////////////////////////////////////////////////
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
