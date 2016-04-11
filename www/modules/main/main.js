/**
 * Created by Midstream on 16/3/30.
 */

(function(){
  "use strict";

  angular.module('main', [
    'ionic',
    'main.near',
    'main.near.task-detail',
    'main.me'
  ]).config(mainConfig);

  mainConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider'];

  function mainConfig($stateProvider, $urlRouterProvider, $ionicConfigProvider){
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
        url: '/task-detail',
        views: {
          'near': {
            templateUrl: 'modules/main/near/task-detail/task-detail.html',
            controller: 'mainNearTaskDetailCtrl'
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
      });

    //tab位置设置到下面
    $ionicConfigProvider.tabs.position('bottom')
  }
})()
