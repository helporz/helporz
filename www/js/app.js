// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

;
(function (window) {
  "use strict";

  angular.module('app', ['ionic',
    'ngResource',
    'ngCordova',
    'ngCordova.plugins.splashscreen',
    'pusher',
    'com.helporz.im',
    'app.routes',
    'app.directives',
    'interval.service',
    'app.time.utils.service',
    'app.user.utils.service',
    'app.ui.utils.service',
    'impress.utils.service',

    'app.netwrapper.service',

    'com.helporz.login',
    'com.helporz.intro',
    'com.helporz.utils.service',
    'com.helporz.task.publish',
    'com.helporz.task.netservice',
    'com.helporz.playground',
    'com.helporz.user.netservice',
    'com.helporz.task.noticemessage',
    'main',
    'info',
    'wall',
  ])

    .run(init)

    .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$ionicConfigProvider',
      function ($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {
        //configRouter($stateProvider,$urlRouterProvider);
        setHttpProvider($httpProvider);
        $ionicConfigProvider.scrolling.jsScrolling(true);

      }]).directive('errSrc', function () {
      return {
        link: function (scope, element, attrs) {
          element.bind('error', function () {
            if (attrs.src != attrs.errSrc) {
              attrs.$set('src', attrs.errSrc);
            }
          });
        }
      }
    });


  //function init($ionicPlatform, $cordovaDevice, $cordovaNetwork, $timeout, $cordovaDialogs, $state) {
  init.$inject = [
    '$cordovaSplashscreen',
    '$ionicPlatform',
    '$cordovaDevice',
    '$cordovaNetwork',
    '$timeout',
    '$cordovaDialogs',
    '$state',
    '$log',
    'pushService',
    'jimService',
    'imConversationService',
    'imMessageService',
    'fileService',
    'userImgFileService',
    'dbService',
    'PlaygroundDBService',
    'playgroundTestConfigService',
    'userLoginInfoService',
    'userNetService',
    'taskNetService',
    'loginService',
    'intervalCenter',
    'checkUpdateNetWrapper',
    '$window',
  ];

  function init($cordovaSplashscreen,
                $ionicPlatform,
                $cordovaDevice,
                $cordovaNetwork,
                $timeout,
                $cordovaDialogs,
                $state,
                $log,
                pushService,
                jimService,
                imConversationService,
                imMessageService,
                fileService,
                userImgFileService,
                dbService,
                PlaygroundDBService,
                playgroundTestConfigService,
                userLoginInfoService,
                userNetService,
                taskNetService,
                loginService,
                intervalCenter,
                checkUpdateNetWrapper,
                $window) {
    $log.info('app.run.init');

    $ionicPlatform.ready(function () {
      //ConfigForTest(playgroundTestConfigService);
      playgroundTestConfigService.initConfig();
      //if (navigator.splashscreen) {
      //  navigator.splashscreen.hide();
      //}
      console.log('ionicPlatform.ready');
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

      //wechat
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Wechat) {
        window.cordova.plugins.Wechat.isInstalled(function (installed) {
          alert("Wechat installed: " + (installed ? "Yes" : "No"));
        }, function (reason) {
          alert("Failed: " + reason);
        });
      }

      //in app browser
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.InAppBrowser) {
        window.open = window.cordova.plugins.InAppBrowser.open;
      }

      var hideSplashScreen = function(){
        if($window.navigator.splashscreen){ $cordovaSplashscreen.hide(); }
      }

      jimService.init();
      pushService.init().then(function () {
        if (loginService.isShowIntro()) {
          $cordovaSplashscreen.hide();
          console.log('goto intro');
          $state.go('intro');
        }
        else if (loginService.isLogging()) {
          loginService.loginByTicket().then(function () {
            console.log('goto main.near');
            $state.go('main.near');
            //ho.alert('fetch after login');
            //notice message
            taskNetService.observeNoticeMessage();
            // test:
            //intervalCenter.add(1, 'app.noticeMessage', function () {
            taskNetService.fetchNoticeMessage();
            hideSplashScreen();
            //});

          }, function () {
            $state.go('login');
            hideSplashScreen();
          });
        }
        else {
          $state.go('login');
          hideSplashScreen();
        }

      }, function () {
        $state.go('login');
        hideSplashScreen();
      });


      //检查更新
      //checkUpdateNetWrapper.check();

      document.addEventListener("deviceready", function () {
        window.sqlitePlugin.openDatabase({name: 'helporz.db', location: 'default'}, function (dbConn) {
          dbService.setDBConn(dbConn);
          $log.info("create table");
          PlaygroundDBService.createTable();
        }, function (error) {
          $log.error(error);
        });

        fileService.init(function () {
          $log.info("存储服务初始化成功");
        }, function () {
          $log.info("存储服务初始化失败");
          alert('failed');
        });


        //pushService.getRegistrationID();


        if (device.platform != "Android") {
          window.plugins.jPushPlugin.setDebugModeFromIos();
          window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
        } else {
          window.plugins.jPushPlugin.setDebugMode(true);
        }
      }, false);


    });

  }

  function ConfigForTest(playgroundTestConfigService) {
    playgroundTestConfigService.initConfig();
  }

  function setHttpProvider($httpProvider) {
    // 头部配置
    //$httpProvider.defaults.withCredentials = true;
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

})(this);

