/**
 * Created by binfeng on 16/4/22.
 */
;
(function () {
  'use strict';
  angular.module('com.helporz.playground', ['com.helporz.user.netservice', 'com.helporz.utils.service']).config(PlaygroundConfigFn);


  PlaygroundConfigFn.$inject = ['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider'];
  function PlaygroundConfigFn($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $stateProvider.state(
      'playground-list',
      {
        url: '/playground/list',
        templateUrl: 'modules/main/playground/templates/playground-list.html',
        controller: 'playgroundListController',
        controllerAs: 'ctl'
      })
      .state(
      'topic-group',
      {
        url: '/playground/topic-group/{groupId}',
        templateUrl: 'modules/main/playground/templates/topic-group.html',
        controller: 'topicGroupController'
      }
    )
      .state(
      'topic-detail',
      {
        url: '/playground/topic/{topicId}',
        templateUrl: 'modules/main/playground/templates/topic-detail.html',
        controller: 'topicDetailController'
      }
    )
      .state(
      'topic-add',
      {
        url: '/playground/topic/add/{groupId}',
        templateUrl: 'modules/main/playground/templates/topic-add.html',
        controller: 'topicAddController'
      }
    )
    ;
  }
})();
