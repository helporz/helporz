/**
 * Created by Midstream on 16/3/29.
 */

(function() {
  'use strict';

  angular.module('topnav', ['ionic']);

  angular
    .module('topnav')
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config($stateProvider, $urlRouterProvider){
    $stateProvider
      .state('topnav', {
        url: '/tab',
        abstract: true,
        templateUrl: 'modules/temp/tabs.html'
      })
      .state('topnav.near', {
        url: '/dash',
        views: {
          'tab-dash': {
            templateUrl: 'modules/temp/tab-dash.html',
            controller: 'DashCtrl'
          }
        }
      })
      .state('topnav.me', {
        url: '/me',
        views: {
          'topnav-me': {
            templateUrl: 'modules/temp/tab-account',
          }
        }
      });
  }

  angular.module('topnav')
    .controller('DashCtrl', DashCtrl);

  function DashCtrl(){

  };
})();
