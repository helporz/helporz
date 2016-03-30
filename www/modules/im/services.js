;(
  function() {
    'use strict';
    angular.module('com.helporz.im.services', ['com.helporz.jim.services']).run(['jimService',init])
      .factory('imConversationService',['jimService','localStorageService','imMessageService',imConversationServiceFactoryFn])
      .factory('imMessageStorageService',['localStorageService',imMessageStorageServiceFactoryFn])
      .factory('imMessageService',['localStorageService',imMessageServiceFactoryFn])
      .factory("userService", function($http) {
        var users = [];
        return {
          getUsers: function() {
            return $http.get("https://randomuser.me/api/?results=10").then(function(response) {
              users = response.data.results;
              return response.data.results;
            });
          },
          getUser: function(index) {
            return users[index];
          }
        };
      })

      .factory('localStorageService', [function() {
        return {
          get: function localStorageServiceGet(key, defaultValue) {
            var stored = localStorage.getItem(key);
            try {
              stored = angular.fromJson(stored);
            } catch (error) {
              stored = null;
            }
            if (defaultValue && stored === null) {
              stored = defaultValue;
            }
            return stored;
          },
          update: function localStorageServiceUpdate(key, value) {
            if (value) {
              localStorage.setItem(key, angular.toJson(value));
            }
          },
          clear: function localStorageServiceClear(key) {
            localStorage.removeItem(key);
          }
        };
      }])
      .factory('dateService', [function() {
        return {
          handleMessageDate: function(messages) {
            var i = 0,
              length = 0,
              messageDate = {},
              nowDate = {},
              weekArray = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
              diffWeekValue = 0;
            if (imConversations) {
              nowDate = this.getNowDate();
              length = imConversations.length;
              for (i = 0; i < length; i++) {
                messageDate = this.getMessageDate(imConversations[i]);
                if(!messageDate){
                  return null;
                }
                if (nowDate.year - messageDate.year > 0) {
                  imConversations[i].lastMessage.time = messageDate.year + "";
                  continue;
                }
                if (nowDate.month - messageDate.month >= 0 ||
                  nowDate.day - messageDate.day > nowDate.week) {
                  imConversations[i].lastMessage.time = messageDate.month +
                    "月" + messageDate.day + "日";
                  continue;
                }
                if (nowDate.day - messageDate.day <= nowDate.week &&
                  nowDate.day - messageDate.day > 1) {
                  diffWeekValue = nowDate.week - (nowDate.day - messageDate.day);
                  imConversations[i].lastMessage.time = weekArray[diffWeekValue];
                  continue;
                }
                if (nowDate.day - messageDate.day === 1) {
                  imConversations[i].lastMessage.time = "昨天";
                  continue;
                }
                if (nowDate.day - messageDate.day === 0) {
                  imConversations[i].lastMessage.time = messageDate.hour + ":" + messageDate.minute;
                  continue;
                }
              }
              // console.log(messages);
              // return messages;
            } else {
              console.log("messages is null");
              return null;
            }

          },
          getNowDate: function() {
            var nowDate = {};
            var date = new Date();
            nowDate.year = date.getFullYear();
            nowDate.month = date.getMonth();
            nowDate.day = date.getDate();
            nowDate.week = date.getDay();
            nowDate.hour = date.getHours();
            nowDate.minute = date.getMinutes();
            nowDate.second = date.getSeconds();
            return nowDate;
          },
          getMessageDate: function(message) {
            var messageDate = {};
            var messageTime = "";
            //2015-10-12 15:34:55
            var reg = /(^\d{4})-(\d{1,2})-(\d{1,2})\s(\d{1,2}):(\d{1,2}):(\d{1,2})/g;
            var result = new Array();
            if (message) {
              messageTime = message.lastMessage.originalTime;
              result = reg.exec(messageTime);
              if (!result) {
                console.log("result is null");
                return null;
              }
              messageDate.year = parseInt(result[1]);
              messageDate.month = parseInt(result[2]);
              messageDate.day = parseInt(result[3]);
              messageDate.hour = parseInt(result[4]);
              messageDate.minute = parseInt(result[5]);
              messageDate.second = parseInt(result[6]);
              // console.log(messageDate);
              return messageDate;
            } else {
              console.log("message is null");
              return null;
            }
          }
        };
      }])
      .factory('messageService', ['localStorageService', 'dateService',
        function(localStorageService, dateService) {
          return {
            init: function(messages) {
              var i = 0;
              var length = 0;
              var messageID = new Array();
              var date = null;
              var messageDate = null;
              if (imConversations) {
                length = imConversations.length;
                for (; i < length; i++) {
                  messageDate = dateService.getMessageDate(imConversations[i]);
                  if(!messageDate){
                    return null;
                  }
                  date = new Date(messageDate.year, messageDate.month,
                    messageDate.day, messageDate.hour, messageDate.minute,
                    messageDate.second);
                  imConversations[i].lastMessage.timeFrome1970 = date.getTime();
                  messageID[i] = {
                    id: imConversations[i].id
                  };

                }
                localStorageService.update("messageID", messageID);
                for (i = 0; i < length; i++) {
                  localStorageService.update("message_" + imConversations[i].id, imConversations[i]);
                }
              }
            },
            getAllMessages: function() {
              var messages = new Array();
              var i = 0;
              var messageID = localStorageService.get("messageID");
              var length = 0;
              var message = null;
              if (messageID) {
                length = messageID.length;

                for (; i < length; i++) {
                  message = localStorageService.get("message_" + messageID[i].id);
                  if(message){
                    imConversations.push(message);
                  }
                }
                dateService.handleMessageDate(imConversations);
                return imConversations;
              }
              return null;

            },
            getMessageById: function(id){
              return localStorageService.get("message_" + id);
            },
            getAmountMessageById: function(num, id){
              var messages = [];
              var message = localStorageService.get("message_" + id).message;
              var length = 0;
              if(num < 0 || !message) return;
              length = message.length;
              if(num < length){
                imConversations = message.splice(length - num, length);
                return imConversations;
              }else{
                return message;
              }
            },
            updateMessage: function(message) {
              var id = 0;
              if (message) {
                id = message.id;
                localStorageService.update("message_" + id, message);
              }
            },
            deleteMessageId: function(id){
              var messageId = localStorageService.get("messageID");
              var length = 0;
              var i = 0;
              if(!messageId){
                return null;
              }
              length = messageId.length;
              for(; i < length; i++){
                if(messageId[i].id === id){
                  messageId.splice(i, 1);
                  break;
                }
              }
              localStorageService.update("messageID", messageId);
            },
            clearMessage: function(message) {
              var id = 0;
              if (message) {
                id = message.id;
                localStorageService.clear("message_" + id);
              }
            }
          };
        }
      ]);

    var onConversatinoChange = function (data) {
      alert("onConversatinoChange");
      console.log(data);
    };

    var updateConversationList = function (data) {
      alert("updateConversationList");
      console.log(data);
    };

    function imConversationServiceFactoryFn (jimService,localStorageService,imMessageService) {
      var imConversationServiceFactoryFactory = {};

      var _getLocalConversation = function(){
        return localStorageService.get('conversation-list',null);
      };

      var _updateConversationFromImServer = function(onSuccessFn,onFailedFn) {
        jimService.updateConversationList(function(conversationData) {

          var conversationList = _getLocalConversation();
          if( conversationList == null ) {
            conversationList = new Array();
          }
          for( var item in conversationData) {
            var conversation = {};
            conversation.name = item.name;
            conversation.nickname = item.nickname;
            conversation.isTop = fales;
            conversation.lastMessage.content = item.lastMessage;
            conversation.noReadMessages = item.noReadMessages;
            conversation.pic = '';
            conversation.showHints = 0;
            conversationList.push(item);
          }
          localStorageService.update('conversation-list',conversationList);
          onSuccessFn(conversationList);
        },function(failedData) {
          onFailedFn(failedData);
        });
      };

      var _updateConversation2Local = function(conversation) {

      };

      var _deleteConversation4Local = function(conversation) {
        // delete conversation from localstorage
          imMessageSerivce.deleteMessageList(conversation.username,conversation.toUsername);
      }

      imConversationServiceFactoryFactory.getLocalConversation = _getLocalConversation;

      imConversationServiceFactoryFactory.updateConversationFromImServer = _updateConversationFromImServer;

      imConversationServiceFactoryFactory.updateConversation2Local = _updateConversation2Local;

      imConversationServiceFactoryFactory.deleteConversation4Local = _deleteConversation4Local;

      return imConversationServiceFactoryFactory;
    };

    function imMessageStorageServiceFactoryFn(localStorageService) {

      var imMessage = {
        usename:'',
        toUsername:'',
        date:'',
        serialno:'',
        type:'text',
        message:''
      };

      var _addMessage = function(username,toUsername,message) {
        var messageObjList = localStorageService.get(username + toUsername,null);
        if( messageObjList == null || messageObjList.length == 0 ) {
          var messageArray = new Array();
          messageArray.push(message);
          localStorageService.update(username + toUsername,messageArray);
        }
        else {
          messageObjList.push(message);
          localStorageService.update(username + toUsername,messageObjList);
        }
      }

      var _getMessageList = function(username,toUsername) {
        return localStorageService.get(username + toUsername,null);
      }

      var _deleteMessageList = function(username,toUsername) {
        localStorageService.clear(username+toUsername);
      }

      return {
        addMessage:_addMessage,
        getMessageList:_getMessageList,
        deleteMessageList:_deleteMessageList
      };
    }

    function imMessageServiceFactoryFn(jimService,imMessageStorageService) {
        var _getLocalMessageList = function(username,toUsername) {
          return imMessageStorageService.getMessageList(username,toUsername);
        };

      var _getHistoryMessageList = function (username,toUsername,startPos,count,onSuccessFn,onFailedFn) {
        var _onSuccessForInnerFn = function(messageList) {
          for(var m in messageList ) {
            imMessageStorageService.addMessage(username,toUsername,m);
          }
          onSuccessFn(messageList);
        };
        jimService.getMessageHistory(toUsername,startPos,count,_onSuccessForInnerFn,onFailedFn);
      }

      var _addMessage= function(username,toUsername,message) {
        imMessageStorageService.addMessage(username,toUsername,message);
      }

      var _deleteMessageList = function(username,toUsername) {
        imMessageStorageService.deleteMessageList(username,toUsername);
      }

      return {
        getLocalMessageList:_getLocalMessageList,
        getHistoryMessageList:_getHistoryMessageList,
        addMessage:_addMessage,
        deleteMessageList:_deleteMessageList
      };
    }

    function init(jimService) {
      var config = {
        onConversatinoChange:onConversatinoChange,
        onSingleReceiveMessage:onSingleReceiveMessage
      };
      jimService.init(config);
    };


  }
)();


