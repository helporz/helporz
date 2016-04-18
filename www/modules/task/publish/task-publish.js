/**
 * Created by binfeng on 16/4/13.
 */
;
(function () {
  'use strict';
  angular.module('com.helproz.task.publish', ['ionic', 'com.helporz.task.netservice', 'ngCordova.plugins.datePicker',
    'app.task.utils.service']).config(publishConfigFn)
    .controller('testTaskPublishController', testTaskPublishControllerFn)
    .controller('taskPublishListController', taskPublishListControllerFn)
    .controller('shaodaiPublishController', shaodaiPublishControllerFn)
    .controller('qingbaoPublishController', qingbaoPublishControllerFn)
    .controller('jiebaoPublishController', jiebaoPublishControllerFn)
    .factory('taskPublishModalService', taskPublishModalServiceFn);

  function taskPublishModalServiceFn() {
    var listModal = null;
    var shaodaiModal = null;
    var qingbaoModal = null;
    var jiebaoModal = null;

    var _setListModal = function (modal) {
      listModal = modal;
    }

    var _getListModal = function () {
      return listModal;
    }

    var _setShaodaiModal = function (modal) {
      shaodaiModal = modal;
    }

    var _getShaodaiModal = function () {
      return shaodaiModal;
    }

    var _setQingbaoModal = function (modal) {
      qingbaoModal = modal;
    }

    var _getQingbaoModal = function () {
      return qingbaoModal;
    }

    var _setJiebaoModal = function (modal) {
      jiebaoModal = modal;
    }

    var _getJiebaoModal = function (modal) {
      return jiebaoModal;
    }

    return {
      setListModal: _setListModal,
      getListModal: _getListModal,
      setShaodaiModal: _setShaodaiModal,
      getShaodaiModal: _getShaodaiModal,
      setQingbaoModal: _setQingbaoModal,
      getQingbaoModal: _getQingbaoModal,
      setJiebaoModal: _setJiebaoModal,
      getJiebaoModal: _getJiebaoModal
    }

  }

  publishConfigFn.$inject = ['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider'];
  function publishConfigFn($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $stateProvider.state(
      'publish-list',
      {
        url: '/task/publish/list',
        templateUrl: 'modules/task/publish/test-list.html',
        controller: 'testTaskPublishController'
      }).state(
      'shaodai',
      {
        url: '/task/publish/shaodai',
        templateUrl: 'modules/task/publish/shaodai.html',
        controller: 'shaodaiPublishController'
      }).state(
      'qingbao',
      {
        url: '/task/publish/qingbao',
        templateUrl: 'modules/task/publish/qingbao.html',
        controller: 'qingbaoPublishController'
      }).state(
      'jiebao',
      {
        url: '/task/publish/jiebao',
        templateUrl: 'modules/task/publish/jiebao.html',
        controller: 'jiebaoPublushController'
      });
  }

  testTaskPublishControllerFn.$inject = ['$scope', '$log', '$ionicModal', '$ionicPopup', 'taskPublishModalService'];
  function testTaskPublishControllerFn($scope, $log, $ionicModal, $ionicPopup, taskPublishModalService) {
    $ionicModal.fromTemplateUrl('modules/task/publish/modal-list.html', {
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

  taskPublishListControllerFn.$inject = ['$scope', '$log', '$ionicModal', 'taskPublishModalService'];
  function taskPublishListControllerFn($scope, $log, $ionicModal, taskPublishModalService) {
    $ionicModal.fromTemplateUrl('modules/task/publish/shaodai.html', {
      scope: $scope,
      animation: "slide-in-up"
    }).then(function (modal) {
      taskPublishModalService.setShaodaiModal(modal);
    });

    $ionicModal.fromTemplateUrl('modules/task/publish/qingbao.html', {
      scope: $scope,
      animation: "slide-in-up"
    }).then(function (modal) {
      taskPublishModalService.setQingbaoModal(modal);
    });

    $ionicModal.fromTemplateUrl('modules/task/publish/jiebao.html', {
      scope: $scope,
      animation: "slide-in-up"
    }).then(function (modal) {
      taskPublishModalService.setJiebaoModal(modal);
    });

    this.cancel = function () {
      var modal = taskPublishModalService.getListModal();
      if (modal) {
        modal.hide();
      }
    };

    this.publishShaodai = function () {
      var listModal = taskPublishModalService.getListModal();
      var publishModal = taskPublishModalService.getShaodaiModal();
      listModal.hide();
      publishModal.show();
    };

    this.publishQingbao = function () {
      var listModal = taskPublishModalService.getListModal();
      var publishModal = taskPublishModalService.getQingbaoModal();
      listModal.hide();
      publishModal.show();
    };

    this.publishJiebao = function () {
      var listModal = taskPublishModalService.getListModal();
      var publishModal = taskPublishModalService.getJiebaoModal();
      listModal.hide();
      publishModal.show();
    }
  }

  function TaskPublishBaseControllerFn($scope, $log, $ionicModal, $ionicPopup, $cordovaDatePicker,
                                       taskPublishModalService, taskNetService,ctlObj)  {
    ctlObj.setStartTime = function () {
      var currentDate = new Date();

      var options = {
        date: currentDate,
        mode: 'datetime'
      };
      $cordovaDatePicker.show(options).then(function (date) {
        if( date - currentDate < 0 ) {
          alert("需要设置晚于当前时间的日期");
        }
        else if( ctlObj.deadline != null && ctlObj.deadline - date < 0 ) {
          alert("开始时间要设置早于截止时间");
        }
        else {
          ctlObj.startTime = date;
        }
      },function(error) {
        alert(error);
      });
    }

    ctlObj.setDeadline = function () {
      var currentDate = new Date();

      var options = {
        date: currentDate,
        mode: 'datetime'
      };
      $cordovaDatePicker.show(options).then(function (date) {
        if( date - currentDate < 0 ) {
          alert("需要设置晚于当前时间的日期");
        }
        else if( ctlObj.startTime != null && ctlObj.startTime - date > 0) {
          alert("截止时间要设置晚于开始时间");
        }
        else {
          ctlObj.deadline = date;
        }
      },function(error) {
        alert(error);
      });
    }

    ctlObj.selectedSubTask = ctlObj.subTaskArray[0];

    ctlObj.selectedSubType = function (index) {
      ctlObj.selectedSubTask = ctlObj.subTaskArray[index];
      ctlObj.popup.close();
    }

    ctlObj.cancelSelectSubType = function () {
      ctlObj.popup.close();
    }
    var popupScope = $scope.$new();

    popupScope.subTypeList = ctlObj.subTaskArray;
    popupScope.selectedSubType = ctlObj.selectedSubType;
    popupScope.cancel = ctlObj.cancelSelectSubType;
    popupScope.typeName = ctlObj.taskTypeName;

    ctlObj.selectedRewardType = 0;
    ctlObj.selectedSubRewardType = 0;
    ctlObj.selectSubTaskType = function () {
      ctlObj.popup = $ionicPopup.show(
        {
          templateUrl: 'modules/task/publish/select-subtype-popup.html',
          title: null,
          subTitle: null,
          scope: popupScope
        }
      );
    }

    ctlObj.setRewardType = function (reward, subReward) {
      ctlObj.selectedRewardType = reward;
      ctlObj.selectedSubRewardType = subReward;
    }

    ctlObj.publish = function () {
      var errMsg = '';
      if (ctlObj.selectedRewardType == 0 || ctlObj.selectedSubRewardType == 0) {
        alert("请选择感谢方式");
        return;
      }

      if (ctlObj.summary === '') {
        alert("请输入求助类型");
        return;
      }

      if (ctlObj.deadline == null) {
        alert("请选择截止时间");
        return;
      }

      if (ctlObj.pubLocation == null || ctlObj.pubLocation === '') {
        alert("请见面地址");
        return;
      }

      taskNetService.postTask(ctlObj.selectedSubTask.type,
        ctlObj.summary,
        ctlObj.pubLocation,
        ctlObj.startTime, ctlObj.deadline
        ,0.0 , 0.0,
        ctlObj.selectedRewardType,
        ctlObj.selectedSubRewardType, 1, 0).then(function() {
          alert("发布任务成功");
          ctlObj.closeModal();
        },function(error) {
          alert("发布任务失败:" + error);
        });
    }
  }

  function cleanTaskControllerStatus(ctlObj) {
    ctlObj.startTime = ctlObj.deadline =ctlObj.summary = ctlObj.pubLocaction = null;
    ctlObj.selectedRewardType = ctlObj.selectedSubRewardType = 0;
  }

  function buildSubTaskTypeArray(taskUtils,taskDesc,taskIndex) {
    var subTaskArray = new Array();

    var subtypes = taskDesc[taskIndex].subtype;

    for(var idx = 0; idx < subtypes.length; ++idx) {
      var st = subtypes[idx];
      var item = {};
      item.index = idx;
      item.type = taskUtils.typeValue(taskIndex,idx);
      item.name = st.name;
      item.holder = st.holder;
      item.icon = taskUtils.iconByTypeValue(item.type);
      subTaskArray.push(item);
    }
    return subTaskArray;
  }

  shaodaiPublishControllerFn.$inject = ['$scope', '$log', '$ionicModal', '$ionicPopup',
    '$cordovaDatePicker', 'taskPublishModalService', 'taskNetService','taskUtils','taskDesc'];
  function shaodaiPublishControllerFn($scope, $log, $ionicModal, $ionicPopup, $cordovaDatePicker, taskPublishModalService, taskNetService,
  taskUtils,taskDesc) {
    //this.subTaskArray = new Array(
    //  {index: 0, type: 0, name: '捎带餐饮'}, {index: 1, type: 1, name: '超市捎带'}, {index: 2, type: 2, name: '捎带水果'}
    //);

    this.subTaskArray = buildSubTaskTypeArray(taskUtils,taskDesc,0);
    this.taskTypeName = "捎带侠";
    this.deadline = null;
    this.startTime = null;
    var _ctlSelf = this;

    this.closeModal = function () {
      var publishModal = taskPublishModalService.getShaodaiModal();
      publishModal.hide();
      cleanTaskControllerStatus(_ctlSelf);
    };

    TaskPublishBaseControllerFn($scope, $log, $ionicModal, $ionicPopup, $cordovaDatePicker,
      taskPublishModalService, taskNetService,this);

    //this.cancel = function() {
    //  _ctlSelf.closeModal();
    //}


    //this.setDeadline = function () {
    //  var currentDate = new Date();
    //
    //  var options = {
    //    date: currentDate,
    //    mode: 'datetime'
    //  };
    //  $cordovaDatePicker.show(options).then(function (date) {
    //    if( date - currentDate < 0 ) {
    //      alert("需要设置晚于当前时间的日期");
    //    }
    //    else {
    //      _ctlSelf.deadline = date;
    //    }
    //  },function(error) {
    //    alert(error);
    //  });
    //}
    //
    //this.selectedSubTask = this.subTaskArray[0];
    ////$scope.shaodaiPublishController = this;
    //
    //
    //this.selectedSubType = function (index) {
    //  _ctlSelf.selectedSubTask = _ctlSelf.subTaskArray[index];
    //  _ctlSelf.popup.close();
    //}
    //
    //this.cancelSelectSubType = function () {
    //  _ctlSelf.popup.close();
    //}
    //var popupScope = $scope.$new();
    //
    //popupScope.subTypeList = this.subTaskArray;
    //popupScope.selectedSubType = this.selectedSubType;
    //popupScope.cancel = this.cancelSelectSubType;
    //popupScope.typeName = this.taskTypeName;
    //
    //this.selectedRewardType = 0;
    //this.selectedSubRewardType = 0;
    //this.selectSubTaskType = function () {
    //  _ctlSelf.popup = $ionicPopup.show(
    //    {
    //      templateUrl: 'modules/task/publish/select-subtype-popup.html',
    //      title: null,
    //      subTitle: null,
    //      scope: popupScope
    //    }
    //  );
    //}
    //
    //this.setRewardType = function (reward, subReward) {
    //  _ctlSelf.selectedRewardType = reward;
    //  _ctlSelf.selectedSubRewardType = subReward;
    //}
    //
    //this.publish = function () {
    //  var errMsg = '';
    //  if (_ctlSelf.selectedRewardType == 0 || _ctlSelf.selectedSubRewardType == 0) {
    //    alert("请选择感谢方式");
    //    return;
    //  }
    //
    //  if (_ctlSelf.summary === '') {
    //    alert("请输入求助类型");
    //    return;
    //  }
    //
    //  //_ctlSelf.deadline = '2016/4/15 16:30:01';
    //  if (_ctlSelf.deadline == null) {
    //    alert("请选择截止时间");
    //    return;
    //  }
    //
    //  if (_ctlSelf.pubLocation == null || _ctlSelf.pubLocation === '') {
    //    alert("请见面地址");
    //    return;
    //  }
    //
    //  taskNetService.postTask(_ctlSelf.selectedSubTask.type,
    //    _ctlSelf.summary,
    //    _ctlSelf.pubLocation,
    //    _ctlSelf.startTime, _ctlSelf.deadline
    //    ,0.0 , 0.0,
    //    _ctlSelf.selectedRewardType,
    //    _ctlSelf.selectedSubRewardType, 1, 0).then(function() {
    //      alert("发布任务成功");
    //      var publishModal = taskPublishModalService.getShaodaiModal();
    //      publishModal.hide();
    //    },function(error) {
    //      alert("发布任务失败:" + error);
    //    });
    //}
  }

  qingbaoPublishControllerFn.$inject = ['$scope', '$log', '$ionicModal', '$ionicPopup', '$cordovaDatePicker',
    'taskPublishModalService', 'taskNetService','taskUtils','taskDesc'];
  function qingbaoPublishControllerFn($scope, $log, $ionicModal, $ionicPopup, $cordovaDatePicker, taskPublishModalService, taskNetService,taskUtils,taskDesc) {
    var _ctlSelf = this;
    this.closeModal = function () {
      var publishModal = taskPublishModalService.getQingbaoModal();
      publishModal.hide();
      cleanTaskControllerStatus(_ctlSelf);
    }

    //this.subTaskArray = new Array(
    //  {index: 0, type: 101, name: '打听某人'}, {index: 1, type: 102, name: '打听事情'}, {index: 2, type: 103, name: '寻物启事'},
    //  {index: 3, type: 104, name: '帮忙看看'}
    //);
    this.subTaskArray = this.subTaskArray = buildSubTaskTypeArray(taskUtils,taskDesc,1);
    this.taskTypeName = "情报侠";
    this.deadline = null;
    this.startTime = null;

    TaskPublishBaseControllerFn($scope, $log, $ionicModal, $ionicPopup, $cordovaDatePicker,
      taskPublishModalService, taskNetService,this);

  }

  jiebaoPublishControllerFn.$inject = ['$scope', '$log', '$ionicModal', '$ionicPopup', '$cordovaDatePicker',
    'taskPublishModalService', 'taskNetService','taskUtils','taskDesc'];
  function jiebaoPublishControllerFn($scope, $log, $ionicModal, $ionicPopup, $cordovaDatePicker, taskPublishModalService, taskNetService,taskUtils,taskDesc) {
    var _ctlSelf = this;
    this.closeModal = function () {
      var publishModal = taskPublishModalService.getJiebaoModal();
      publishModal.hide();
      cleanTaskControllerStatus(_ctlSelf);
    }

    //this.subTaskArray = new Array(
    //  {index: 0, type: 201, name: '借资料书籍'}, {index: 1, type: 202, name: '借运动用品'}, {index: 2, type: 203, name: '借生活工具'},
    //  {index: 3, type: 204, name: '借娱乐物件'}
    //);
    this.subTaskArray = this.subTaskArray = buildSubTaskTypeArray(taskUtils,taskDesc,2);
    this.taskTypeName = "借宝侠";
    this.deadline = null;
    this.startTime = null;

    TaskPublishBaseControllerFn($scope, $log, $ionicModal, $ionicPopup, $cordovaDatePicker,
      taskPublishModalService, taskNetService,this);
  }
})
();

