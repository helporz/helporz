/**
 * Created by Midstream on 16/7/4.
 */

(function () {
  'use strict';

  angular.module('main.user-tasks')
    .factory('mainUserTasksService', mainUserTasksService)
    .controller('mainUserTasksCtrl', ['$state', '$log', '$ionicLoading', '$interval', '$timeout', '$scope','$stateParams', 'taskNetService', 'userNetService',
      'taskUtils', 'timeUtils', 'impressUtils', 'intervalCenter', 'SharePageWrapService', 'mainUserTasksService',
      'mainNearTaskDetailService', 'operationUtils', 'userUtils','$ionicTabsDelegate','taskNetWrapper','promptService',
      mainUserTasksCtrl]);

  function mainUserTasksService() {
    return {
      user: {
        id: '',
        nickname: ''
      },
      tasks: []
    }
  }

  function mainUserTasksCtrl($state, $log, $ionicLoading, $interval, $timeout, $scope, $stateParams,taskNetService, userNetService,
                             taskUtils, timeUtils, impressUtils, intervalCenter, SharePageWrapService, mainUserTasksService,
                             mainNearTaskDetailService, operationUtils, userUtils, $ionicTabsDelegate,taskNetWrapper,promptService) {

    var vm = $scope.vm = {};
    $log.debug('mainUserTaskCtrl:' + JSON.stringify($stateParams));
    if($stateParams.userId != '' && $stateParams.nickname != ''){
      mainUserTasksService.user.id = $stateParams.userId;
      mainUserTasksService.user.nickname = $stateParams.nickname;
    }

    vm.nickname = mainUserTasksService.user.nickname;
    vm.items = [];

    vm.sharePageService = SharePageWrapService;
    vm.doRefresh = function () {
      $log.debug("mainUserTasksService:" + JSON.stringify(mainUserTasksService));
      taskNetService.getWaitingTaskList(mainUserTasksService.user.id).then(flushSuccessFn, flushFailedFn).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
      });
    };

    function _refreshList() {
      $ionicLoading.show();
      $log.debug("mainUserTasksService:" + JSON.stringify(mainUserTasksService));
      taskNetService.getWaitingTaskList(mainUserTasksService.user.id).then(flushSuccessFn, flushFailedFn).finally(function () {
        $ionicLoading.hide();
      });
    }

    $scope.$on("$ionicView.enter", function () {
      if (mainUserTasksService.tasks.length == 0) {
        _refreshList();
      } else {  //从界面返回时,不将tasks置空,那么回来就不用再次从网络获取
        vm.items = mainUserTasksService.tasks;
      }
    });

    $scope.$on('$ionicView.leave', function () {

    })

    vm.cb_gotoUser = function(userId) {
      if(operationUtils.canClick()==false){
        return;
      }
      var index = $ionicTabsDelegate.$getByHandle('rootTabs').selectedIndex();
      var tabName;
      if(index==0) {
        tabName = 'near';
      }else if(index ==4) {
        tabName = 'me';
      }else{
        ho.alert('gotoUser tab invalid, tabIndex=' + index);
      }
      userUtils.gotoUser(userId, tabName);
    }

    vm.cb_itemClick = function (index) {
      if (operationUtils.canClick() == false) {
        return
      }
      mainNearTaskDetailService.task = vm.items[index];
      //$state.go('main.me_user-tasks_task-detail', {id: '-1'});
      userUtils.gotoTaskDetail('-1');
    };

    vm.cb_acceptTask = function (index) {
      if (operationUtils.canClick() == false) {
        return
      }

      var task = vm.items[index];

      $ionicLoading.show();

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
      //        _refreshList();
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

      taskNetWrapper.acceptTask(task, _refreshList);
    }

    //////////////////////////////////////////////////
    //inner function

    function flushSuccessFn(newTaskList) {
      //$log.info('new task list:' + JSON.stringify(newTaskList));

      $scope.vm.items = newTaskList;
      mainUserTasksService.tasks = newTaskList;


      // process attr
      for (var i = 0; i < $scope.vm.items.length; i++) {
        var item = $scope.vm.items[i];
        item.icon = taskUtils.iconByTypeValue(item.taskTypesId);
        item.typeName = taskUtils.nameByTypeValue(item.taskTypesId);
        item.commentCount = item.commentList ? item.commentList.length : 0;
        item.ui_isMyTask = userNetService.cache.selfInfo.userId == item.poster.userId;

        //计算出发帖和现在的时间差
        var pieces = item.created.split(/[\:\-\s]/);
        if (pieces.length != 6) ho.alert('network err: task created time is not valid')
        var before = new Date(pieces[0], parseInt(pieces[1]) - 1, pieces[2], pieces[3], pieces[4], pieces[5]);
        item.ui_createTime = timeUtils.formatSimpleTimeBeforeNow(before);

        item.ui_tags = [];
        impressUtils.netTagsToUiTags(item.ui_tags, item.poster.tags);
      }

      $timeout(function () {
        $scope.$apply();
      })

    }

    function flushFailedFn(error) {
      ho.alert(error);
      promptService.promptErrorInfo(error, 1500);
    }


  }
})()
