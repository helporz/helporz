/**
 * Created by binfeng on 16/3/29.
 */
;(
  function(){
    'use strict';
    angular.module('com.helporz.jim.services',['ionic']).
      factory('jimService',['$log','$window','$document','$q',imServiceFactoryFn]);

    function imServiceFactoryFn($log,$window,$document,$q) {
      // for browser
      //var _jmessagePlugin = {
      //  login:function() {},
      //  logout:function() {},
      //  getSingleHistoryMessage:function() {},
      //  sendSingleTextMessage:function() {},
      //  getSingleConversationList:function() {}
      //};
      //
      //var _jPlushPlugin = {
      //
      //};
      //
      //$window.plugins = {};
      //$window.plugins.jPushPlugin = _jPlushPlugin;
      //$window.plugins.jmessagePlugin = _jmessagePlugin;
      // end for browser

      var jimServiceFactory = {};

      var _init = function() {
        if(typeof($window.plugins) !== 'undefined') {
          $window.plugins.jPushPlugin.init();
          $window.plugins.jmessagePlugin.init();
          //$document.on("jmessage.conversationChange", config.onConversatinoChange);
          //$document.on("jmessage.singleReceiveMessage", config.onSingleReceiveMessage);
        }
        else {
          console.log(typeof(device));
          console.log('test for browser');
          var _jmessagePlugin = {
            login:function() {},
            logout:function() {},
            getSingleHistoryMessage:function() {},
            sendSingleTextMessage:function() {},
            getSingleConversationList:function() {}
          };

          var _jPlushPlugin = {

          };

          $window.plugins = {};
          $window.plugins.jPushPlugin = _jPlushPlugin;
          $window.plugins.jmessagePlugin = _jmessagePlugin;
        }

      }

      var _login = function($username,$password,onSuccessFn,onFailedFn) {
        //登录前清空用户名
        $window.plugins.jmessagePlugin.username  = '';

        $window.plugins.jmessagePlugin.login($username, $password, function (response) {
          var ss = JSON.stringify(response);
          console.log("login callback sucess" + ss);
          $window.plugins.jmessagePlugin.username = $username;
          //gotoConversation();
          onSuccessFn(response);
        }, function (response) {
          var ss = JSON.stringify(response);
          console.log("login callback fail" + ss);

          alert("login fail. errcode:"+ response.errorCode + "  error discription:" +  response.errorDscription);

          //error code 请参考 http://docs.jpush.io/client/im_errorcode/
          console.log(device.platform);
          console.log(response.errorCode);
          onFailedFn(response);

          if(response.errorCode == "801003"){
            console.log("用户未注册");
          }
        });
      };

      var _testloginForPromise = function($username,$password) {
        var imLoginDefer = $q.defer();
        imLoginDefer.resolve();
        return imLoginDefer.promise;
      }

      var _loginForPromise = function($username,$password) {
        //登录前清空用户名
        var imLoginDefer = $q.defer();
        if( typeof($window.plugins.jmessagePlugin.login) === 'undefined') {
          imLoginDefer.reject();
          return imLoginDefer.promise;
        }

        try {
          $window.plugins.jmessagePlugin.username  = '';

          $window.plugins.jmessagePlugin.login($username, $password, function (response) {
            var ss = JSON.stringify(response);
            console.log("login callback sucess" + ss);
            $window.plugins.jmessagePlugin.username = $username;
            imLoginDefer.resolve();
          }, function (response) {
            var ss = JSON.stringify(response);
            console.log("login callback fail" + ss);

            console.log("login fail. errcode:"+ response.errorCode + "  error discription:" +  response.errorDscription);

            //error code 请参考 http://docs.jpush.io/client/im_errorcode/
            console.log(device.platform);
            console.log(response.errorCode);

            if(response.errorCode == "801003"){
              console.log("用户未注册");
            }
            imLoginDefer.reject("im登录失败，错误码为" + response.errorCode);
          });
        }
        catch(e) {
          $log.error('loginForPromise failed!' + JSON.stringify(e));
          imLoginDefer.reject(e);
        }
        return imLoginDefer.promise;
      };


      var _logout = function() {
        console.log("logout");

        $window.plugins.jmessagePlugin.logout(function (response) {
          console.log("logout success");
          $window.plugins.jmessagePlugin.username = '';
        }, function (response) {
          console.log("logout fail");
        });
      };


      var _getMessageHistory = function(username,messagePos,messageCount,onSuccessFn,onFailedFn) {
        console.log("getMessageHistory lastest 50 message with username:" + username);
        //读取的是从0开始的50条聊天记录，可按实现需求传不同的值
        $window.plugins.jmessagePlugin.getSingleHistoryMessage(username, messagePos, messageCount, function (response) {

          var ss = JSON.stringify(response);
          console.log("getMessageHistory ok: " + ss);
          <!--for (var o in response) {-->
          <!--insertMessage(response[o]);-->
          <!--}-->
          //tempMessageDataSource = response;
          //refreshConversation();
          onSuccessFn(response);
        }, function (response) {
          alert("getMessageHistory failed");
          console.log("getMessageHistory fail" + response);
          onFailedFn(response);
        });
      };

      var _sendTextMessage = function(userId,cUserId,msgType,messageContent,onSuccessFn,onFailedFn) {
        console.log("send message to " + cUserId + " :content is " + messageContent);
        $window.plugins.jmessagePlugin.sendSingleTextMessage(cUserId, messageContent, function (response) {
          var ss = JSON.stringify(response);
          console.log("send message sucess" + ss);
          //alert(ss);
          var msg_body = new Object();
          msg_body.text = messageContent;
          var dict = new Object();
          dict.msg_type = 'text';
          dict.from_name = window.plugins.jmessagePlugin.username;
          dict.from_id=window.plugins.jmessagePlugin.username;
          dict.msg_body = 'text';
          dict.create_time = new Date().getTime();

          //tempMessageDataSource.unshift(dict);
          //refreshConversation();
          <!--insertMessage(dict);-->
          onSuccessFn(response);
        }, function (response) {
          console.log("send message fail" + response);
          //alert("send message fail" + response);

          onFailedFn(response);
        });
      };

      //更新会话列表
      var _updateConversationList = function (onSuccessFn,onFailedFn) {

        console.log("updateConversationList");
        console.log("plugins:" + JSON.stringify($window.plugins));
        $window.plugins.jmessagePlugin.getSingleConversationList(function (response) {
          var ss = JSON.stringify(response);
          console.log("getAllSingleConversation ok" + ss);

          onSuccessFn(response);

          //for (var o in response) {
          //  addConversationCBFn(response[o]);
          //}
        }, function (response) {
          alert("getAllSingleConversation failed");
          console.log("getAllSingleConversation fail" + response);
          onFailedFn(response);
        });
      };

      var _getUsername = function() {
        return $window.plugins.jmessagePlugin.username;
      }

      var _updateMessageNotifyCB = function(config) {
        $document.on("jmessage.conversationChange", config.onConversatinoChange);
        $document.on("jmessage.singleReceiveMessage", config.onSingleReceiveMessage);
      }
      //var _getUserInfo = function(onSuccessFn,onFailedFn) {
      //  console.log('get user information');
      //  $window.plugins.jmessagePlugin.getUserInfo(onSuccessFn,onFailedFn);
      //};

      jimServiceFactory.init = _init;
      jimServiceFactory.login = _login;
      jimServiceFactory.logout = _logout;
      jimServiceFactory.getMessageHistory = _getMessageHistory;
      jimServiceFactory.sendTextMessage = _sendTextMessage;
      jimServiceFactory.updateConversationList = _updateConversationList;
      jimServiceFactory.getUsername = _getUsername;
      jimServiceFactory.updateMessageNotifyCB = _updateMessageNotifyCB;
      //jimServiceFactory.getUserInfo = _getUserInfo;
      jimServiceFactory.loginForPromise = _loginForPromise;
      jimServiceFactory.testloginForPromise = _testloginForPromise;
      return jimServiceFactory;
    }

  }
)();
