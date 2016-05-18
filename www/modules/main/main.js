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
    'impress.utils.service'
  ]).config(mainConfig).controller('mainController', mainControllerFn);

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

      .state('main.post', {
        url: '/post',
        views: {
          'post': {
            templateUrl: 'modules/main/post/post.html',
            controller: 'mainPostCtrl'
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

    ;

    //tab位置设置到下面
    $ionicConfigProvider.tabs.position('bottom')
  }
})()
