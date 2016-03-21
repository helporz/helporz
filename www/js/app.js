// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

;(
  function(window) {
    "use strict";

    angular.module('starter', ['ionic',
      'ngResource',
      'ngCordova',
      'starter.controllers',
      'starter.services',
      'service.login',
      'service.intro'])

      .run([
        '$ionicPlatform',
        '$cordovaDevice',
        '$cordovaNetwork',
        '$timeout',
        '$cordovaDialogs',
        '$state',
        init
      ])

      .config(['$stateProvider','$urlRouterProvider','$httpProvider',function($stateProvider, $urlRouterProvider,$httpProvider) {
        configRouter($stateProvider,$urlRouterProvider);
        setHttpProvider($httpProvider);
      }]);


    //function init($ionicPlatform, $cordovaDevice, $cordovaNetwork, $timeout, $cordovaDialogs, $state) {
      function init($ionicPlatform,  $timeout, $cordovaDialogs, $state) {
      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }

        //var device = $cordovaDevice.getDevice();
        //var newtork = $cordovaNetwork.getNetwork();

        //console.log(device);
        //console.log(newtork);

        //if (newtork !== 'wifi' && newtork !== 'Connection.WIFI') {
        //  $cordovaDialogs.alert(
        //    '检查到当前使用的网络不是 Wi-Fi，除非您使用 3G/4G 网络，不建议在非 Wi-Fi 网络下加载大图', // message
        //    '流量提示', // title,
        //    '继续浏览'
        //  );
        //}

        //authPushService(device, function(installation){
        //  console.log(installation);
        //
        //  // When sync device infomation success
        //  function syncInstallationSuccess(result) {
        //    console.log(result);
        //  }
        //
        //  // Ignore the error for tmp.
        //  function syncError(err) {
        //    console.log(err);
        //  }
        //});


      });
    }


    function setHttpProvider($httpProvider) {
      // 头部配置
      $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
      $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';
      $httpProvider.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';

      /**
       * 重写angular的param方法，使angular使用jquery一样的数据序列化方式  The workhorse; converts an object to x-www-form-urlencoded serialization.
       * @param {Object} obj
       * @return {String}
       */
      var param = function (obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for (name in obj) {
          value = obj[name];

          if (value instanceof Array) {
            for (i = 0; i < value.length; ++i) {
              subValue = value[i];
              fullSubName = name + '[' + i + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          }
          else if (value instanceof Object) {
            for (subName in value) {
              subValue = value[subName];
              fullSubName = name + '[' + subName + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          }
          else if (value !== undefined && value !== null)
            query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
      };

      // Override $http service's default transformRequest
      $httpProvider.defaults.transformRequest = [function (data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
      }];
    }

    function authPushService(device, callback) {
      var options = {
        "badge": "true",
        "sound": "true",
        "alert": "true"
      };

      $cordovaPush
        .register(options)
        .then(function(token) {

          var installation = {};

          installation.deviceType = device.platform ?
            device.platform.toLowerCase() :
            'ios';

          if (installation.deviceType === 'ios')
            installation.deviceToken = token;

          if (installation.deviceType === 'android')
            installation.installationId = token;

          angular.forEach(['model', 'uuid', 'version'], function(item){
            if (device[item])
              installation[item] = device[item];
          });

          return callback(installation);
        }, pushSignupError);

      // Ignore the error for tmp.
      function pushSignupError(err) {
        $cordovaDialogs.alert(
          err,
          '获取推送权限失败...', // title,
          '知道了' // button
        )
      }
    }

    function configRouter($stateProvider,$urlRouterProvider) {
      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js
      $stateProvider

        // setup an abstract state for the tabs directive
        .state('tab', {
          url: '/tab',
          abstract: true,
          templateUrl: 'templates/tabs.html'
        })

        // Each tab has its own nav history stack:

        .state('tab.dash', {
          url: '/dash',
          views: {
            'tab-dash': {
              templateUrl: 'templates/tab-dash.html',
              controller: 'DashCtrl'
            }
          }
        })

        .state('tab.chats', {
          url: '/chats',
          views: {
            'tab-chats': {
              templateUrl: 'templates/tab-chats.html',
              controller: 'ChatsCtrl'
            }
          }
        })
        .state('tab.chat-detail', {
          url: '/chats/:chatId',
          views: {
            'tab-chats': {
              templateUrl: 'templates/chat-detail.html',
              controller: 'ChatDetailCtrl'
            }
          }
        })

        .state('tab.account', {
          url: '/account',
          views: {
            'tab-account': {
              templateUrl: 'templates/tab-account.html',
              controller: 'AccountCtrl'
            }
          }
        });

      $stateProvider.state('login',{
        url:'/login',
        templateUrl: 'templates/login/login.html',
        controller: 'loginCtrl'
      });
      $stateProvider.state('intro',{
        url:'/intro',
        templateUrl: 'templates/intro.html',
        controller: 'introCtrl'
      });

      $stateProvider.state('userProto',{
        url:'/user/proto',
        templateUrl:'templates/user-proto.html'
      });
      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/intro');
    }
  }
)(this);

