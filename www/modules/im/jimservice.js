/**
 * Created by binfeng on 16/3/29.
 */
;(
  function(){
    'use strict';
    angular.module('com.helporz.jim.services',['ionic']).
      factory('jimService',['$window','$document',imServiceFactoryFn]);

    function imServiceFactoryFn($window,$document) {
      var jimServiceFactory = {};

      var _init = function(config) {
        if(typeof(device) !== 'undefined') {
          $window.plugins.jPushPlugin.init();
          $window.plugins.jmessagePlugin.init();
          $document.addEventListener("jmessage.conversationChange", config.onConversatinoChange, false);
          $document.addEventListener("jmessage.singleReceiveMessage", config.onSingleReceiveMessage, false);
        }

      }

      var _login = function($username,$password,onSuccessFn,onFailedFn) {
        $window.plugins.jmessagePlugin.login($username, $password, function (response) {
          var ss = JSON.stringify(response);
          console.log("login callback sucess" + ss);
          $window.plugins.jmessagePlugin.username = $username;
          alert("login ok");
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
            alert("用户未注册");
          }

        });
      };

      var _logout = function() {
        console.log("logout");

        $window.plugins.jmessagePlugin.logout(function (response) {
          alert("logout success");
        }, function (response) {

          alert("logout fail");
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

      var _sendTextMessage = function(toUsername,messageContentString,onSuccessFn,onFailedFn) {
        $window.plugins.jmessagePlugin.sendSingleTextMessage(toUsername, messageContentString, function (response) {
          var ss = JSON.stringify(response);
          console.log("send message sucess" + ss);
          alert(ss);
          var msg_body = new Object();
          msg_body.text = messageContentString;
          var dict = new Object();
          dict.msg_type = msgType;
          dict.from_name = getUserDisplayName();
          dict.from_id=window.plugins.jmessagePlugin.username;
          dict.msg_body = 'text';
          dict.create_time = new Date().getTime();

          //tempMessageDataSource.unshift(dict);
          //refreshConversation();
          <!--insertMessage(dict);-->
          onSuccessFn(response);
        }, function (response) {
          console.log("send message fail" + response);
          alert("send message fail" + response);

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
      //jimServiceFactory.getUserInfo = _getUserInfo;
      return jimServiceFactory;
    }

  }
)();
