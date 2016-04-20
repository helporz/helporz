/**
 * Created by Midstream on 16/3/29.
 */

(function () {
  'use strict';

  angular.module('main.me', [
    'ionic',
    'app.effect.directive',
    'main.me.self',
    'main.me.friend'
  ])
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider'];

  function config($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $stateProvider

      .state('main.me.self', {
        url: '/self',
        views: {
          'self': {
            templateUrl: 'modules/main/me/self/self.html',
            controller: 'mainMeSelfCtrl'
          }
        }
      })
      .state('main.me.friend', {
        url: '/friend',
        views: {
          'friend': {
            templateUrl: 'modules/main/me/friend/friend.html',
            controller: 'mainMeFriendCtrl'
          }
        }
      })
  }

})()
