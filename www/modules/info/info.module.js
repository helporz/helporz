/**
 * Created by Midstream on 16/3/29.
 */

(function () {
  'use strict';

  angular.module('info', [
    'ionic',
    'info.schoolSearch'
  ]).config(config)

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider'];

  function config($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $stateProvider

      .state('searchSchool', {
        url: '/info/schoolSearch',
        templateUrl: 'modules/info/school-search/school-search.html',
        controller: 'schoolSearchCtrl'
      });
  };
})()
