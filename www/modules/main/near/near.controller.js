/**
 * Created by Midstream on 16/3/29.
 */

(function () {
  'use strict';

  angular.module('main.near')
    .controller('mainNearCtrl', ['$state', '$log', '$ionicLoading', '$interval', '$timeout', '$scope', 'taskNetService', 'userNetService',
      'taskUtils', 'timeUtils', 'impressUtils', 'intervalCenter','SharePageWrapService', 'userUtils','IMInterfaceService','imMessageService',
      mainNearCtrl]);



  function mainNearCtrl($state, $log, $ionicLoading, $interval, $timeout, $scope, taskNetService, userNetService,
                        taskUtils, timeUtils, impressUtils, intervalCenter,SharePageWrapService, userUtils,IMInterfaceService,
                        imMessageService) {

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
    vm.state = $state;
    vm.noReadMessageCount = IMInterfaceService.getNoReadMessageCount();
    var conversationObserver = {
      onAddConversation: function (conversation) {
        vm.noReadMessageCount = IMInterfaceService.getNoReadMessageCount();
      }
    }

    imMessageService.registerConversationObserver('mainNearCtrl', conversationObserver);


    vm.sharePageService = SharePageWrapService;
    vm.doRefresh = function () {
      taskNetService.queryNewTaskList().then(flushSuccessFn, flushFailedFn).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
      });
    };

    var intervalFunc = function(){
      if (taskNetService.cache.isNearTaskNeedRefresh) {
        taskNetService.cache.isNearTaskNeedRefresh = false;
        _refreshList();
      }
    }

    $scope.$on("$ionicView.enter", function () {
      vm.noReadMessageCount = IMInterfaceService.getNoReadMessageCount();
      if (ho.isValid(userNetService.cache.selfInfo)) {
        vm.orgName = userNetService.cache.selfInfo.orgList[0].name;
      }

      //$timeout(function(){
      //  $scope.$apply();
      //  });

      intervalCenter.add(0, 'near', intervalFunc);

    });

    $scope.$on('$ionicView.leave', function() {
      //$interval.cancel(vm.pollInterval);
      intervalCenter.remove(0, 'near', intervalFunc);
    })

    vm.cb_itemClick = function(index) {
      if(canClick() == false) {
        return
      }

      $state.go('main.task-detail', {id: vm.items[index].id})
    };

    vm.cb_gotoUser = function(userId) {
      if(canClick()==false) {
        return;
      }
      userUtils.gotoUser(userId, 'near');
    }

    vm.cb_acceptTask = function (index) {
      if(canClick() == false) {
        return
      }

      var task = taskNetService.cache.nearTaskList[index];

      //if(userNetService.cache.selfInfo == null){
      //  alert('未登录');
      //  return;
      //}
      //
      //if(userNetService.cache.selfInfo.userId == task.poster.userId) {
      //  $ionicLoading.show({
      //    duration: 1500,
      //    templateUrl: 'modules/components/templates/ionic-loading/task-cannot-accept-self-post.html'
      //  });
      //  return;
      //}

      $ionicLoading.show();

      taskNetService.acceptTask(task.id).then(
        function (data) {
          //taskNetService.queryNewTaskList().then(flushSuccessFn, flushFailedFn).finally(function () {
          //  $ionicLoading.hide();
          //})

          if (data.code == 200) {
            //成功
            $ionicLoading.show({
              duration: 1500,
              templateUrl: 'modules/components/templates/ionic-loading/task-accept-success.html'
            });
            $timeout(function() {
              taskNetService.cache.isNearTaskNeedRefresh = true;
              taskNetService.cache.isAcceptTaskGoingNeedRefresh = true;
            }, 1500);
          } else {
            //失败
            //temp:
            $ionicLoading.show({
              duration: 1500,
              templateUrl: 'modules/components/templates/ionic-loading/task-not-exist.html'
            });
            $timeout(function() {
              taskNetService.cache.isNearTaskNeedRefresh = true;
            }, 1500);
          }
        },
        function () {
        }).finally(function () {
          console.log('accept taskid=' + task.id);
        });
    }

    //////////////////////////////////////////////////
    //inner function

    function flushSuccessFn(newTaskList) {
      //$log.info('new task list:' + JSON.stringify(newTaskList));

      taskNetService.cache.nearTaskList = newTaskList;
      $scope.vm.items = newTaskList;


      // process attr
      for (var i = 0; i < $scope.vm.items.length; i++) {
        var item = $scope.vm.items[i];
        item.icon = taskUtils.iconByTypeValue(item.taskTypesId);
        item.typeName = taskUtils.nameByTypeValue(item.taskTypesId);
        item.commentCount = item.commentList ? item.commentList.length : 0;
        item.ui_isMyTask = userNetService.cache.selfInfo.userId == item.poster.userId;

        //计算出发帖和现在的时间差
        var pieces = item.created.split(/[\:\-\s]/);
        if (pieces.length != 6) alert('network err: task created time is not valid')
        var before = new Date(pieces[0], parseInt(pieces[1]) - 1, pieces[2], pieces[3], pieces[4], pieces[5]);
        item.ui_createTime = timeUtils.formatSimpleTimeBeforeNow(before);

        item.ui_tags = [];
        impressUtils.netTagsToUiTags(item.ui_tags, item.poster.tags);

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
      alert('main.near'+error);
    }

    function _refreshList() {
      $ionicLoading.show();
      taskNetService.queryNewTaskList().then(flushSuccessFn, flushFailedFn).finally(function () {
        $ionicLoading.hide();
      });
    }


  }
})()
