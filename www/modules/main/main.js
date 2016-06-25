/**
 * Created by Midstream on 16/3/30.
 */

(function () {
  "use strict";

  angular.module('main', [
    'ionic',
    'main.near',
    'main.post',
    'main.task',
    'main.me',
    'com.helproz.task.publish',
    'impress.utils.service',
    'com.helporz.playground',
    'com.helporz.im'
  ]).config(mainConfig).controller('mainController', mainControllerFn).run(mainRun);

  mainControllerFn.$inject = ['$scope', '$ionicModal', 'taskPublishModalService'];
  function mainControllerFn($scope, $ionicModal, taskPublishModalService) {
    $scope.vm = {};
    $ionicModal.fromTemplateUrl('modules/main/task-publish/modal-list.html', {
      scope: $scope,
      animation: "slide-in-up"
    }).then(function (modal) {
      $scope.vm.publishListModal = modal;
      taskPublishModalService.setListModal(modal);
    });

    $scope.vm.showPublishList = function () {
      $scope.vm.publishListModal.show();
    }
  }

  mainConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider'];

  function mainConfig($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $stateProvider
      .state('main', {
        url: '/main',
        abstract: true,
        templateUrl: 'modules/main/main.html',
        controller: 'mainController'
      })

      .state('main.near', {
        url: '/near',
        views: {
          'near': {
            templateUrl: 'modules/main/near/near.html',
            controller: 'mainNearCtrl'
          }
        }
      })
      .state('main.task-detail', {
        url: '/near/task-detail/:id',
        views: {
          'near': {
            templateUrl: 'modules/main/near/task-detail/task-detail.html',
            controller: 'mainNearTaskDetailCtrl'
          }
        }
      })

      .state('main.topic-group', {
        url: '/topic-group/{groupId}',
        views: {
          'topic-group': {
            templateUrl: 'modules/main/playground/templates/topic-group.html',
            controller: 'topicGroupController'
          }
        }
      })

      .state('main.me', {
        url: '/me',
        views: {
          'me': {
            templateUrl: 'modules/main/me/me.html',
            controller: 'mainMeCtrl'
          }
        }
      })

      .state('main.im', {
        url: '/me/im',
        views: {
          'me': {
            templateUrl:'modules/im/list.html',
            controller:'imMessageListController',
          }
        }
      })

      .state('main.user-info', {
        //url: '/me/{id:[s+]}',
        url: '/me/:id',
        views: {
          'me': {
            templateUrl: 'modules/main/details/user-info/user-info.html',
            controller: 'mainUserInfoCtrl'
          }
        }
      })

      .state('main.edit', {
        url: '/me/edit',
        views: {
          'me': {
            templateUrl: 'modules/main/me/edit/edit.html',
            controller: 'mainEditCtrl'
          }
        }
      })

      .state('main.setting', {
        url: '/me/setting',
        views: {
          'me': {
            templateUrl: 'modules/main/me/setting/setting.html',
            controller: 'mainSettingCtrl'
          }
        }
      })

      .state('main.edit-sheet', {
        url: '/me/edit-sheet',
        views: {
          'me': {
            templateUrl: 'modules/main/details/edit-sheet/edit-sheet.html',
            controller: 'mainEditSheetCtrl'
          }
        }
      })

      .state('main.about', {
        url: '/me/setting/about',
        views: {
          'me': {
            templateUrl: 'modules/main/details/about/about.html'
          }
        }
      })

      .state('main.task', {
        url: '/task',
        views: {
          'task': {
            templateUrl: 'modules/main/task/task.html',
            controller: 'mainTaskCtrl'
          }
        }
      })

      .state('main.comment', {
        url: '/task/comment/:desc',
        views: {
          'task': {
            templateUrl: 'modules/main/task/comment/comment.html',
            controller: 'mainCommentCtrl'
          }
        }
      })

      .state('main.task-state', {
        url: '/task/task-state/:id',
        views: {
          'task': {
            templateUrl: 'modules/main/task/task-state/task-state.html',
            controller: 'mainTaskTaskStateCtrl'
          }
        }
      })

      .state('main.task_task-detail', {
        url: '/task/task-state/:id',
        views: {
          'task': {
            templateUrl: 'modules/main/near/task-detail/task-detail.html',
            controller: 'mainNearTaskDetailCtrl'
          }
        }
      })

    ;

    //tab位置设置到下面
    $ionicConfigProvider.tabs.position('bottom')
  }

  mainRun.$inject = ['$ionicPlatform', '$ionicPopup','$rootScope','$location'];
  function mainRun($ionicPlatform,$ionicPopup,$rootScope,$location) {
    //主页面显示退出提示框
    $ionicPlatform.registerBackButtonAction(function (e) {

      e.preventDefault();

      function showConfirm() {
        var confirmPopup = $ionicPopup.confirm({
          title: '<strong>退出应用?</strong>',
          template: '你确定要退出应用吗?',
          okText: '退出',
          cancelText: '取消'
        });

        confirmPopup.then(function (res) {
          if (res) {
            ionic.Platform.exitApp();
          } else {
            // Don't close
          }
        });
      }

      // Is there a page to go back to?
      if ($location.path() == '/home' ) {
        showConfirm();
      } else if ($rootScope.$viewHistory.backView ) {
        console.log('currentView:', $rootScope.$viewHistory.currentView);
        // Go back in history
        $rootScope.$viewHistory.backView.go();
      } else {
        // This is the last page: Show confirmation popup
        showConfirm();
      }

      return false;
    }, 101);
  }

})()
