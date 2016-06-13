/**
 * Created by Midstream on 16/3/29.
 */

(function () {
  'use strict';

  angular.module('main.near')
    .controller('mainNearCtrl', ['$state', '$log', '$ionicLoading', '$interval', '$timeout', '$scope', 'taskNetService', 'userNetService',
      'taskUtils', 'timeUtils', 'impressUtils', mainNearCtrl]);



  function mainNearCtrl($state, $log, $ionicLoading, $interval, $timeout, $scope, taskNetService, userNetService,
                        taskUtils, timeUtils, impressUtils) {

    //fixme:因为点击会穿透,同时触发多个事件,这里先用标记来屏蔽,点击按钮后间隔一段时间才可触发下一次点击回调
    var _isClicking = false;
    var canClick = function () {
      if (_isClicking == false) {
        $timeout(function () {
          _isClicking = false;
        }, 300);
        _isClicking = true;
        return true;
      } else {
        return false;
      }
    }

    var vm = $scope.vm = {};

    vm.doRefresh = function () {
      taskNetService.queryNewTaskList().then(flushSuccessFn, flushFailedFn).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
      });
    };


    $scope.$on("$ionicView.enter", function () {


      if (ho.isValid(userNetService.cache.selfInfo)) {
        vm.orgName = userNetService.cache.selfInfo.orgList[0].name;
      }

      //$timeout(function(){
      //  $scope.$apply();
      //  });

      vm.pollInterval = $interval(function(){
        if (taskNetService.cache.isNearTaskNeedRefresh) {
          taskNetService.cache.isNearTaskNeedRefresh = false;
          _refreshList();
        }
      }, 500);
    });

    $scope.$on('$ionicView.leave', function() {
      $interval.cancel(vm.pollInterval);
    })

    vm.cb_itemClick = function(index) {
      if(canClick() == false) {
        return
      }

      $state.go('main.task-detail', {id: vm.items[index].id})
    };

    vm.cb_acceptTask = function (index) {
      if(canClick() == false) {
        return
      }

      var task = taskNetService.cache.nearTaskList[index];

      if(userNetService.cache.selfInfo == null){
        alert("未登录");
        return;
      }

      if(userNetService.cache.selfInfo.userId == task.poster.userId) {
        alert("不能接自己的单子");
        return;
      }

      $ionicLoading.show();

      taskNetService.acceptTask(task.id).then(
        function (data) {
          //taskNetService.queryNewTaskList().then(flushSuccessFn, flushFailedFn).finally(function () {
          //  $ionicLoading.hide();
          //})
          taskNetService.cache.isNearTaskNeedRefresh = true;
        },
        function () {
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
