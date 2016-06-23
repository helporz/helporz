/**
 * Created by binfeng on 16/3/24.
 */
;(
  function(window) {
    'use strict';
    angular.module('pusher',['ionic']).
    factory('pushService',['$http','$window','$document',pushServiceFactoryFn]);

    function pushServiceFactoryFn($http,$window,$document) {
      var jpushServiceFactory={};
      var registrationId = '';

      //启动极光推送
      var _init=function(config){
        console.log($document);
        if(typeof($window.plugins) !== 'undefined') {
          //$window.plugins.jPushPlugin.init();
          //$window.plugins.jmessagePlugin.init();
          //设置tag和Alias触发事件处理

          //$document.on("jpush.setTagsWithAlias", config.onSetTagsWithAlias);
          //$document.on("jpush.openNotification", config.onOpenNotification);
          //$document.on("jpush.receiveNotification", config.onReceiveNotification);
          //$document.on("jpush.receiveMessage", config.onReceivePushMessage);

          //document.addEventListener('jpush.setTagsWithAlias',config.stac,false);
          //打开推送消息事件处理
          //$window.plugins.jPushPlugin.openNotificationInAndroidCallback=config.oniac;

          $window.plugins.jPushPlugin.setDebugMode(true);
        }
      }

      var _setNotificationFn = function(callbackConfig) {
        console.log('set jpush notification function');
        $document.on("jpush.setTagsWithAlias", callbackConfig.onSetTagsWithAlias);
        $document.on("jpush.openNotification", callbackConfig.onOpenNotification);
        $document.on("jpush.receiveNotification", callbackConfig.onReceiveNotification);
        $document.on("jpush.receiveMessage", callbackConfig.onReceivePushMessage);
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
          //alert("JPushPlugin:registrationID is "+ data);
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
      jpushServiceFactory.getRegistrationID = _getRegistrationID;
      jpushServiceFactory.getCurrentRegistrationID = _getCurrentRegistrationID;

      jpushServiceFactory.setNotificationFn = _setNotificationFn;

      return jpushServiceFactory;
    }
  }
)(
  this
);

