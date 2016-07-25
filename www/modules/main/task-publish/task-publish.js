/**
 * Created by binfeng on 16/4/13.
 */
;
(function () {
  'use strict';
  angular.module('com.helporz.task.publish', ['ionic', 'com.helporz.task.netservice', 'ngCordova.plugins.datePicker',
    'app.task.utils.service']).config(publishConfigFn)
    .controller('testTaskPublishController', testTaskPublishControllerFn)
    .controller('taskPublishController', taskPublishControllerFn)
    .controller('taskPublishListController', taskPublishListControllerFn)
    .factory('taskPublishModalService', taskPublishModalServiceFn);


  function taskPublishModalServiceFn() {
    var listModal = null;
    var taskPublishModal = null;

    var _setListModal = function (modal) {
      listModal = modal;
    }

    var _getListModal = function () {
      return listModal;
    }

    var _setTaskPublishModal = function (modal) {
      taskPublishModal = modal;
    }

    var _getTaskPublishModal = function () {
      return taskPublishModal;
    }


    return {
      setListModal: _setListModal,
      getListModal: _getListModal,
      setTaskPublishModal: _setTaskPublishModal,
      getTaskPublishModal: _getTaskPublishModal
    }

  }

  publishConfigFn.$inject = ['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider'];
  function publishConfigFn($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $stateProvider.state(
      'publish-list',
      {
        url: '/task/publish/list',
        templateUrl: 'modules/main/task-publish/test-list.html',
        controller: 'testTaskPublishController'
      })
      .state(
      'task-publish',
      {
        url: '/task/publish/post',
        templateUrl: 'modules/main/task-publish/task-publish.html',
        controller: 'taskPublishController'
      });
  }

  testTaskPublishControllerFn.$inject = ['$scope', '$log', '$ionicModal', '$ionicPopup', 'taskPublishModalService'];
  function testTaskPublishControllerFn($scope, $log, $ionicModal, $ionicPopup, taskPublishModalService) {
    $ionicModal.fromTemplateUrl('modules/main/task-publish/modal-list.html', {
      scope: $scope,
      animation: "slide-in-up"
    }).then(function (modal) {
      $scope.publishListModal = modal;
      taskPublishModalService.setListModal(modal);
    });

    $scope.showPublishList = function () {
      $scope.publishListModal.show();
    }
  }

  taskPublishListControllerFn.$inject = ['$scope', '$log', '$ionicModal', '$ionicLoading', 'taskPublishModalService', 'taskUtils', 'taskDesc', '$timeout'];
  function taskPublishListControllerFn($scope, $log, $ionicModal, $ionicLoading, taskPublishModalService, taskUtils, taskDesc, $timeout) {


    $ionicModal.fromTemplateUrl('modules/main/task-publish/task-publish.html', {
      scope: $scope,
      animation: "slide-in-up"
    }).then(function (modal) {
      taskPublishModalService.setTaskPublishModal(modal);
    });


    this.cancel = function () {
      var modal = taskPublishModalService.getListModal();
      if (modal) {
        modal.hide();
      }
    };


    this.publishShaodai = function () {
      publishTask($scope, 0, taskPublishModalService, taskUtils, taskDesc, $timeout);
    };

    this.publishQingbao = function () {
      publishTask($scope, 1, taskPublishModalService, taskUtils, taskDesc, $timeout);
    };

    this.publishJiebao = function () {
      publishTask($scope, 2, taskPublishModalService, taskUtils, taskDesc, $timeout);
      $ionicLoading.show({
        duration: 2000,
        template: '借用物品须向对方出示学生证'
      });
    }
  }

  function publishTask($scope, taskIndex, taskPublishModalService, taskUtils, taskDesc, $timeout) {
    var listModal = taskPublishModalService.getListModal();

    $scope.taskTypeIndex = taskIndex;
    $scope.subTaskArray = buildSubTaskTypeArray(taskUtils, taskDesc, $scope.taskTypeIndex);
    $scope.publishTaskTypeName = taskDesc[$scope.taskTypeIndex].name;
    if (taskIndex == 0) {
      $scope.taskLogo = "./img/task/publish/shaodai-logo.png";
    }
    else if (taskIndex == 1) {
      $scope.taskLogo = "./img/task/publish/qingbao-logo.png";
    }
    else if (taskIndex == 2) {
      $scope.taskLogo = "./img/task/publish/jiebao-logo.png";
    }

    //$scope.selectedSubTask = $scope.subTaskArray[0];
    //$scope.selectedSubTask = null;

    var publishModal = taskPublishModalService.getTaskPublishModal();
    //$timeout(function() {
    listModal.hide();
    //},1000);
    //$timeout(function(){
    //  $scope.selectedSubTask = null;
    //  $scope.$apply()
    publishModal.show();
    //})
  }

  function cleanTaskControllerStatus(ctlObj) {
    ctlObj.returnTime = ctlObj.deadline = ctlObj.summary = ctlObj.pubLocation = null;
    ctlObj.selectedRewardType = ctlObj.selectedSubRewardType = 0;
    ctlObj.returnTimeShow = ctlObj.deadlineShow = null;
  }

  function buildSubTaskTypeArray(taskUtils, taskDesc, taskIndex) {
    var subTaskArray = new Array();

    var subtypes = taskDesc[taskIndex].subtype;

    for (var idx = 0; idx < subtypes.length; ++idx) {
      var st = subtypes[idx];
      var item = {};
      item.index = idx;
      item.type = taskUtils.typeValue(taskIndex, idx);
      item.name = st.name;
      item.holder = st.holder;
      item.icon = taskUtils.iconByTypeValue(item.type);
      subTaskArray.push(item);
    }
    return subTaskArray;
  }


  taskPublishControllerFn.$inject = ['$scope', '$log', '$ionicModal', '$ionicPopup', '$ionicPopover', '$ionicLoading', '$timeout', '$cordovaDatePicker',
    'taskPublishModalService', 'taskNetService', 'taskUtils', 'taskDesc', 'promptService', 'SharePageService', 'NoticeMessageService'];
  function taskPublishControllerFn($scope, $log, $ionicModal, $ionicPopup, $ionicPopover, $ionicLoading, $timeout, $cordovaDatePicker,
                                   taskPublishModalService, taskNetService, taskUtils, taskDesc, promptService, SharePageService, NoticeMessageService) {
    var _ctlSelf = this;

    this.setRewardType = function (reward, subReward) {
      _ctlSelf.selectedRewardType = reward;
      _ctlSelf.selectedSubRewardType = subReward;
    }

    var closeModalProcess = function () {
      var publishModal = taskPublishModalService.getTaskPublishModal();
      publishModal.hide();
      cleanTaskControllerStatus(_ctlSelf);

      $scope.selectedSubTask = null;
    }

    this.closeModal = closeModalProcess;

    this.deadline = null;//new Date();
    this.returnTime = null;//new Date();

    this.setDeadline = function (event) {
      event.preventDefault();

      var currentDate = new Date();

      var options = {
        date: currentDate,
        mode: 'datetime'
      };
      $cordovaDatePicker.show(options).then(function (date) {
        if (date - currentDate < 0) {
          promptService.promptMessage("需要设置晚于当前时间的日期");
        }
        else if (_ctlSelf.returnTime != null && _ctlSelf.returnTime - date < 0) {
          promptService.promptMessage("开始时间要设置早于截止时间");
        }
        else {
          _ctlSelf.deadline = date;
          $log.info('set start time:' + date);
          _ctlSelf.deadlineShow = getDateShowString(date);
        }
      }, function (error) {
        //ho.alert(error);
      });
    }

    this.setReturnTime = function (event) {
      event.preventDefault();
      var currentDate = new Date();

      var options = {
        date: currentDate,
        mode: 'datetime'
      };
      $cordovaDatePicker.show(options).then(function (date) {
        if (date - currentDate < 0) {
          promptService.promptMessage("需要设置晚于当前时间的日期");
        }
        else if (_ctlSelf.deadline != null && _ctlSelf.deadline - date > 0) {
          promptService.promptMessage("截止时间要设置晚于开始时间");
        }
        else {
          _ctlSelf.returnTime = date;
          $log.info('set return time:' + date)
          _ctlSelf.returnTimeShow = getDateShowString(date);
        }
      }, function (error) {
      });
    }

    //ctlObj.selectedSubTask = ctlObj.subTaskArray[0];

    this.selectedSubType = function (index) {
      $scope.selectedSubTask = $scope.subTaskArray[index];
      _ctlSelf.popup.close();
    }

    this.cancelSelectSubType = function () {
      _ctlSelf.popup.close();
    }

    this.selectSubTaskType = function () {
      var popupScope = $scope.$new();

      popupScope.subTypeList = $scope.subTaskArray;
      popupScope.selectedSubType = _ctlSelf.selectedSubType;
      popupScope.cancel = _ctlSelf.cancelSelectSubType;
      popupScope.typeName = $scope.publishTaskTypeName;
      _ctlSelf.popup = $ionicPopup.show(
        {
          templateUrl: 'modules/main/task-publish/select-subtype-popup.html',
          title: null,
          subTitle: null,
          scope: popupScope
        }
      );
    }


    this.publish = function () {

      function _popPublishSuccessPage(taskId) {
        var _pov;

        function _share(index) {
          SharePageService.shareTask(taskId, index);
        }

        function _close() {
          var po = _pov.$el[0].querySelector('#task-publish-success-popup');
          po.style.opacity = '0';
          //$timeout(function(){
          _pov.hide();
          //},300);

          NoticeMessageService.addLocalUnreadMessage(taskId, NoticeMessageService.NOTICE_TYPE.POSTER_UNCOMPLETED_TASK_MESSAGE_TYPE, '发送求助成功');
          if (taskNetService.cache.nm_postGoing == null) {
            taskNetService.cache.nm_postGoing = new Array();
          }
          taskNetService.cache.nm_postGoing.push(
            NoticeMessageService.createLocalUnreadMessage(taskId, NoticeMessageService.NOTICE_TYPE.POSTER_UNCOMPLETED_TASK_MESSAGE_TYPE, '发送求助成功'));

          _ctlSelf.closeModal();
          // 加入标志量,以供其他页面update
          taskNetService.cache.isPostTaskGoingNeedRefresh = true;
          taskNetService.cache.isNearTaskNeedRefresh = true;
          taskNetService.cache.nm_main_changed = true;
          taskNetService.cache.nm_task_changed = true;
        }

        var popupScope = $scope.$new();
        popupScope.share = _share;
        popupScope.close = _close;
        $ionicPopover.fromTemplateUrl('modules/main/task-publish/publish-success-popup.html', {
          title: null,
          subTitle: null,
          scope: popupScope
        }).then(function (pov) {
          //ho.alertObject(pov);
          _pov = pov;
          _pov.show();

          var po = _pov.$el[0].querySelector('#task-publish-success-popup');
          $timeout(function () {
            po.style.opacity = '1';
          })
        });
      }

      var errMsg = '';
      ////////////////////////////////////////////////
      //为了方便浏览器调试增加如下代码

      if (g_isDebug == true && _ctlSelf.deadline == null) {
        _ctlSelf.returnTime = new Date();
        _ctlSelf.deadline = new Date();
        _ctlSelf.deadline.setMonth(_ctlSelf.deadline.getMonth() + 1);
        _ctlSelf.returnTime.setMonth(_ctlSelf.returnTime.getMonth() + 2);
      }

      //if (_ctlSelf.startTime == null && _ctlSelf.startTimeShow != null) {
      //  _ctlSelf.startTime = new Date(_ctlSelf.startTimeShow);
      //}
      //
      //if (_ctlSelf.deadline == null && _ctlSelf.deadlineShow != null) {
      //  _ctlSelf.deadline = new Date(_ctlSelf.deadlineShow);
      //}
      ////////////////////////////////////////////////
      if (ho.isValid($scope.selectedSubTask) == false || ho.isValid($scope.selectedSubTask.type) == false) {
        $ionicLoading.show({
          duration: 1500,
          template: '请选择求助类别'
        });
        return;
      }

      if (ho.isValid(_ctlSelf.summary) == false || _ctlSelf.summary === '') {
        //alert("请输入求助类型");
        $ionicLoading.show({
          duration: 1500,
          template: '请输入求助内容'
        });
        return;
      }

      if (ho.isValid(_ctlSelf.pubLocation) == false || _ctlSelf.pubLocation === '') {
        //alert("请输入见面地址");
        $ionicLoading.show({
          duration: 1500,
          template: '请输入见面地址'
        });
        return;
      }

      if (ho.isValid(_ctlSelf.deadline) == false) {
        //alert("请选择截止时间");
        $ionicLoading.show({
          duration: 1500,
          template: '请选择截止时间'
        });
        return;
      }

      if (ho.isValid(_ctlSelf.selectedRewardType) == false || ho.isValid(_ctlSelf.selectedSubRewardType) == false) {
        //alert("请选择感谢方式");
        $ionicLoading.show({
          duration: 1500,
          template: '请选择感谢方式'
        })
        return;
      }

      $ionicLoading.show();

      taskNetService.postTask($scope.selectedSubTask.type,
        _ctlSelf.summary,
        _ctlSelf.pubLocation,
        getDateSendString(_ctlSelf.returnTime),
        getDateSendString(_ctlSelf.deadline)
        , 0.0, 0.0,
        _ctlSelf.selectedRewardType,
        _ctlSelf.selectedSubRewardType, 1, 0).then(function (res) {
          var taskId = res.data.task_id;

          //$ionicLoading.show({
          //  duration: 1500,
          //  templateUrl: 'modules/components/templates/ionic-loading/task-post-success.html'
          //})
          //$timeout(function() {
          //  _ctlSelf.closeModal();
          //
          //  // 加入标志量,以供其他页面update
          //  taskNetService.cache.isPostTaskGoingNeedRefresh = true;
          //  taskNetService.cache.isNearTaskNeedRefresh = true
          //}, 1500)

          $ionicLoading.hide();
          _popPublishSuccessPage(taskId);

          //alert("发布任务成功");
        }, function (error) {
          ////alert("发布任务失败:" + error);
          //$ionicLoading.show({
          //  duration: 1500,
          //  templateUrl: 'modules/components/templates/ionic-loading/com-network-error.html'
          //})
          $ionicLoading.hide();
          if (error == 501 || error == 510) {
            closeModalProcess();
          }
          else {
            promptService.promptMessage(error, 1500);
          }

        });
    }
  }


  function getDateShowString(d) {
    if (d == null) {
      return null;
    }
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var day = d.getDay();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    var ms = d.getMilliseconds();
    var curDateTime = year;
    if (month > 9)
      curDateTime = curDateTime + "年" + month;
    else
      curDateTime = curDateTime + "年0" + month;
    if (date > 9)
      curDateTime = curDateTime + "日" + date;
    else
      curDateTime = curDateTime + "日0" + date;
    if (hours > 9)
      curDateTime = curDateTime + " " + hours;
    else
      curDateTime = curDateTime + " 0" + hours;
    if (minutes > 9)
      curDateTime = curDateTime + ":" + minutes;
    else
      curDateTime = curDateTime + ":0" + minutes;
    //if (seconds > 9)
    //  curDateTime = curDateTime + ":" + seconds;
    //else
    //  curDateTime = curDateTime + ":0" + seconds;
    return curDateTime;
  }

  function getDateSendString(d) {
    if (d == null) {
      return null;
    }
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var day = d.getDay();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    var ms = d.getMilliseconds();
    var curDateTime = year;
    if (month > 9)
      curDateTime = curDateTime + "/" + month;
    else
      curDateTime = curDateTime + "/0" + month;
    if (date > 9)
      curDateTime = curDateTime + "/" + date;
    else
      curDateTime = curDateTime + "/0" + date;
    if (hours > 9)
      curDateTime = curDateTime + " " + hours;
    else
      curDateTime = curDateTime + " 0" + hours;
    if (minutes > 9)
      curDateTime = curDateTime + ":" + minutes;
    else
      curDateTime = curDateTime + ":0" + minutes;
    if (seconds > 9)
      curDateTime = curDateTime + ":" + seconds;
    else
      curDateTime = curDateTime + ":0" + seconds;
    return curDateTime;
  }
})
();

