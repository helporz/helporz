/**
 * Created by binfeng on 16/3/24.
 */
;(
  function(window) {
    'use strict';
    var pusher = angular.module('pusher',['ionic']);
    pusher.factory('pushService',['$http','$window','$document',pushServiceFactoryFn]);

    function pushServiceFactoryFn($http,$windows,$document) {
      var jpushServiceFactory={};
      var registrationId = '';

      //启动极光推送
      var _init=function(config){
        $window.plugins.jPushPlugin.init();
        //设置tag和Alias触发事件处理

        document.addEventListener("jpush.setTagsWithAlias", config.onSetTagsWithAlias, false);
        document.addEventListener("jpush.openNotification", config.onOpenNotification, false);
        document.addEventListener("jpush.receiveNotification", config.onReceiveNotification, false);
        document.addEventListener("jpush.receiveMessage", config.onReceivePushMessage, false);

        //document.addEventListener('jpush.setTagsWithAlias',config.stac,false);
        //打开推送消息事件处理
        //$window.plugins.jPushPlugin.openNotificationInAndroidCallback=config.oniac;

        $window.plugins.jPushPlugin.setDebugMode(true);
      }
      //获取状态
      var _isPushStopped=function(fun){
        $window.plugins.jPushPlugin.isPushStopped(fun)
      }
      //停止极光推送
      var _stopPush=function(){
        $window.plugins.jPushPlugin.stopPush();
      }

      //重启极光推送
      var _resumePush=function(){
        $window.plugins.jPushPlugin.resumePush();
      }

      //设置标签和别名
      var _setTagsWithAlias=function(tags,alias){
        $window.plugins.jPushPlugin.setTagsWithAlias(tags,alias);
      }

      //设置标签
      var _setTags=function(tags){
        $window.plugins.jPushPlugin.setTags(tags);
      }

      //设置别名
      var _setAlias=function(alias){
        $window.plugins.jPushPlugin.setAlias(alias);
      }


      var _defaultGetRegistrationCB = function(data) {
        try {
          console.log("JPushPlugin:registrationID is "+ data);
          alert("JPushPlugin:registrationID is "+ data);
          if( data !== '' ) {
            registrationId = data;
          }
        }
        catch(exception) {
          console.log(exception);
        }
      }

      var _getRegistrationID = function() {
        $window.plugins.jPushPlugin.getRegistrationID(_defaultGetRegistrationCB);
      }

      var _getCurrentRegistrationID = function() {
        return registrationId;
      }

      jpushServiceFactory.init=_init;
      jpushServiceFactory.isPushStopped=_isPushStopped;
      jpushServiceFactory.stopPush=_stopPush;
      jpushServiceFactory.resumePush=_resumePush;

      jpushServiceFactory.setTagsWithAlias=_setTagsWithAlias;
      jpushServiceFactory.setTags=_setTags;
      jpushServiceFactory.setAlias=_setAlias;
      jpushServiceFactory.getReistrationID = _getRegistrationID;
      jpushServiceFactory.getCurrentReistrationID = _getCurrentRegistrationID;

      return jpushServiceFactory;
    }
  }
)(
  this
);

