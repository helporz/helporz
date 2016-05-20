/**
 * Created by binfeng on 16/4/22.
 */
;
(function () {
  'use strict';
  angular.module('com.helporz.playground', ['com.helporz.user.netservice', 'com.helporz.utils.service']).config(PlaygroundConfigFn);


  PlaygroundConfigFn.$inject = ['$stateProvider', '$compileProvider', '$urlRouterProvider', '$ionicConfigProvider'];
  function PlaygroundConfigFn($stateProvider, $compileProvider, $urlRouterProvider, $ionicConfigProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|data|file|cdvfile):/);
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|data|file|cdvfile):/);
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
        url: '/playground/topic/detail/{topicId}',
        templateUrl: 'modules/main/playground/templates/topic-detail.html',
        controller: 'topicDetailController'
      }
    )
      .state(
      'own-topic-list',
      {
        url: '/playground/topic/own/list',
        templateUrl: 'modules/main/playground/templates/own-topic-list.html',
        controller: 'ownTopicListController'
      }
    )
      .state(
      'collection-topic-list',
      {
        url: '/playground/topic/collection/list',
        templateUrl: 'modules/main/playground/templates/collection-topic-list.html',
        controller: 'collectionTopicListController'
      }
    )
      .state(
      'my-comment-list',
      {
        url: '/playground/topic/my-comment/list',
        templateUrl: 'modules/main/playground/templates/my-comment-list.html',
        controller: 'myCommentListController'
      }
    )
      .state(
      'my-message-list',
      {
        url: '/playground/topic/my-message/list',
        templateUrl: 'modules/main/playground/templates/my-message-list.html',
        controller: 'myMessageListController'
      }
    )
      .state(
      'comment-session',
      {
        url: '/playground/topic/comment-session/{sessionId}',
        templateUrl: 'modules/main/playground/templates/comment-session.html',
        controller: 'commentSessionController'
      }
    )
    ;
  }
})();
