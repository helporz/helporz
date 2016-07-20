/**
 * Created by Midstream on 16/4/11 .
 */

(function(){
  'use strict';

  angular.module('main.near.taskdetail')
    .factory('mainNearTaskDetailService', mainNearTaskDetailService)
    .controller('mainNearTaskDetailCtrl', ['$state', '$scope', '$ionicScrollDelegate', '$ionicLoading', '$ionicPopup', '$timeout', '$stateParams', 'taskNetService',
      'taskUtils', 'userNetService', 'impressUtils', 'timeUtils','SharePageWrapService',
      'mainNearTaskDetailService','userUtils','$ionicTabsDelegate','$ionicActionSheet',
      'feedbackService','taskNetWrapper','promptService',
      mainNearTaskDetailCtrl]);


  function mainNearTaskDetailService(){
    return {
      task: {}
    }
  }

  function mainNearTaskDetailCtrl($state, $scope, $ionicScrollDelegate, $ionicLoading, $ionicPopup, $timeout, $stateParams, taskNetService,
                                  taskUtils, userNetService, impressUtils, timeUtils,SharePageWrapService,
                                  mainNearTaskDetailService,userUtils,$ionicTabsDelegate,$ionicActionSheet,
                                  feedbackService, taskNetWrapper, promptService)
  {
    console.log($stateParams);

    var vm = $scope.vm = {};
    vm.sharePageService = SharePageWrapService;
    $scope.$on("$ionicView.beforeEnter", function() {
      // 直接从near的cache里获取,而不是从新从服务器取
      vm.task = taskNetService.getTaskInNearList($stateParams.id);
      if(ho.isValid(vm.task)==false){
        vm.task = taskNetService.getTaskInPostList($stateParams.id);
      }
      //如果不在以上列表,那么从service获取
      if(ho.isValid(vm.task)==false) {
        vm.task = mainNearTaskDetailService.task;
      }

      vm.task.icon = taskUtils.iconByTypeValue(vm.task.taskTypesId);
      vm.task.typeName = taskUtils.nameByTypeValue(vm.task.taskTypesId);
      vm.task.commentCount = vm.task.commentList ? vm.task.commentList.length : 0;


      var myId = userNetService.cache.selfInfo.userId;

      for(var cmtIdx in vm.task.commentList){
				//计算出发帖和现在的时间差
        var item = vm.task.commentList[cmtIdx];
				var pieces = item.created.split(/[\:\-\s]/);
				if (pieces.length != 6) alert('network err: task created time is not valid')
				var before = new Date(pieces[0], parseInt(pieces[1]) - 1, pieces[2], pieces[3], pieces[4], pieces[5]);
				item.ui_createTime = timeUtils.formatSimpleTimeBeforeNow(before);
        item.ui_isMyTask = vm.task.poster.userId == myId;

        //item.ui_createTime = item.created | DateShow;
        item.ui_canContact = vm.task.poster.userId == myId && item.commentator != myId;
      }


      // impresses
      vm.task.ui_tags = [];
      impressUtils.netTagsToUiTags(vm.task.ui_tags, vm.task.poster.tags);

      // has been accepted
      vm.ui_taskAccepte = false;
      //todo 6-20
      //该帖已不存在,3秒后回到帖子列表


      $timeout( function() {
          $scope.$apply();
        },
        0
      );
    });

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

    vm.cb_moreOpt = function() {
      var sheet = {};
      sheet.titleText = '举报该任务';
      sheet.cancelText = '取消';
      sheet.buttonClicked = function(index) {
        $ionicLoading.hide();
        feedbackService.reportTask(vm.task.id, index+1, feedbackService.reportTypes[index].text).then(
          function (data) {
            $ionicLoading.show({
              duration: 1500,
              templateUrl: 'modules/components/templates/ionic-loading/com-submit-success.html'
            });
          }, function (err) {
            promptService.promptMessage(err, 1500);
          }).finally(function () {
          });
        return true;
      };
      sheet.buttons = feedbackService.reportTypes;

      $ionicActionSheet.show(sheet);
      return true;
    };

    vm.cb_gotoUser = function(userId) {
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

    vm.cb_acceptTask = function(){
      if(userNetService.cache.selfInfo == null){
        alert('未登录');
        return;
      }

      if(userNetService.cache.selfInfo.userId == vm.task.poster.userId) {
        $ionicLoading.show({
          duration: 1500,
          templateUrl: 'modules/components/templates/ionic-loading/task-cannot-accept-self-post.html'
        });
        return;
      }

      //$ionicLoading.show();
      //taskNetService.acceptTask(vm.task.id).then(
      //  function (data) {
      //    console.log(data);
      //    if (data.code == 200) {
      //      //成功
      //      taskNetService.cache.isNearTaskNeedRefresh = true;
      //      taskNetService.cache.isAcceptTaskGoingNeedRefresh = true;
      //      $ionicLoading.show({
      //        duration: 1500,
      //        templateUrl: 'modules/components/templates/ionic-loading/task-accept-success.html'
      //      });
      //      $timeout(function(){
      //        $state.go('main.near');
      //      }, 1500);
      //    } else {
      //      //失败
      //      //temp:
      //      taskNetService.cache.isNearTaskNeedRefresh = true;
      //      $ionicLoading.show({
      //        duration: 1500,
      //        templateUrl: 'modules/components/templates/ionic-loading/task-not-exist.html'
      //      });
      //
      //    }
      //
      //
      //  }, function (data) {
      //    //temp:
      //    $ionicLoading.show({
      //      duration: 1500,
      //      templateUrl: 'modules/components/templates/ionic-loading/task-not-exist.html'
      //    })
      //
      //    $timeout(function() {
      //      $state.go('main.near');
      //    }, 1500)
      //  }).finally(function () {
      //  });

      taskNetWrapper.acceptTask(task, function () {
        $timeout(function () {
          $state.go('main.near');
        }, 1500);
      });
    }

    vm.input = '';

    vm.viewScroll = $ionicScrollDelegate.$getByHandle('taskDetailScroll');
    window.addEventListener("native.keyboardshow", function(e){
      //vm.viewScroll.scrollBottom();
    });

    vm.testShow = function() {
      ionic.trigger('native.keyboardshow');
    }

    vm.testHide = function() {
      ionic.trigger('native.keyboardhide');
    }

    vm.send = function() {
      $ionicLoading.show();

      taskNetService.commentTask(vm.task.id, vm.input).then(
        function (data) {
          console.log(data);
          if (data.code == 200) {
            //成功
            vm.input = '';

            var taskNow = data.data;
            vm.ui_taskAccepted = taskNow.status != 0;
            vm.ui_canContact = taskNow.poster.userId == userNetService.cache.selfInfo.userId;
            vm.task.commentList = taskNow.commentList;
            vm.task.commentCount = vm.task.commentList.length;

            $ionicLoading.show({
              duration: 1500,
              templateUrl: 'modules/components/templates/ionic-loading/comment-success.html'
            });
            // test:
            //$timeout(function() {
            //  $state.go('main.near');
            //}, 1500);
          } else {
            $ionicLoading.show({
              duration: 1500,
              templateUrl: 'modules/components/templates/ionic-loading/task-not-exist.html'
            })

            $timeout(function() {
              $state.go('main.near');
            }, 1500);
          }
        }, function (data, status) {
          //$ionicPopup.alert({
          //  title: '错误提示',
          //  template: data.data.message
          //}).then(function (res) {
          //  console.error(data);
          //})
          ////lkj temp:
          //vm.input = '发送中产生错误';
          //$ionicLoading.hide();
          promptService.promptErrorInfo(data, 1500);
        }).finally(function () {
        });
    }

    vm.cb_contact = function() {

    }

  }
})()
