/**
 * Created by binfeng on 16/3/27.
 */
;(
  function () {
    'use strict'
    angular.module('app.routes',['ionic'])
      .config(function($stateProvider, $urlRouterProvider)
      {
        $stateProvider

          //// setup an abstract state for the tabs directive
          //.state('tab', {
          //  url: '/tab',
          //  abstract: true,
          //  templateUrl: 'templates/temp/tabs.html'
          //})
          //
          //// Each tab has its own nav history stack:
          //
          //.state('tab.dash', {
          //  url: '/dash',
          //  views: {
          //    'tab-dash': {
          //      templateUrl: 'templates/temp/tab-dash.html',
          //      controller: 'DashCtrl'
          //    }
          //  }
          //})
          //
          //.state('tab.chats', {
          //  url: '/chats',
          //  views: {
          //    'tab-chats': {
          //      templateUrl: 'templates/temp/tab-chats.html',
          //      controller: 'ChatsCtrl'
          //    }
          //  }
          //})
          //.state('tab.chat-detail', {
          //  url: '/chats/:chatId',
          //  views: {
          //    'tab-chats': {
          //      templateUrl: 'templates/temp/chat-detail.html',
          //      controller: 'ChatDetailCtrl'
          //    }
          //  }
          //})
          //
          //.state('tab.account', {
          //  url: '/account',
          //  views: {
          //    'tab-account': {
          //      templateUrl: 'templates/temp/tab-account.html',
          //      controller: 'AccountCtrl'
          //    }
          //  }
          //});

        $stateProvider.state('im-list',{
          url:'/im/list',
          templateUrl:'modules/im/list.html',
          controller:'imMessageListController'
        });

        $stateProvider.state('im-message-detail',{
          url:'/im/detail',
          templateUrl:'modules/im/detail.html',
          controller:'imMessageDetailController'
        });

        $stateProvider.state('login',{
          url:'/login',
          templateUrl: 'modules/login/login.html',
          controller: 'loginCtrl'
        });
        $stateProvider.state('intro',{
          url:'/intro',
          templateUrl: 'templates/intro.html',
          controller: 'introCtrl'
        });

        $stateProvider.state('userProto',{
          url:'/user/proto',
          templateUrl:'modules/login/user-proto.html'
        });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/user/proto');
        //$urlRouterProvider.otherwise('/intro');
      }
    );
  }
)();
