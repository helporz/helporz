/**
 * Created by binfeng on 16/4/13.
 */
;
(function () {
  'use strict';
  angular.module('com.helproz.task.publish', ['ionic']).config(publishConfigFn)
    .controller('testTaskPublishController', testTaskPublishControllerFn)
    .controller('taskPublishListController', taskPublishListControllerFn)
    .controller('shaodaiPublishController', shaodaiPublishControllerFn)
    .controller('qingbaoPublishController', qingbaoPublishControllerFn)
    .controller('jiebaoPublishController',  jiebaoPublishControllerFn)
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

  testTaskPublishControllerFn.$inject = ['$scope', '$log', '$ionicModal', 'taskPublishModalService'];
  function testTaskPublishControllerFn($scope, $log, $ionicModal, taskPublishModalService) {
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

  taskPublishListControllerFn.$inject = ['$scope', '$log','$ionicModal', 'taskPublishModalService'];
  function taskPublishListControllerFn($scope, $log,$ionicModal,taskPublishModalService) {
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

    this.cancel = function() {
      var modal = taskPublishModalService.getListModal();
      if( modal ) {
        modal.hide();
      }
    };

    this.publishShaodai = function() {
      var listModal = taskPublishModalService.getListModal();
      var publishModal = taskPublishModalService.getShaodaiModal();
      listModal.hide();
      publishModal.show();
    };

    this.publishQingbao = function() {
      var listModal = taskPublishModalService.getListModal();
      var publishModal = taskPublishModalService.getQingbaoModal();
      listModal.hide();
      publishModal.show();
    };

    this.publishJiebao = function() {
      var listModal = taskPublishModalService.getListModal();
      var publishModal = taskPublishModalService.getJiebaoModal();
      listModal.hide();
      publishModal.show();
    }
  }

  shaodaiPublishControllerFn.$inject = ['$scope', '$log','$ionicModal', 'taskPublishModalService'];
  function shaodaiPublishControllerFn($scope, $log,$ionicModal,taskPublishModalService) {
      this.cancel = function() {
        var publishModal = taskPublishModalService.getShaodaiModal();
        publishModal.hide();
      }
  }

  qingbaoPublishControllerFn.$inject = ['$scope', '$log','$ionicModal', 'taskPublishModalService'];
  function qingbaoPublishControllerFn($scope, $log,$ionicModal,taskPublishModalService) {
    this.cancel = function() {
      var publishModal = taskPublishModalService.getQingbaoModal();
      publishModal.hide();
    }
  }

  jiebaoPublishControllerFn.$inject = ['$scope', '$log','$ionicModal', 'taskPublishModalService'];
  function jiebaoPublishControllerFn($scope, $log,$ionicModal,taskPublishModalService) {
    this.cancel = function() {
      var publishModal = taskPublishModalService.getJiebaoModal();
      publishModal.hide();
    }
  }
})();

