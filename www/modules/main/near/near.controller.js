/**
 * Created by Midstream on 16/3/29.
 */

(function () {
  'use strict';

  angular.module('main.near')
    .controller('mainNearCtrl', ['$state', '$log', '$ionicLoading', '$interval', '$timeout', '$scope', 'taskNetService', 'userNetService',
      'taskUtils', 'timeUtils', 'impressUtils', 'intervalCenter','SharePageWrapService', 'userUtils','IMInterfaceService',
      'imMessageService','taskNetWrapper','promptService',
      mainNearCtrl]);

  function mainNearCtrl($state, $log, $ionicLoading, $interval, $timeout, $scope, taskNetService, userNetService,
                        taskUtils, timeUtils, impressUtils, intervalCenter,SharePageWrapService, userUtils,IMInterfaceService,
                        imMessageService, taskNetWrapper,promptService) {

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
    vm.items = [];
    vm.state = $state;
    vm.noReadMessageCount = IMInterfaceService.getNoReadMessageCount();
    var conversationObserver = {
      onAddConversation: function (conversation) {
        vm.noReadMessageCount = IMInterfaceService.getNoReadMessageCount();
      }
    }

    imMessageService.registerConversationObserver('mainNearCtrl', conversationObserver);


    vm.sharePageService = SharePageWrapService;
    vm.taskNetService = taskNetService;

    function _refreshTaskList (cb_finally) {
      vm.hasMoreTask = true;
      taskNetService.queryNewTaskList().then(flushSuccessFn, loadFailedFn).finally(function () {
        if(cb_finally) {
          cb_finally();
        }
      });
    }

    vm.doRefresh = function () {
      _refreshTaskList(function() {
        $scope.$broadcast('scroll.refreshComplete');
      })
    };

    vm.hasMoreTask = true;
    vm.FirstLoadMore = true;
    vm.loadMore = function () {
      if (vm.FirstLoadMore) {
        vm.FirstLoadMore = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        return;
      }
      if (vm.hasMoreTask == false) {
        return;
      }
      taskNetService.queryNewTaskList(vm.items[vm.items.length - 1].id, 10).then(loadMoreSuccess, loadFailedFn).finally(function () {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    };
    vm.hasMoreTaskFn = function() {
      return vm.hasMoreTask;
    }

    var intervalFunc = function () {
      if (taskNetService.cache.isNearTaskNeedRefresh) {
        $ionicLoading.show();
        _refreshTaskList(function() {
          $ionicLoading.hide();
        })
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

    $scope.$on('$ionicView.leave', function () {
      //$interval.cancel(vm.pollInterval);
      intervalCenter.remove(0, 'near', intervalFunc);
    })

    vm.cb_itemClick = function (index) {
      if (canClick() == false) {
        return
      }

      $state.go('main.task-detail', {id: vm.items[index].id})
    };

    vm.cb_share = function (id) {
      if (canClick()) {
        SharePageWrapService.shareTask(id);
      }
    }

    vm.cb_gotoUser = function (userId) {
      if (canClick() == false) {
        return;
      }
      userUtils.gotoUser(userId, 'near');
    }

    vm.cb_acceptTask = function (index) {
      if (canClick() == false) {
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

      //$ionicLoading.show();
      //
      //taskNetService.acceptTask(task.id).then(
      //  function (data) {
      //
      //    if (data.code == 200) {
      //      //成功
      //      $ionicLoading.show({
      //        duration: 1500,
      //        templateUrl: 'modules/components/templates/ionic-loading/task-accept-success.html'
      //      });
      //      $timeout(function () {
      //        taskNetService.cache.isNearTaskNeedRefresh = true;
      //        taskNetService.cache.isAcceptTaskGoingNeedRefresh = true;
      //      }, 1500);
      //    } else {
      //      //失败
      //      //temp:
      //      $ionicLoading.show({
      //        duration: 1500,
      //        templateUrl: 'modules/components/templates/ionic-loading/task-not-exist.html'
      //      });
      //      $timeout(function () {
      //        taskNetService.cache.isNearTaskNeedRefresh = true;
      //      }, 1500);
      //    }
      //  },
      //  function () {
      //  }).finally(function () {
      //    console.log('accept taskid=' + task.id);
      //  });

      taskNetWrapper.acceptTask(task);
    }

    //////////////////////////////////////////////////
    //inner function

    function _uiProcess(taskList) {
      // process attr
      for (var i = 0; i < taskList.length; i++) {
        var item = taskList[i];
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
    }

    function flushSuccessFn(newTaskList) {
      taskNetService.cache.isNearTaskNeedRefresh = false;
      //$log.info('new task list:' + JSON.stringify(newTaskList));

      taskNetService.cache.nearTaskList = newTaskList;
      $scope.vm.items = newTaskList;


      // process attr
      //for (var i = 0; i < $scope.vm.items.length; i++) {
      //  var item = $scope.vm.items[i];
      //  item.icon = taskUtils.iconByTypeValue(item.taskTypesId);
      //  item.typeName = taskUtils.nameByTypeValue(item.taskTypesId);
      //  item.commentCount = item.commentList ? item.commentList.length : 0;
      //  item.ui_isMyTask = userNetService.cache.selfInfo.userId == item.poster.userId;
      //
      //  //计算出发帖和现在的时间差
      //  var pieces = item.created.split(/[\:\-\s]/);
      //  if (pieces.length != 6) alert('network err: task created time is not valid')
      //  var before = new Date(pieces[0], parseInt(pieces[1]) - 1, pieces[2], pieces[3], pieces[4], pieces[5]);
      //  item.ui_createTime = timeUtils.formatSimpleTimeBeforeNow(before);
      //
      //  item.ui_tags = [];
      //  impressUtils.netTagsToUiTags(item.ui_tags, item.poster.tags);
      //
      //  //temp
      //  //item.ui_tags = [impressUI[0], impressUI[2], impressUI[3]];
      //}
      _uiProcess($scope.vm.items);

      ////避免 $digest / $apply digest in progress
      //if (!$scope.$$phase) {
      //  $scope.$apply();
      //}
      $timeout(function () {
        $scope.$apply();
      })

    }

    function loadMoreSuccess(taskList) {
      if (taskList.length == 0) {
        vm.hasMoreTask = false;
        return;
      }
      _uiProcess(taskList);

      $scope.vm.items = $scope.vm.items.concat(taskList);
      taskNetService.cache.nearTaskList = $scope.vm.items;

      $timeout(function () {
        $scope.$apply();
      })
    }

    function loadFailedFn(error) {
      ho.alert('main.near err=' + error);
      promptService.promptErrorInfo(error, 1500);
    }

  }
})()
