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
    'main.me'
  ]).config(mainConfig);

  mainConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider'];

  function mainConfig($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $stateProvider
      .state('main', {
        url: '/main',
        abstract: true,
        templateUrl: 'modules/main/main.html'
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
        url: '/near/:id',
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
        url: '/me/{id:[s+]}',
        //url: '/me/:id',
        views: {
          'me': {
            templateUrl: 'modules/main/details/user-info/user-info.html',
            controller: 'mainUserInfoCtrl'
          }
        }
      })

      .state('main.edit', {
        url: '/edit',
        views: {
          'me': {
            templateUrl: 'modules/main/me/edit/edit.html',
            controller: 'mainEditCtrl'
          }
        }
      })

      .state('main.setting', {
        url: '/setting',
        views: {
          'me': {
            templateUrl: 'modules/main/me/setting/setting.html',
            controller: 'mainSettingCtrl'
          }
        }
      })

      .state('main.edit-sheet', {
        url: '/edit-sheet',
        views: {
          'me': {
            templateUrl: 'modules/main/details/edit-sheet/edit-sheet.html',
            controller: 'mainEditSheetCtrl'
          }
        }
      })

      .state('main.about', {
        url: '/about',
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

        url: '/comment',
        views: {
          'task': {
            templateUrl: 'modules/main/task/comment/comment.html',
            controller: 'mainCommentCtrl'
          }
        }
      })

    ;

    //tab位置设置到下面
    $ionicConfigProvider.tabs.position('bottom')
  }
})()
