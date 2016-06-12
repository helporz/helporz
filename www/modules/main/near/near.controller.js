/**
 * Created by Midstream on 16/3/29.
 */

(function () {
  'use strict';

  angular.module('main.near')
    .controller('mainNearCtrl', ['$log', '$ionicLoading', '$timeout', '$scope', 'taskNetService', 'userNetService',
      'taskUtils', 'timeUtils', 'impressUtils', mainNearCtrl]);

  function mainNearCtrl($log, $ionicLoading, $timeout, $scope, taskNetService, userNetService,
                        taskUtils, timeUtils, impressUtils) {
    var vm = $scope.vm = {};

    vm.doRefresh = function () {
      taskNetService.queryNewTaskList().then(flushSuccessFn, flushFailedFn).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
      });
    };


    $scope.$on("$ionicView.enter", function () {
      if (taskNetService.cache.isNearTaskNeedRefresh) {
        taskNetService.cache.isNearTaskNeedRefresh = false;
        _refreshList();
      }

      if (ho.isValid(userNetService.cache.selfInfo)) {
        vm.orgName = userNetService.cache.selfInfo.orgList[0].name;
      }

      //$timeout(function(){
      //  $scope.$apply();
      //  });
    });

    vm.cb_acceptTask = function (index) {
      var task = taskNetService.cache.nearTaskList[index];

      $ionicLoading.show();

      taskNetService.acceptTask(task.id).then(
        function (data) {
          taskNetService.queryNewTaskList().then(flushSuccessFn, flushFailedFn).finally(function () {
            $ionicLoading.hide();
          })
        },
        function () {
          $ionicLoading.hide();
        }).finally(function () {
          $ionicLoading.hide();
          console.log('accept taskid=' + task.id);
        });
    }

    //////////////////////////////////////////////////
    //inner function

    function flushSuccessFn(newTaskList) {
      $log.info('new task list:' + JSON.stringify(newTaskList));

      taskNetService.cache.nearTaskList = newTaskList;
      $scope.vm.items = newTaskList;


      // process attr
      var impressUI = impressUtils.impressUI();
      for (var i = 0; i < $scope.vm.items.length; i++) {
        var item = $scope.vm.items[i];
        item.icon = taskUtils.iconByTypeValue(item.taskTypesId);
        item.typeName = taskUtils.nameByTypeValue(item.taskTypesId);
        item.commentCount = item.commentList ? item.commentList.length : 0;

        //计算出发帖和现在的时间差
        var pieces = item.created.split(/[\:\-\s]/);
        if (pieces.length != 6) alert('network err: task created time is not valid')
        var before = new Date(pieces[0], parseInt(pieces[1]) - 1, pieces[2], pieces[3], pieces[4], pieces[5]);
        item.ui_createTime = timeUtils.formatSimpleTimeBeforeNow(before);

        item.ui_tags = item.poster.tags.concat();

        item.ui_tags = [];
        var tags = item.poster.tags;
        for(var tagIdx = 0; tagIdx < tags.length; tagIdx++){
          item.ui_tags.push(impressUI[tags[tagIdx].id-1])
        }

        //temp
        //item.ui_tags = [impressUI[0], impressUI[2], impressUI[3]];
      }

      ////避免 $digest / $apply digest in progress
      //if (!$scope.$$phase) {
      //  $scope.$apply();
      //}
      $timeout(function () {
        $scope.$apply();
      })

    }

    function flushFailedFn(error) {
      alert(error);
    }

    function _refreshList() {
      $ionicLoading.show({
        template: '加载数据中...'
      });
      taskNetService.queryNewTaskList().then(flushSuccessFn, flushFailedFn).finally(function () {
        $ionicLoading.hide();
      });
    }


  }
})()
