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

        $stateProvider.state('im-list',{
          url:'/im/list',
          templateUrl:'modules/im/list.html',
          controller:'imMessageListController',
          controllerAs:'imMessageList'
        });

        $stateProvider.state('im-message-detail',{
          url:'/im/detail/{cid}',
          templateUrl:'modules/im/detail.html',
          controller:'imMessageDetailController',
          controllerAs:'imMessageDetail'
        });

        $stateProvider.state('login',{
          url:'/login',
          templateUrl: 'modules/login/login.html',
          controller: 'loginCtrl'
        });
        $stateProvider.state('intro',{
          url:'/intro',
          templateUrl: 'modules/intro/intro.html',
          controller: 'introCtrl'
        });

        $stateProvider.state('userProto',{
          url:'/user/proto',
          templateUrl:'modules/login/user-proto.html'
        });
        $stateProvider.state('info', {
          url: '/info',
          templateUrl: 'modules/info/info.html',
          controller: 'infoCtrl'
        });
        $stateProvider.state('wall', {
          url: '/wall',
          templateUrl: 'modules/wall/wall.html',
          controller: 'wallCtrl'
        });

        // if none of the above states are matched, use this as the fallback

        if(g_TestFlag == enumTestFlag.NEAR) {
          $urlRouterProvider.otherwise('/main/near');
          //$urlRouterProvider.otherwise('/task/publish/list');
        }
        else if(g_TestFlag == enumTestFlag.USER_PROTO){
          $urlRouterProvider.otherwise('user/proto');
        }
        else if(g_TestFlag == enumTestFlag.INFO){
          $urlRouterProvider.otherwise('/info');
        }
        else if(g_TestFlag == enumTestFlag.WALL){
          $urlRouterProvider.otherwise('/wall');
        }
        else{
          $urlRouterProvider.otherwise('/login');
        }
        //$urlRouterProvider.otherwise('/user/proto');
      }
    );
  }
)();
