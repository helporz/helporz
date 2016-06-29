/**
 * Created by Midstream on 16/3/29.
 */

(function () {
  'use strict';

  angular.module('main.task')
    .controller('mainTaskCtrl', ['$log', '$state', '$ionicLoading', '$ionicPopup', 'widgetDelegate', '$ionicScrollDelegate',
      '$scope', 'taskNetService', 'taskUtils', '$timeout', 'intervalCenter', mainTaskCtrl]);


  var enumClickTarget = {
    NONE: 0,
    TASK_STATE: 1,
    OPT_CANCEL: 2
  };

  var POLL_MIN_TIME = 200;
  var POLL_MAX_TIME = 5000;


  function mainTaskCtrl($log, $state, $ionicLoading, $ionicPopup, widgetDelegate, $ionicScrollDelegate,
                        $scope, taskNetService, taskUtils, $timeout, intervalCenter) {
    var vm = $scope.vm = {};

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

    vm.postTabSelectedIndex = 0;
    vm.acceptTabSelectedIndex = 0;

    vm.taskScroll = $ionicScrollDelegate.$getByHandle('taskScroll');


    vm.pollIntervalTime = POLL_MIN_TIME;
    vm.lastPollErrorOccurMS = 0;
    vm.isNetSynchronizing = false;
    vm.timeChecker = new Date();


    var intervalFunc = function () {
      //如果正在同步,跳过本次轮训
      if(vm.isNetSynchronizing == true) {
        return;
      }
      checkTaskNewState();
      //网络条件不佳,或者从服务器读取数据出错的时候,会将轮训间隔调大,当一段时间不出错(网络恢复后),将轮询间隔重置成最小值
      if(vm.lastPollErrorOccurMS > 0 || vm.timeChecker.getTime() - vm.lastPollErrorOccurMS > POLL_MAX_TIME + 2000){
        //vm.pollInterval = POLL_MIN_TIME;

        //从快轮询移除,加到慢轮训
        intervalCenter.remove(0, 'task', intervalFunc);
        intervalCenter.add(1, 'task', intervalFunc);
      }
    }


    $scope.$on("$ionicView.enter", function () {
      // 首次判断读取任务
      if(taskNetService.cache.isPostTaskGoingNeedRefresh &&
        taskNetService.cache.isPostTaskFinishNeedRefresh &&
        taskNetService.cache.isAcceptTaskGoingNeedRefresh &&
        taskNetService.cache.isAcceptTaskFinishNeedRefresh
      ){
        vm.isNetSynchronizing = true;

        $ionicLoading.show();
        taskNetService.getTaskList().then(function(taskList) {
          vm.repeatList = taskList.uncompletedPostList;
          _processTaskForUI(taskList.uncompletedPostList, true);
          _processTaskForUI(taskList.completedPostList, true);
          _processTaskForUI(taskList.uncompletedAcceptList, false);
          _processTaskForUI(taskList.completedAcceptList, false);

          vm.taskScroll.scrollTop();
          $timeout(function(){
            $scope.$apply();
          })
        }, _cb_failed).finally(function(){
          $ionicLoading.hide();
          vm.isNetSynchronizing = false;
        })
      }

      //// 开始轮询
      //if(vm.pollInterval == undefined){
      //  vm.pollInterval = $interval(function () {
      //    //如果正在同步,跳过本次轮训
      //    if(vm.isNetSynchronizing == true) {
      //      return;
      //    }
      //    checkTaskNewState();
      //    //网络条件不佳,或者从服务器读取数据出错的时候,会将轮训间隔调大,当一段时间不出错(网络恢复后),将轮询间隔重置成最小值
      //    if(vm.lastPollErrorOccurMS > 0 || vm.timeChecker.getTime() - vm.lastPollErrorOccurMS > POLL_MAX_TIME + 2000){
      //      vm.pollInterval = POLL_MIN_TIME;
      //    }
      //  }, vm.pollIntervalTime);
      //}

      intervalCenter.add(0, 'task.controller', intervalFunc);


    });
    $scope.$on("$ionicView.leave", function () {
      //$interval.cancel(vm.pollInterval);
      //vm.pollInterval = undefined;

      // try to remove from intervalCenter
      intervalCenter.remove(0, 'task.controller', intervalFunc);
      intervalCenter.remove(1, 'task.controller', intervalFunc);
    });




    //////////////////////////////////////////////////
    // taskNet

    var _cb_failed = function (error) {
      console.error(error);
      //出错后将轮训间隔调大,减小服务器压力
      vm.pollIntervalTime = POLL_MAX_TIME;
      vm.lastPollErrorOccurMS = (new Date()).getTime();
    }

    //--------------------------------------------------

    var _processTaskForUI = function(taskList, isPoster) {
      if (isPoster == true) {
        for (var i in taskList) {
          taskList[i].ui_identifier = taskList[i].accepter != null ? "联系援助人" : "";
          taskList[i].ui_nickname = taskList[i].accepter != null ? taskList[i].accepter.nickname : "神秘大侠";
          taskList[i].ui_avatar = taskList[i].accepter != null ? taskList[i].accepter.avatar : "";
          taskList[i].ui_taskIcon = taskUtils.iconByTypeValue(taskList[i].taskTypesId);
          taskList[i].ui_taskTypeName = taskUtils.nameByTypeValue(taskList[i].taskTypesId);

          taskUtils.taskStateToUiState(taskList[i], taskList[i].status, true);
        }
      }
      else {
        for (var i in taskList) {
          taskList[i].ui_identifier = "联系求助人";
          taskList[i].ui_nickname = taskList[i].poster.nickname;
          taskList[i].ui_avatar = taskList[i].poster.avatar;
          taskList[i].ui_taskIcon = taskUtils.iconByTypeValue(taskList[i].taskTypesId);
          taskList[i].ui_taskTypeName = taskUtils.nameByTypeValue(taskList[i].taskTypesId);

          taskUtils.taskStateToUiState(taskList[i], taskList[i].status, false);
        }
      }
    }

    var _checkPostTaskGoing = function() {
      if(taskNetService.cache.isPostTaskGoingNeedRefresh == true) {
        $ionicLoading.show();
        vm.isNetSynchronizing = true;
        taskNetService.getUncompletedPostTaskList().then(function(taskList) {
          _processTaskForUI(taskList, true);
          if(vm.tabSelectedIndex==0 && vm.postTabSelectedIndex==0){
            vm.repeatList = taskList;
            vm.taskScroll.scrollTop();
          }
          $ionicLoading.hide();
          $timeout(function(){
            $scope.$apply();
          })
        }, _cb_failed).finally(function(){
          vm.isNetSynchronizing = false;
        })
      }
    };

    var _checkPostTaskFinish = function() {
      if(taskNetService.cache.isPostTaskFinishNeedRefresh == true) {
        $ionicLoading.show();
        vm.isNetSynchronizing = true;
        taskNetService.getCompletedPostTaskList(1, 15).then(function (taskList) {
          _processTaskForUI(taskList, true);
          if(vm.tabSelectedIndex==0 && vm.postTabSelectedIndex==1){
            vm.repeatList = taskList;
            vm.taskScroll.scrollTop();
          }
          $ionicLoading.hide();
          $timeout(function(){
            $scope.$apply();
          })
        }, _cb_failed).finally(function () {
          vm.isNetSynchronizing = false;
        })
      }
    };

    var _checkAcceptTaskGoing = function() {
      if(taskNetService.cache.isAcceptTaskGoingNeedRefresh == true) {
        $ionicLoading.show();
        vm.isNetSynchronizing = true;
        taskNetService.getUncompletedAcceptTaskList().then(function(taskList) {
          _processTaskForUI(taskList, false);
          if(vm.tabSelectedIndex==1 && vm.postTabSelectedIndex==0){
            vm.repeatList = taskList;
            vm.taskScroll.scrollTop();
          }
          $ionicLoading.hide();
          $timeout(function(){
            $scope.$apply();
          })
        }, _cb_failed).finally(function(){
          vm.isNetSynchronizing = false;
        })
      }
    };

    var _checkAcceptTaskFinish = function() {
      if(taskNetService.cache.isAcceptTaskFinishNeedRefresh == true) {
        $ionicLoading.show();
        vm.isNetSynchronizing = true;
        taskNetService.getCompletedAcceptTaskList(1, 15).then(function(taskList) {
          _processTaskForUI(taskList, false);
           if(vm.tabSelectedIndex==1 && vm.postTabSelectedIndex==1){
            vm.repeatList = taskList;
            vm.taskScroll.scrollTop();
          }
          $ionicLoading.hide();
          $timeout(function(){
            $scope.$apply();
          })
        }, _cb_failed).finally(function(){
          vm.isNetSynchronizing = false;
        })
      }
    };


    var checkTaskNewState = function () {
      _checkPostTaskGoing();
      _checkPostTaskFinish();
      _checkAcceptTaskGoing();
      _checkAcceptTaskFinish();
    }

    //--------------------------------------------------

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

      //checkPostTaskRefresh();
      //vm.repeatList = taskNetService.cache.postTaskList;

      // 首次进入,则拉取所有任务;非首次,检差刷新当前页

      if(ho.isValid(vm.hasClicked_cb_post) == false) {
        vm.hasClicked_cb_post = true;
      } else {
       if(vm.postTabSelectedIndex == 0) {
          vm.cb_taskPostGoing();
        }else {
          vm.cb_taskPostFinish();
        }
      }
    }

    //--------------------------------------------------
    vm.cb_accept = function () {
      console.log('accept');
      vm.tabSelectedIndex = 1;
      //将tab选中信息保存到delegate里
      widgetDelegate.getWidgetStatic('hoTabSet', 'task').last = 1;

      //checkAcceptTaskRefresh();
      //vm.repeatList = taskNetService.cache.acceptTaskList;

			 if(vm.acceptTabSelectedIndex == 0) {
				 vm.cb_taskAcceptGoing();
			 } else {
				 vm.cb_taskAcceptFinish();
			 }
    };

    /////////////////////////////////////

    vm.cb_taskPostGoing = function () {
      vm.postTabSelectedIndex = 0;

      //非第一次点击(控件初始化时会自动点击一次)
      if (ho.isValid(vm.hasClicked_cb_taskPostGoing) == false) {
        vm.hasClicked_cb_taskPostGoing = true;
      }else {
        vm.repeatList = taskNetService.cache.postTaskGoingList;
        _checkPostTaskGoing()
      }
      vm.taskScroll.scrollTop();
    };

    vm.cb_taskPostFinish = function () {
      vm.postTabSelectedIndex = 1;
      vm.repeatList = taskNetService.cache.postTaskFinishList;
      _checkAcceptTaskFinish();
      vm.taskScroll.scrollTop();
    };

    vm.cb_taskAcceptGoing = function () {
      vm.acceptTabSelectedIndex = 0;

      //非第一次点击(控件初始化时会自动点击一次)
      if (ho.isValid(vm.hasClicked_cb_taskAcceptGoing) == false) {
        vm.hasClicked_cb_taskAcceptGoing = true;
      }else {
        vm.repeatList = taskNetService.cache.acceptTaskGoingList;
        _checkAcceptTaskGoing()
      }
      vm.taskScroll.scrollTop();
    };

    vm.cb_taskAcceptFinish = function () {
      vm.acceptTabSelectedIndex = 1;
      vm.repeatList = taskNetService.cache.acceptTaskFinishList;
      _checkAcceptTaskFinish();
      vm.taskScroll.scrollTop();
    };

    /////////////////////////////////////
    vm.doRefresh = function () {
      //taskNetService.getPostTaskList().then(_cb_getPostTaskSuccess, _cb_failed).finally(function () {
      //  taskNetService.getAcceptTaskList().then(_cb_getAcceptTaskSuccess, _cb_failed).finally(function () {
      //    $scope.$broadcast('scroll.refreshComplete');
      //    $ionicLoading.hide();
      //  });
      //});

      taskNetService.getTaskList().then(function(taskList) {
        vm.repeatList = taskList.uncompletedPostList;
        _processTaskForUI(taskList.uncompletedPostList, true);
        _processTaskForUI(taskList.completedPostList, true);
        _processTaskForUI(taskList.uncompletedAcceptList, false);
        _processTaskForUI(taskList.completedAcceptList, false);
        if(vm.tabSelectedIndex==0 && vm.postTabSelectedIndex==0) {
          vm.repeatList = taskList.uncompletedPostList;
        }
        else if(vm.tabSelectedIndex==0 && vm.postTabSelectedIndex==1) {
          vm.repeatList = taskList.completedPostList;
        }
        else if(vm.tabSelectedIndex==1 && vm.acceptTabSelectedIndex==0) {
          vm.repeatList = taskList.uncompletedAcceptList;
        }
        else if(vm.tabSelectedIndex==1 && vm.acceptTabSelectedIndex==1) {
          vm.repeatList = taskList.completedAcceptList;
        }
        vm.taskScroll.scrollTop();
      }, _cb_failed).finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
      })
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

    var gotoComment = function (taskId, who) {
      $state.go('main.comment', {desc: who + '-' + taskId});
    };

    vm.gotoComment = function (taskId) {
      if (canClick()) {
        $state.go('main.comment', {desc: 'accepter-' + taskId});
        //$state.go('main.comment', {desc: 'accepter-' + '516'});
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
            function (data) {
              console.log(data);
              if (data.code == 200) {

                $ionicLoading.show({
                  duration: 1500,
                  templateUrl: 'modules/components/templates/ionic-loading/com-cancel-success.html'
                });
                $timeout(function() {
                  taskNetService.cache.isPostTaskFinishNeedRefresh = true;
                  taskNetService.cache.isPostTaskGoingNeedRefresh = true;
                }, 1500);
              } else {
              }
            }, function (data) {
              $ionicLoading.hide();
              $ionicPopup.alert({
                title: '错误提示',
                template: data
              }).then(function (res) {
                console.error(data);
              })
            }).finally(function () {
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
          taskNetService.confirmByPoster(task.id, 256).then(  //ask:xiaolang  status: success,failed
            function (data) {
							//vm.cb_post();
              $ionicLoading.show({
                duration: 1500,
                templateUrl: 'modules/components/templates/ionic-loading/com-submit-success.html'
              });
              $timeout(function() {
                taskNetService.cache.isPostTaskFinishNeedRefresh = true;
              }, 1500);

            }, function (data, status) {
              $ionicPopup.alert({
                title: '错误提示',
                template: data
              }).then(function (res) {
                console.error(data);
              })
            }).finally(function () {
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
              //console.log(data);
              //if (data.code == 200) {
              //  taskNetService.cache.isAcceptTaskFinishNeedRefresh = true;
              //  vm.cb_accept();
              //} else {
              //
              //}

              $ionicLoading.show({
                duration: 1500,
                templateUrl: 'modules/components/templates/ionic-loading/com-submit-success.html'
              });
              $timeout(function() {
                taskNetService.cache.isAcceptTaskFinishNeedRefresh = true;
              }, 1500);

            }, function (data) {
              $ionicLoading.hide();
              //temp
              $ionicPopup.alert({
                title: '错误提示',
                template: data
              }).then(function (res) {
                console.error(data);
              })
            }).finally(function () {
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
          $state.go('main.task_task-detail', {id: task.id})
        }
        else if (task.status == 2) {  //wait over time - 大侠召唤术
          console.log('大侠召唤术');
        }
        else if (task.status == 4) {  // going on
          console.error('invalid task opt: going on - post passive');
        }
        else if (task.status == 8) {  //going on overtime -- 评价
          gotoComment(task.id, 'poster');
        }
        else if (task.status == 32) { //acceptor cancel -- 评价
          if(task.posterCommentLevel == 0) {
            gotoComment(task.id, 'poster');
          }else{
            gotoTaskState(task.id);
          }
        }
        else if (task.status == 64) { //poster confirm success  -- 确认完成援助
          $ionicLoading.show();
          taskNetService.confirmByPoster(task.id, 128).then(  //ask:xiaolang  status: success,failed
            function (data) {
              //console.log(data);
              //if (data.code == 200) {
              //  taskNetService.cache.isPostTaskFinishNeedRefresh = true;
              //  vm.cb_post();
              //} else {
              //
              //}

              $ionicLoading.show({
                duration: 1500,
                templateUrl: 'modules/components/templates/ionic-loading/com-submit-success.html'
              });
              $timeout(function() {
                taskNetService.cache.isPostTaskGoingNeedRefresh = true;
              }, 1500);

            }, function (data, status) {
              $ionicLoading.show({
                duration: 1500,
                templateUrl: 'modules/components/templates/ionic-loading/com-submit-fail.html'
              });
              ho.alert(data);
            }).finally(function () {
            });
        }
        else if (task.status == 128) { //poster confirm success -- 评价
          if(task.posterCommentLevel == 0){
            gotoComment(task.id, 'poster');
          }else {
            gotoTaskState(task.id);
          }
        }
        else if (task.status == 256) { //poster confirm failed -- 评价
          if(task.posterCommentLevel == 0){
            gotoComment(task.id, 'poster');
          }else {
            gotoTaskState(task.id);
          }
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
            function (data) {
              //if (data.code == 200) {
              //  taskNetService.cache.isAcceptTaskGoingNeedRefresh = true;
              //  vm.cb_accept();
              //} else {
              //}

              $ionicLoading.show({
                duration: 1500,
                templateUrl: 'modules/components/templates/ionic-loading/com-submit-success.html'
              });
              $timeout(function() {
                taskNetService.cache.isAcceptTaskGoingNeedRefresh = true;
              }, 1500);

            }, function (data) {
              //$ionicPopup.alert({
              //  title: '错误提示',
              //  template: data
              //}).then(function (res) {
              //  console.error(data);
              //})
              $ionicLoading.show({
                duration: 1500,
                templateUrl: 'modules/components/templates/ionic-loading/com-submit-fail.html'
              });

              ho.alert(data);
            }).finally(function () {
            });
        }
        else if (task.status == 8) {  //going on overtime -- 评价
          gotoComment(task.id, 'accepter');
        }
        else if (task.status == 32) { //accepter cancel -- 查看评价
          gotoTaskState(task.id);
        }
        else if (task.status == 64) { //accepter confirm success
          console.error('invalid task opt: accepter confirm success - accepter active');
        }
        else if (task.status == 128) { //accepter confirm success -- 评价留言
          if(task.accepterCommentLevel == 0) {
            gotoComment(task.id, 'accepter');
          }else{
            gotoTaskState(task.id);
          }
        }
        else if (task.status == 256) { //accepter confirm failed -- 评价留言
          if(task.accepterCommentLevel == 0){
            gotoComment(task.id, 'accepter');
          }else{
            gotoTaskState(task.id);
          }
        }
      }
    }

  }
})
()
