/**
 * Created by Midstream on 16/3/29.
 */

(function () {
  'use strict';

  angular.module('main.task')
    .controller('mainTaskCtrl', ['$log', '$state', '$ionicLoading', '$ionicPopup', 'widgetDelegate',
      '$scope', 'taskNetService', 'taskUtils', '$timeout', mainTaskCtrl]);


  var enumClickTarget = {
    NONE: 0,
    TASK_STATE: 1,
    OPT_CANCEL: 2
  };


  function mainTaskCtrl($log, $state, $ionicLoading, $ionicPopup, widgetDelegate, $scope, taskNetService, taskUtils, $timeout) {
    var vm = $scope.vm = {};

    //vm.doRefresh = function () {
    //  taskNetService.queryNewTaskList().then(flushSuccessFn, flushFailedFn).finally(function () {
    //    $scope.$broadcast('scroll.refreshComplete');
    //  });
    //};

    //fixme:因为点击会穿透,同时触发多个事件,这里先用标记来屏蔽,点击按钮后间隔一段时间才可触发下一次点击回调
    vm._isClicking = false;
    var canClick = function () {
      if (vm._isClicking == false) {
        $timeout(function () {
          vm._isClicking = false;
        }, 300);
        vm._isClicking = true;
        return true;
      } else {
        return false;
      }
    }

    vm.tabSelectedIndex = 0;
    vm.isPostTaskNeedRefresh = true;
    vm.isAcceptTaskNeedRefresh = true;

    $scope.$on("$ionicView.enter", function () {
      //var ctrl = widgetDelegate.findWidget('hoTabSet', 'task');
      //if(vm.tabSelectedIndex == 0){
      //  //vm.cb_post();
      //  ctrl.select(0);
      //}else{
      //  //vm.cb_accept();
      //  ctrl.select(1);
      //}
    });

    vm.cb_post = function () {
      console.log('post');

      ////note: 这里比较特殊,tab组件加载的时候会默认点击第一个tab;当从子页面返回时,我们希望进入页面时,处在最后一次的tab页上
      //if(vm.tabSelectedIndex == 1){
      //  vm.cb_accept();
      //  return;
      //}

      vm.tabSelectedIndex = 0;
      //将tab选中信息保存到delegate里
      widgetDelegate.getWidgetStatic('hoTabSet', 'task').last = 0;

      if (vm.isPostTaskNeedRefresh == true) {
        $ionicLoading.show({
          template: '加载数据中...'
        });

        taskNetService.getPostTaskList().then(_cb_getPostTaskSuccess, _cb_failed).finally(function () {
          vm.repeatList = taskNetService.cache.postTaskList;
          $ionicLoading.hide();
        });
      }
      else {
        vm.repeatList = taskNetService.cache.postTaskList;
      }
    }

    var _cb_failed = function (error) {
      console.error(error);
    }

    var _cb_getPostTaskSuccess = function (taskList) {
      vm.isPostTaskNeedRefresh = false;

      taskNetService.cache.postTaskList = taskList;
      //
      for (var i in taskList) {
        taskList[i].ui_identifier = "援助人";
        taskList[i].ui_nickname = taskList[i].accepter != null ? taskList[i].accepter.nickname : "";
        taskList[i].ui_avatar = taskList[i].accepter != null ? taskList[i].accepter.avator : "";
        taskList[i].ui_taskIcon = taskUtils.iconByTypeValue(taskList[i].taskTypesId);
        taskList[i].ui_taskTypeName = taskUtils.nameByTypeValue(taskList[i].taskTypesId);

        taskUtils.taskStateToUiState(taskList[i], taskList[i].status, true);
      }
    }

    var _cb_getAcceptTaskSuccess = function (taskList) {
      vm.isAcceptTaskNeedRefresh = false;

      taskNetService.cache.acceptTaskList = taskList;

      for (var i in taskList) {
        taskList[i].ui_identifier = "求助人";
        taskList[i].ui_nickname = taskList[i].poster.nickname;
        taskList[i].ui_avatar = taskList[i].poster.avator;
        taskList[i].ui_taskIcon = taskUtils.iconByTypeValue(taskList[i].taskTypesId);
        taskList[i].ui_taskTypeName = taskUtils.nameByTypeValue(taskList[i].taskTypesId);

        taskUtils.taskStateToUiState(taskList[i], taskList[i].status, false);
      }
    }

    vm.cb_accept = function () {
      console.log('accept');
      vm.tabSelectedIndex = 1;
      //将tab选中信息保存到delegate里
      widgetDelegate.getWidgetStatic('hoTabSet', 'task').last = 1;

      if (vm.isAcceptTaskNeedRefresh == true) {
        $ionicLoading.show({
          template: '加载数据中...'
        });

        taskNetService.getAcceptTaskList().then(_cb_getAcceptTaskSuccess, _cb_failed).finally(function () {
          vm.repeatList = taskNetService.cache.acceptTaskList;
          $ionicLoading.hide();
        });
      }
      else {
        vm.repeatList = taskNetService.cache.acceptTaskList;
      }
    };

    /////////////////////////////////////
    vm.doRefresh = function () {
      taskNetService.getPostTaskList().then(_cb_getPostTaskSuccess, _cb_failed).finally(function () {
        taskNetService.getAcceptTaskList().then(_cb_getAcceptTaskSuccess, _cb_failed).finally(function () {
          $ionicLoading.hide();
        });
      });
    };

    //////////////////////////////////////////////////
    vm.cb_taskState = function (index) {
      if (canClick()) {
        gotoTaskState(vm.repeatList[index].id);
      }
    }

    var gotoTaskState = function (taskId) {
      $state.go('main.task-state', {id: taskId});
    };

    var gotoComment = function (taskId) {
      $state.go('main.comment');
    };
    vm.gotoComment = function (taskId) {
      if (canClick()) {
        //$state.go('main.comment', {desc: 'accepter-'+taskId});
        $state.go('main.comment', {desc: 'accepter-' + '516'});
      }
    };

    vm.opt_passive = function (index) {
      if (canClick() == false) {
        return;
      }

      var task = vm.repeatList[index];

      if (vm.tabSelectedIndex == 0) {
        if (task.status == 0) {  //waiting  -- 取消
          $ionicLoading.show();
          taskNetService.cancelByPoster(task.id).then(
            function (data, status) {
              console.log(data);
              if ( data.code == 200) {
                vm.cb_post();
              } else {
              }
            }, function (data, status) {
              $ionicPopup.alert({
                title: '错误提示',
                template: data
              }).then(function (res) {
                console.error(data);
              })
            }).finally(function () {
              $ionicLoading.hide();
              vm.clearClickTarget();
            });
        }
        else if (task.status == 2) {  //wait over time
          console.error('invalid task opt: wait over time - post passive');
        }
        else if (task.status == 4) {  // going on
          console.error('invalid task opt: going on - post passive');
        }
        else if (task.status == 8) {  //going on overtime
          console.error('invalid task opt: going on overtime - post passive');
        }
        else if (task.status == 32) { //accepter cancel
          console.error('invalid task opt: accepter cancel - post passive');
        }
        else if (task.status == 64) { //accepter confirm success  -- 未完成援助
          $ionicLoading.show();
          taskNetService.confirmByPoster(task.id, 200).then(  //ask:xiaolang  status: success,failed
            function (data, status) {
              console.log(data);
              if (data.code == 200) {
                vm.isPostTaskNeedRefresh = true;
                vm.cb_post();
              } else {

              }
            }, function (data, status) {
              $ionicPopup.alert({
                title: '错误提示',
                template: data
              }).then(function (res) {
                console.error(data);
              })
            }).finally(function () {
              $ionicLoading.hide();
            });
        }
        else if (task.status == 128) { //poster confirm success
          console.error('invalid task opt: poster confirm success - post passive');
        }
        else if (task.status == 256) { //poster confirm failed
          console.error('invalid task opt: poster confirm failed - post passive');
        }
      }
      /////////////////////////
      else {
        if (task.status == 0) {  //waiting  -- 取消
          console.error('invalid task opt: wait - accepter passive');
        }
        else if (task.status == 2) {  //wait over time
          console.error('invalid task opt: wait over time - accepter passive');
        }

        else if (task.status == 4) {  // going on -- 放弃援助
          console.error('invalid task opt: going on - accepter passive');
          $ionicLoading.show();
          taskNetService.cancelByAcceptor(task.id).then(  //ask:xiaolang  status: success,failed
            function (data, status) {
              console.log(data);
              if (data.code == 200) {
                vm.isAcceptTaskNeedRefresh = true;
                vm.cb_accept();
              } else {

              }
            }, function (data, status) {
              $ionicPopup.alert({
                title: '错误提示',
                template: data
              }).then(function (res) {
                console.error(data);
              })
            }).finally(function () {
              $ionicLoading.hide();
            });
        }
        else if (task.status == 8) {  //going on overtime
          console.error('invalid task opt: going on overtime -accepter post passive');
        }
        else if (task.status == 32) { //accepter cancel
          console.error('invalid task opt: accepter cancel - accepter passive');
        }
        else if (task.status == 64) { //accepter confirm success
          console.error('invalid task opt: accepter confirm success  - accepter passive');
        }
        else if (task.status == 128) { //poster confirm success
          console.error('invalid task opt: poster confirm success - accepter passive');
        }
        else if (task.status == 256) { //poster confirm failed
          console.error('invalid task opt: poster confirm failed - accepter passive');
        }
      }

    }

    vm.opt_active = function (index) {
      if (canClick() == false) {
        return;
      }

      var task = vm.repeatList[index];

      if (vm.tabSelectedIndex == 0) {

        if (task.status == 0) { //wait
          console.log('大侠召唤术');
        }
        else if (task.status == 2) {  //wait over time - 大侠召唤术
          console.log('大侠召唤术');
        }
        else if (task.status == 4) {  // going on
          console.error('invalid task opt: going on - post passive');
        }
        else if (task.status == 8) {  //going on overtime -- 评价
          gotoComment(task.id);
        }
        else if (task.status == 32) { //accepter cancel -- 评价
          gotoComment(task.id);
        }
        else if (task.status == 64) { //accepter confirm success  -- 确认完成援助
          $ionicLoading.show();
          taskNetService.confirmByPoster(task.id, 200).then(  //ask:xiaolang  status: success,failed
            function (data, status) {
              console.log(data);
              if (data.code == 200) {
                vm.isPostTaskNeedRefresh = true;
                vm.cb_post();
              } else {

              }
            }, function (data, status) {
              $ionicPopup.alert({
                title: '错误提示',
                template: data
              }).then(function (res) {
                console.error(data);
              })
            }).finally(function () {
              $ionicLoading.hide();
            });
        }
        else if (task.status == 128) { //poster confirm success -- 评价
          gotoComment(task.id);
        }
        else if (task.status == 256) { //poster confirm failed -- 评价
          gotoComment(task.id);
        }
      }
      // accepter
      else {
        if (task.status == 0) {  //waiting
          console.error('invalid task opt: waiting - accepter active');
        }
        else if (task.status == 2) {  //wait over time
          console.error('invalid task opt: wait over time - accepter active');
        }
        else if (task.status == 4) {  // going on -- 我已完成援助
          $ionicLoading.show();
          taskNetService.completeByAcceptor(task.id).then(
            function (data, status) {
              console.log(data);
              if (data.code == 200) {
                vm.isAcceptTaskNeedRefresh = true;
                vm.cb_accept();
              } else {

              }
            }, function (data, status) {
              $ionicPopup.alert({
                title: '错误提示',
                template: data
              }).then(function (res) {
                console.error(data);
              })
            }).finally(function () {
              $ionicLoading.hide();
            });
        }
        else if (task.status == 8) {  //going on overtime -- 评价
          gotoComment(task.id);
        }
        else if (task.status == 32) { //accepter cancel -- 查看评价
          gotoTaskState(task.id);
        }
        else if (task.status == 64) { //accepter confirm success
          console.error('invalid task opt: accepter confirm success - accepter active');
        }
        else if (task.status == 128) { //accepter confirm success -- 评价留言
          gotoComment(task.id);
        }
        else if (task.status == 256) { //accepter confirm failed -- 评价留言
          gotoComment(task.id);
        }
      }
    }

  }
})
()
