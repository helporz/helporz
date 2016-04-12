// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

;(
  function(window) {
    "use strict";

    angular.module('app', ['ionic',
      'ngResource',
      'ngCordova',
      'pusher',
      'com.helporz.im',
      'app.routes',
      'starter.controllers',
      'starter.services',
      'com.helporz.login',
      'com.helporz.intro',
      'com.helporz.utils.service',
      'main'
    ])

      .run([
        '$ionicPlatform',
        '$cordovaDevice',
        '$cordovaNetwork',
        '$timeout',
        '$cordovaDialogs',
        '$state',
        'pushService',
        'jimService',
        'imConversationService',
        'imMessageService',
        'fileService',
        'userImgFileService',
        init
      ])

      .config(['$stateProvider','$urlRouterProvider','$httpProvider',function($stateProvider, $urlRouterProvider,$httpProvider) {
        //configRouter($stateProvider,$urlRouterProvider);
        setHttpProvider($httpProvider);
      }]).directive('errSrc', function() {
      return {
        link: function(scope, element, attrs) {
          element.bind('error', function() {
            if (attrs.src != attrs.errSrc) {
              attrs.$set('src', attrs.errSrc);
            }
          });
        }
      }
    });


    //function init($ionicPlatform, $cordovaDevice, $cordovaNetwork, $timeout, $cordovaDialogs, $state) {
      function init($ionicPlatform,
                    $cordovaDevice,
                    $cordovaNetwork,
                    $timeout,
                    $cordovaDialogs,
                    $state,
                    pushService,
                    jimService,
                    imConversationService,
                    imMessageService,
                    fileService,
                    userImgFileService) {
        console.log('app.run.init');
      $ionicPlatform.ready(function() {
        navigator.splashscreen.hide();
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


        ////推送初始化
        //var setTagsWithAliasCallback=function(event){
        //  window.alert('result code:'+event.resultCode+' tags:'+event.tags+' alias:'+event.alias);
        //}
        //
        //var openNotificationInAndroidCallback=function(data){
        //  var json=data;
        //  window.alert(json);
        //  if(typeof data === 'string'){
        //    json=JSON.parse(data);
        //  }
        //  var id=json.extras['cn.jpush.android.EXTRA'].id;
        //  //window.alert(id);
        //  $state.go('detail',{id:id});
        //}

        var onOpenNotification = function (event) {
          console.log(" index onOpenNotification");

          try {
            var alertContent;
            if (device.platform == "Android") {
              alertContent = event.alert;
            } else {
              alertContent = event.aps.alert;
            }
            alert("open Notificaiton:" + alertContent);

          }
          catch (exception) {
            console.log("JPushPlugin:onOpenNotification" + exception);
          }
        }

        var onReceiveNotification = function (event) {
          console.log(" index onReceiveNotification");
          try {
            var alertContent;
            if (device.platform == "Android") {
              //alertContent = window.plugins.jPushPlugin.receiveNotification.alert;
              alertContent = event.alert;
            } else {
              alertContent = event.aps.alert;
            }
            alert("Receive Notificaiton:" + alertContent);
            //$("#notificationResult").html(alertContent);

          }
          catch (exeption) {
            console.log(exception)
          }
        }

        var onReceivePushMessage = function (event) {
          try {
            var message;
            if (device.platform == "Android") {
              message = event.message;
            } else {
              message = event.content;
            }
            console.log(message);
            alert("Receive Push Message:" + message );
            //$("#messageResult").html(message);
          }
          catch (exception) {
            console.log("JPushPlugin:onReceivePushMessage-->" + exception);
          }
        }

        var onSetTagsWithAlias = function (event) {
          try {
            console.log("onSetTagsWithAlias");
            var result = "result code:" + event.resultCode + " ";
            result += "tags:" + event.tags + " ";
            result += "alias:" + event.alias + " ";
            $("#tagAliasResult").html(result);
          }
          catch (exception) {
            console.log(exception)
          }
        }





        //document.addEventListener("jpush.setTagsWithAlias",onSetTagsWithAlias, false);
        //document.addEventListener("jpush.openNotification", onOpenNotification, false);
        //document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
        //document.addEventListener("jpush.receiveMessage", onReceivePushMessage, false);



        //var onConversatinoChange = function (data) {
        //  alert("onConversatinoChange:" + writeObj(data));
        //  console.log(data);
        //};
        //
        //var onSingleReceiveMessage = function (data) {
        //  console.log("receive im message");
        //  if( typeof(data.msg_type) === 'undefined') {
        //    console.log('receive invalid message:'+ writeObj(data));
        //  }
        //  else {
        //    console.log('receive message:'+ data.msg_body.text + " username:" +data.target_id + " toUserName:" + data.from_id);
        //
        //    var messageDetail = {
        //      username:jimService.getUsername(), //由于data.target_id 与 data.from_id相等，因此用当前登录的用户名
        //      toUsername:data.from_id,
        //      type:'text',
        //      content:data.msg_body.text,
        //      time: data.create_time,
        //      isFromMe:false,
        //      sendState:1
        //    };
        //    imMessageService.addMessage(messageDetail.username,messageDetail.toUsername,messageDetail);
        //  }
        //};

        //var config = {
        //  onConversatinoChange:onConversatinoChange,
        //  onSingleReceiveMessage:onSingleReceiveMessage
        //};



        document.addEventListener("deviceready", function () {
          fileService.init(function() {
            //userImgFileService.saveUserImg('1','hello world',function() {
            //  alert('success');
            //},function() {
            //  alert('failed');
            //});

            var data = fileService.readFromFile('user/','1.png',function(data) {
              alert('success: read data:' + data);
            },function() {
              alert('failed');
            });

            console.log('read from file:' + data);
          },function() {
            alert('failed');
          });

          //fileService.writeToFile('user/img/','test.txt','hello world new');


          //console.log(fileService.readFromFile('user/img/','test.txt'));
          var config={
            onOpenNotification: onOpenNotification,
            onReceiveNotification: onReceiveNotification,
            onReceivePushMessage: onReceivePushMessage,
            onSetTagsWithAlias: onSetTagsWithAlias
          };

          jimService.init();
          pushService.init(config);
          //console.log('jimService.login');
          //jimService.login('xixi','xixi',function() {
          //  //jimService.login('dada','dada',function() {
          //  alert('login success');
          //},function() {
          //  alert('login failed');
          //});
          pushService.getReistrationID();

          if (device.platform != "Android") {
            window.plugins.jPushPlugin.setDebugModeFromIos();
            window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
          } else {
            window.plugins.jPushPlugin.setDebugMode(true);
          }
        }, false);



        //console.log('imConversationService.updateConversationFromImServer');
        //imConversationService.updateConversationFromImServer(function(data){
        //    //$scope.imUsers = data;
        //  },function(data) {
        //    alert('updateConversationList failed');
        //  });
        //jimService.getUserInfo(function (data) {
        //  console.log('getUserInfo:' + JSON.stringify(data));
        //},function(data) {
        //  console.log('getUserInfo failed:' + data);
        //});
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
      //$stateProvider
      //
      //  // setup an abstract state for the tabs directive
      //  .state('tab', {
      //    url: '/tab',
      //    abstract: true,
      //    templateUrl: 'templates/temp/tabs.html'
      //  })
      //
      //  // Each tab has its own nav history stack:
      //
      //  .state('tab.dash', {
      //    url: '/dash',
      //    views: {
      //      'tab-dash': {
      //        templateUrl: 'templates/temp/tab-dash.html',
      //        controller: 'DashCtrl'
      //      }
      //    }
      //  })
      //
      //  .state('tab.chats', {
      //    url: '/chats',
      //    views: {
      //      'tab-chats': {
      //        templateUrl: 'templates/temp/tab-chats.html',
      //        controller: 'ChatsCtrl'
      //      }
      //    }
      //  })
      //  .state('tab.chat-detail', {
      //    url: '/chats/:chatId',
      //    views: {
      //      'tab-chats': {
      //        templateUrl: 'templates/temp/chat-detail.html',
      //        controller: 'ChatDetailCtrl'
      //      }
      //    }
      //  })
      //
      //  .state('tab.account', {
      //    url: '/account',
      //    views: {
      //      'tab-account': {
      //        templateUrl: 'templates/temp/tab-account.html',
      //        controller: 'AccountCtrl'
      //      }
      //    }
      //  });
      //
      //$stateProvider.state('login',{
      //  url:'/login',
      //  templateUrl: 'templates/login/login.html',
      //  controller: 'loginCtrl'
      //});
      //$stateProvider.state('intro',{
      //  url:'/intro',
      //  templateUrl: 'templates/intro.html',
      //  controller: 'introCtrl'
      //});
      //
      //$stateProvider.state('userProto',{
      //  url:'/user/proto',
      //  templateUrl:'templates/user-proto.html'
      //});
      //// if none of the above states are matched, use this as the fallback
      //$urlRouterProvider.otherwise('/user/proto');
      ////$urlRouterProvider.otherwise('/intro');
    }
  }
)(this);

