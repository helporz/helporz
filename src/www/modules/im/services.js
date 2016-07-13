;
(function () {
  'use strict';
  angular.module('com.helporz.im.services', ['com.helporz.jim.services', 'com.helporz.utils.service','app.user.utils.service'])
    .factory('imConversationService', imConversationServiceFactoryFn)
    .factory('imMessageStorageService', imMessageStorageServiceFactoryFn)
    .factory('imMessageService', imMessageServiceFactoryFn)
    .factory("IMInterfaceService", IMInterfaceServiceFn)

    //.factory('localStorageService', [function() {
    //  return {
    //    get: function localStorageServiceGet(key, defaultValue) {
    //      var stored = localStorage.getItem(key);
    //      try {
    //        stored = angular.fromJson(stored);
    //      } catch (error) {
    //        stored = null;
    //      }
    //      if (stored === null || stored.length == 0 ) {
    //        stored = defaultValue;
    //      }
    //      return stored;
    //    },
    //    update: function localStorageServiceUpdate(key, value) {
    //      if (value) {
    //        localStorage.setItem(key, angular.toJson(value));
    //      }
    //    },
    //    clear: function localStorageServiceClear(key) {
    //      localStorage.removeItem(key);
    //    }
    //  };
    //}])
    .factory('dateService', [function () {
      return {
        handleMessageDate: function (messages) {
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
              if (!messageDate) {
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
        getNowDate: function () {
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
        getMessageDate: function (message) {
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
    }]);
  //.factory('messageService', ['localStorageService', 'dateService',
  //  function (localStorageService, dateService) {
  //    return {
  //      init: function (messages) {
  //        var i = 0;
  //        var length = 0;
  //        var messageID = new Array();
  //        var date = null;
  //        var messageDate = null;
  //        if (imConversations) {
  //          length = imConversations.length;
  //          for (; i < length; i++) {
  //            messageDate = dateService.getMessageDate(imConversations[i]);
  //            if (!messageDate) {
  //              return null;
  //            }
  //            date = new Date(messageDate.year, messageDate.month,
  //              messageDate.day, messageDate.hour, messageDate.minute,
  //              messageDate.second);
  //            imConversations[i].lastMessage.timeFrome1970 = date.getTime();
  //            messageID[i] = {
  //              id: imConversations[i].id
  //            };
  //
  //          }
  //          localStorageService.update("messageID", messageID);
  //          for (i = 0; i < length; i++) {
  //            localStorageService.update("message_" + imConversations[i].id, imConversations[i]);
  //          }
  //        }
  //      },
  //      getAllMessages: function () {
  //        var messages = new Array();
  //        var i = 0;
  //        var messageID = localStorageService.get("messageID");
  //        var length = 0;
  //        var message = null;
  //        if (messageID) {
  //          length = messageID.length;
  //
  //          for (; i < length; i++) {
  //            message = localStorageService.get("message_" + messageID[i].id);
  //            if (message) {
  //              imConversations.push(message);
  //            }
  //          }
  //          dateService.handleMessageDate(imConversations);
  //          return imConversations;
  //        }
  //        return null;
  //
  //      },
  //      getMessageById: function (id) {
  //        return localStorageService.get("message_" + id);
  //      },
  //      getAmountMessageById: function (num, id) {
  //        var messages = [];
  //        var message = localStorageService.get("message_" + id).message;
  //        var length = 0;
  //        if (num < 0 || !message) return;
  //        length = message.length;
  //        if (num < length) {
  //          imConversations = message.splice(length - num, length);
  //          return imConversations;
  //        } else {
  //          return message;
  //        }
  //      },
  //      updateMessage: function (message) {
  //        var id = 0;
  //        if (message) {
  //          id = message.id;
  //          localStorageService.update("message_" + id, message);
  //        }
  //      },
  //      deleteMessageId: function (id) {
  //        var messageId = localStorageService.get("messageID");
  //        var length = 0;
  //        var i = 0;
  //        if (!messageId) {
  //          return null;
  //        }
  //        length = messageId.length;
  //        for (; i < length; i++) {
  //          if (messageId[i].id === id) {
  //            messageId.splice(i, 1);
  //            break;
  //          }
  //        }
  //        localStorageService.update("messageID", messageId);
  //      },
  //      clearMessage: function (message) {
  //        var id = 0;
  //        if (message) {
  //          id = message.id;
  //          localStorageService.clear("message_" + id);
  //        }
  //      }
  //    };
  //  }
  //])

  imConversationServiceFactoryFn.$inject = ['$q', '$log', 'imMessageStorageService'];
  function imConversationServiceFactoryFn($q, $log, imMessageStorageService) {
    //var imConversationServiceFactoryFactory = {};
    var conversationCache = {};

    var initService = function () {
      var _innerDefer = $q.defer();
      imMessageStorageService.getConversationList().then(function (cList) {
        for (var index = 0; index < cList.length; ++index) {
          conversationCache[cList[index].id] = cList[index];
        }
        $log.debug('current conversation cache :' + JSON.stringify(conversationCache));
        _innerDefer.resolve();
      }, function (error) {
        $log.error(error);
        _innerDefer.reject(error);
      })
      return _innerDefer.promise;
    }

    var getConversationList = function () {
      var list = new Array();
      for (var cId in conversationCache) {
        if (conversationCache[cId] != null) {
          list.push(conversationCache[cId]);
        }
      }
      return list;
    }

    var addConversation = function (conversation) {
      var _innerDefer = $q.defer();
      imMessageStorageService.addConversation(conversation).then(function (conversationId) {
        conversation.id = conversationId;
        conversationCache[conversationId] = conversation;
        _innerDefer.resolve(conversationId);
      }, function (error) {
        $log.error(error);
        _innerDefer.reject(error);
      })
      return _innerDefer.promise;
    }

    var updateConversation = function (conversation) {
      var _innerDefer = $q.defer()
      imMessageStorageService.updateConversation(conversation).then(function (res) {
        conversationCache[conversation.id] = conversation;
        _innerDefer.resolve();
      }, function (error) {
        $log.error(error);
        _innerDefer.reject(error);
      });
      return _innerDefer.promise;
    }

    var deleteConversation = function (conversation) {
      var _innerDefer = $q.defer();
      imMessageStorageService.deleteConversation(conversation).then(function (res) {
          conversationCache[conversation.id] = null;
        }, function (error) {
          $log.error(error);
          _innerDefer.reject(error);
        }
      )
      return _innerDefer.promise;
    }

    var getConversation = function (userId, cUserId) {
      for (var cId in conversationCache) {
        if (conversationCache[cId].userId === userId && conversationCache[cId].cUserId == cUserId) {
          return conversationCache[cId];
        }
      }
      return null;
    }

    var unReadMessageCount = function () {
      var messageCount = 0;
      for (var cId in conversationCache) {
        messageCount += cId.noReadMessages;
      }
      return messageCount;
    }


    return {
      initService: initService,
      getConversationList: getConversationList,
      addConversation: addConversation,
      updateConversation: updateConversation,
      deleteConversation: deleteConversation,
      getConversation: getConversation,
      unReadMessageCount: unReadMessageCount,
    }
    //var _getLocalConversation = function () {
    //  return localStorageService.get('conversation-list', null);
    //};
    //
    //var _updateConversationFromImServer = function (onSuccessFn, onFailedFn) {
    //  jimService.updateConversationList(function (conversationData) {
    //
    //    var conversationList = _getLocalConversation();
    //    if (conversationList == null) {
    //      conversationList = new Array();
    //    }
    //    for (var item in conversationData) {
    //      var conversation = {};
    //      conversation.name = item.name;
    //      conversation.nickname = item.nickname;
    //      conversation.isTop = false;
    //      conversation.lastMessage.content = item.lastMessage;
    //      conversation.noReadMessages = item.noReadMessages;
    //      conversation.pic = '';
    //      conversation.showHints = 0;
    //      conversationList.push(item);
    //    }
    //    localStorageService.update('conversation-list', conversationList);
    //    onSuccessFn(conversationList);
    //  }, function (failedData) {
    //    onFailedFn(failedData);
    //  });
    //};
    //
    //var _updateConversation2Local = function (conversation) {
    //
    //};
    //
    //var _addConversation2Local = function (conversation) {
    //  var conversationList = _getLocalConversation();
    //  if (conversationList == null) {
    //    conversationList = new Array();
    //  }
    //
    //  conversationList.push(conversation);
    //  localStorageService.update('conversation-list', conversationList);
    //};
    //
    //var _deleteConversation4Local = function (conversation) {
    //  // delete conversation from localstorage
    //  imMessageSerivce.deleteMessageList(conversation.username, conversation.toUsername);
    //}
    //
    //var _clearConversation4Local = function () {
    //  localStorageService.clear('conversation-list');
    //}

    //imConversationServiceFactoryFactory.getLocalConversation = _getLocalConversation;
    //
    //imConversationServiceFactoryFactory.updateConversationFromImServer = _updateConversationFromImServer;
    //
    //imConversationServiceFactoryFactory.updateConversation2Local = _updateConversation2Local;
    //
    //imConversationServiceFactoryFactory.deleteConversation4Local = _deleteConversation4Local;
    //
    //imConversationServiceFactoryFactory.addConversation2Local = _addConversation2Local;
    //
    //imConversationServiceFactoryFactory.clearConversation4Local = _clearConversation4Local;
    //return imConversationServiceFactoryFactory;
  };

  imMessageStorageServiceFactoryFn.$inject = ['$log', '$q', 'dbService', 'UtilsService'];
  function imMessageStorageServiceFactoryFn($log, $q, dbService, UtilsService) {

    var patterns = {
      imMessage: {
        id: null,
        'userId': '0',
        'cUserId': '0',
        'type': 'text',
        message: null,
        time: null,
        isFromMe: 0,
        sendState: 0,
        ext: null
      },
      imConversation: {
        id: null,
        'userId': '0',
        isTop: 0,
        showHints: 0,
        noReadMessages: 0,
        'cUserId': '0',
        cUserNickname: null,
        cUserLoginName: null,
        cUserAvatar: null,
        created: null,
        lastMessage: '',
        lastMessageTime: null
      },
    };

    var recordSetItem2Record = function (table, recordSetItem) {
      var pattern = patterns[table];
      if (pattern == null || pattern == '') {
        $log.error("invalid table name");
        return null;
      }

      return dbService.createRow(table, recordSetItem, pattern);
    };

    var _createRecord = function (table) {
      var pattern = patterns[table];
      if (pattern == null || pattern == '') {
        $log.error("invalid table name");
        return null;
      }

      return dbService.createRow(table, null, pattern);
    };
    var newMessage = function () {
      return _createRecord('imMessage');
    }
    var _currentUserId = null;
    var initDB = function (userId) {
      var _innerDefer = $q.defer();
      $log.info('imMessageStorageService init -> userId:' + userId);
      if (userId != null) {
        _currentUserId = userId;
      }

      var tableSqlList = ['CREATE TABLE IF NOT EXISTS imMessage(id  INTEGER PRIMARY KEY AUTOINCREMENT,userId text,cUserId text,type text,message text,time text,isFromMe integer,' +
      'sendState integer,ext text)',
        'CREATE TABLE IF NOT EXISTS imConversation(id  INTEGER PRIMARY KEY AUTOINCREMENT,userId text,isTop integer, showHints integer,noReadMessages integer,cUserId text,' +
        'cUserNickname text, cUserLoginName text,cUserAvatar text, created text,lastMessage text,lastMessageTime text)'];

      $log.info('im message execute sql list:' + tableSqlList[0]);
      $log.info('im message execute sql list:' + tableSqlList[1]);
      dbService.executeSqlList(tableSqlList).then(function () {
        $log.info('create im message tables success');
        _innerDefer.resolve();
      }, function (error) {
        $log.error('create im message tables error: ' + error.message);
        _innerDefer.reject(error);
      });
      return _innerDefer.promise;
    }

    var saveRecords = function (table, records) {
      var pattern = patterns[table];
      if (pattern == null || pattern == '') {
        throw "invalid table name";
      }

      return dbService.saveRecords(table, records, pattern);
    }

    var addRecords = function (table, records) {
      var pattern = patterns[table];
      if (pattern == null || pattern == '') {
        throw "invalid table name";
      }

      return dbService.addRecords(table, records, pattern);
    }

    //var imMessage = {
    //  usename: '',
    //  toUsername: '',
    //  date: '',
    //  serialno: '',
    //  type: 'text',
    //  message: ''
    //};

    var _addMessage = function (imMessage) {
      //var imMessage = _createRecord('imMessage');
      //imMessage.userId = userId;
      //imMessage.cUserId = cUserId;
      //imMessage.type = type;
      //imMessage.message = message;
      //imMessage.sendState = sendState;
      //imMessage.time = UtilsService.currentDate2String();
      return addRecords('imMessage', imMessage);
    }

    var getMaxIdForMessage = function (userid, cUserId) {
      var _innerDefer = $q.defer();
      dbService.getMaxValue('imMessage', 'id', null).then(function (res) {
        _innerDefer.resolve(res);
      }, function (error) {
        _innerDefer.reject(error);
      })
      return _innerDefer.promise;
    }

    var _getMessageList = function (userId, cUserId, miniMessageId, count) {
      var _innerDefer = $q.defer();
      dbService.findRecordsEx('imMessage', 'userId = "#userId#" and cUserId = "#cUserId#" and id <= #miniId# order by id desc limit #count#'
          .replace('#userId#', userId)
          .replace('#cUserId#', cUserId).replace('#miniId#', miniMessageId)
          .replace('#count#', count)
        , patterns['imMessage']).then(function (res) {
          _innerDefer.resolve(res);
        }, function (error) {
          _innerDefer.reject(error);
        })

      return _innerDefer.promise;
    }

    var _deleteMessageList = function (userId, cUserId) {
      return dbService.dropRecords('imMessage',
        " userId = '#userId#' and cUserId = '#cUserId#'".replace('#userId#', userId).replace('#cUserId#', cUserId));
    }

    var _updateMessageState = function (message, state) {
      var cols = {
        sendState: state,
      }
      $log.info('update message[#message#] state[#state#]'.replace('#message#', JSON.stringify(message)).replace('#state#', state));
      return dbService.updateData('imMessage',
        "id = '#id#'"
          .replace('#id#', message.id),
        cols);
    };

    var _deleteMessage = function (message) {
      return dbService.dropRecords('imMessage', "id='#id#'".replace('#id#', message.id));
    };

    var addConversation = function (imConversation) {
      imConversation.created = UtilsService.currentDate2String();
      return addRecords('imConversation', imConversation);
    }

    var getConversationList = function () {
      return dbService.findRecordsEx('imConversation', " userId='#userId#'".replace('#userId#', _currentUserId), patterns['imConversation']);
    }

    var updateConversation = function (conversation) {
      return dbService.updateData('imConversation',
        "userId = '#userId#' and cUserId = '#cUserId#'"
          .replace('#userId#', conversation.userId).replace('#cUserId#', conversation.cUserId),
        conversation);
    }

    var deleteConversation = function (conversation) {
      return dbService.dropRecords('imConversation',
        "userId = '#userId#' and cUserId = '#cUserId#'"
          .replace('#userId#', conversation.userId).replace('#cUserId#', conversation.cUserId));
    }

    var searchConversation = function (userId, cUserId) {
      dbService.findRecordsEx('imConversation', " userId='#userId#' and cUserId='#cUserId#'"
        .replace('#userId#', _currentUserId)
        .replace('#cUserId#', cUserId), patterns['imConversation']);
    }

    var newConversation = function () {
      return _createRecord('imConversation');
    }

    return {
      initDB: initDB,
      newMessage: newMessage,
      newConversation: newConversation,
      addMessage: _addMessage,
      deleteMessage: _deleteMessage,
      updateMessageState: _updateMessageState,
      getMessageList: _getMessageList,
      deleteMessageList: _deleteMessageList,
      addConversation: addConversation,
      getConversationList: getConversationList,
      updateConversation: updateConversation,
      deleteConversation: deleteConversation,
      getMaxIdForMessage: getMaxIdForMessage,
      searchConversation: searchConversation,
    };
  }

  imMessageServiceFactoryFn.$inject = ['$log',
    '$q',
    '$state',
    'jimService',
    'imMessageStorageService',
    'imConversationService',
    'userNetService',
    'UtilsService',
    'userUtils',
    'IMInterfaceService',
    'debugHelpService',];
  function imMessageServiceFactoryFn($log, $q, $state, jimService, imMessageStorageService, imConversationService,
                                     userNetService, UtilsService,userUtils,IMInterfaceService, debugHelpService) {
    var msgObservers = {};
    var conversationObservers = {};

    var registerMsgObserver = function (name, observer) {
      msgObservers[name] = observer;
    }

    var registerConversationObserver = function (name, observer) {
      conversationObservers[name] = observer;
    }

    var unregisterMsgObserver = function (name) {
      msgObservers[name] = null;
    }

    var unregisterConversationObserver = function (name) {
      conversationObservers[name] = null;
    }

    var onSingleReceiveMessage = function (data) {
      $log.debug("receive im message");

      if (typeof(data.msg_type) === 'undefined' && typeof(data.contentType) === 'undefined') {
        //$log.error('receive invalid message:' + debugHelpService.writeObj(data));
      }
      else {
        //$log.info("receive messge:" + debugHelpService.writeObj(data));
        var messageDetail = {
          userId: userNetService.cache.selfInfo.userId, //由于data.target_id 与 data.from_id相等，因此用当前登录的用户名
          type: 'text',
          isFromMe: false,
          sendState: 1
        };

        var cUserLoginName = null;
        if (device.platform == "Android") {
          messageDetail.cUserId = data.fromID.split('_')[1];
          cUserLoginName = data.fromID.split('_')[0];
          messageDetail.message = data.content.text;
          messageDetail.time = UtilsService.getLocalTime(data.createTimeInSeconds * 1000);
        } else {
          messageDetail.cUserId = data.from_id.split('_')[1];
          cUserLoginName = data.from_id.split('_')[0];
          messageDetail.message = data.msg_body.text;
          messageDetail.time = UtilsService.getLocalTime(data.create_time * 1000);
        }

        $log.info('receive message:' + JSON.stringify(messageDetail));
        //
        //var cUserId = data.from_id.split('_')[1];
        //var messageDetail = {
        //  userId: userNetService.cache.selfInfo.userId, //由于data.target_id 与 data.from_id相等，因此用当前登录的用户名
        //  cUserId: cUserId,
        //  type: 'text',
        //  message: data.msg_body.text,
        //  time: UtilsService.getLocalTime(data.create_time *1000),
        //  isFromMe: false,
        //  sendState: 1
        //};

        imMessageStorageService.addMessage(messageDetail).then(function (insertId) {
          messageDetail.id = insertId;
          for (var msgOb in msgObservers) {
            if (msgObservers[msgOb] != null) {
              msgObservers[msgOb].onReceiveMessage(messageDetail);
            }
          }
        }, function (error) {
          $log.error(error);
        });

        var conversation = imConversationService.getConversation(messageDetail.userId, messageDetail.cUserId);
        if (conversation == null) {
          $log.debug("not find conversation:userId " + messageDetail.userId + " cUserId " + messageDetail.cUserId);
          conversation = imMessageStorageService.newConversation();
          conversation.userId = messageDetail.userId;
          conversation.cUserId = messageDetail.cUserId;

          var cUserInfo = userNetService.cache.userInfo[messageDetail.cUserId];
          if (cUserInfo != null) {
            $log.debug("find cUserInfo:" + JSON.stringify(cUserInfo));
            conversation.cUserNickname = cUserInfo.nickname;
            conversation.cUserLoginName = cUserInfo.loginName;
            conversation.cUserAvatar = cUserInfo.avatar;
            conversation.lastMessage = messageDetail.message;
            conversation.lastMessageTime = messageDetail.time;
            conversation.noReadMessages = 1;
            imConversationService.addConversation(conversation).then(function (insertId) {
              conversation.id = insertId;
              for (var cOb in conversationObservers) {
                conversationObservers[cOb].onAddConversation(conversation);
              }
            }, function (error) {
              $log.error('add conversation failed:' + error);
            });
          }
          else {
            $log.debug('not find cUserInfo');
            userNetService.getUserInfo(messageDetail.cUserId, function (userInfo) {
              $log.debug("getUserInfo from Server:" + JSON.stringify(userInfo));
              conversation.cUserNickname = userInfo.nickname;
              conversation.cUserLoginName = userInfo.loginName;
              conversation.cUserAvatar = userInfo.avatar;
              conversation.lastMessage = messageDetail.message;
              conversation.lastMessageTime = messageDetail.time;
              conversation.noReadMessages = 1;

              imConversationService.addConversation(conversation).then(function (insertId) {
                conversation.id = insertId;
                for (var cOb in conversationObservers) {
                  conversationObservers[cOb].onAddConversation(conversation);
                }
              }, function (error) {
                $log.error('add Conversation failed:' + error);
              });
            }, function (error) {
              $log.error('getUserInfo failed:userId(#userId#) error(#error#)'
                .replace('#userId#', messageDetail.cUserId).replace('#error#', error));
            })
          }

        }
        else {
          $log.info("conversation:" + JSON.stringify(conversation));
          conversation.noReadMessages ++;
          imConversationService.updateConversation(conversation);
        }
      }
    };

    var onOpenMessage = function (data) {
      var msg = window.JMessage.openedMessage;
      $log.info('on open message:' + JSON.stringify(msg));

      //$log.info('on open message:' + JSON.stringify(data));
      var messageDetail = {
        userId: userNetService.cache.selfInfo.userId, //由于data.target_id 与 data.from_id相等，因此用当前登录的用户名
        type: 'text',
        isFromMe: false,
        sendState: 1
      };

      var cUserLoginName = null;
      if (device.platform == "Android") {
        messageDetail.cUserId = data.fromID.split('_')[1];
        cUserLoginName = data.fromID.split('_')[0];
        messageDetail.message = data.content.text;
        messageDetail.time = UtilsService.getLocalTime(data.createTimeInSeconds * 1000);
      } else {
        messageDetail.cUserId = data.from_id.split('_')[1];
        cUserLoginName = data.from_id.split('_')[0];
        messageDetail.message = data.msg_body.text;
        messageDetail.time = UtilsService.getLocalTime(data.create_time * 1000);
      }

      $log.info('receive message:' + JSON.stringify(messageDetail));

      var conversation = imConversationService.getConversation(messageDetail.userId, messageDetail.cUserId);
      if (conversation == null) {
        $log.debug("not find conversation:userId " + messageDetail.userId + " cUserId " + messageDetail.cUserId);
        conversation = imMessageStorageService.newConversation();
        conversation.userId = messageDetail.userId;
        conversation.cUserId = messageDetail.cUserId;

        var cUserInfo = userNetService.cache.userInfo[messageDetail.cUserId];
        if (cUserInfo != null) {
          $log.debug("find cUserInfo:" + JSON.stringify(cUserInfo));
          conversation.cUserNickname = cUserInfo.nickname;
          conversation.cUserLoginName = cUserInfo.loginName;
          conversation.cUserAvatar = cUserInfo.avatar;
          conversation.lastMessage = messageDetail.message;
          conversation.lastMessageTime = messageDetail.time;
          conversation.noReadMessages = 1;
          imConversationService.addConversation(conversation).then(function (insertId) {
            conversation.id = insertId;
            for (var cOb in conversationObservers) {
              conversationObservers[cOb].onAddConversation(conversation);
            }
            //$state.go('main.im-detail', {'cid': messageDetail.cUserId});
            userUtils.gotoIM(messageDetail.cUserId);
          }, function (error) {
            $log.error('add conversation failed:' + error);
          });
        }
        else {
          $log.debug('not find cUserInfo');
          userNetService.getUserInfo(messageDetail.cUserId, function (userInfo) {
            $log.debug("getUserInfo from Server:" + JSON.stringify(userInfo));
            conversation.cUserNickname = userInfo.nickname;
            conversation.cUserLoginName = userInfo.loginName;
            conversation.cUserAvatar = userInfo.avatar;
            conversation.lastMessage = messageDetail.message;
            conversation.lastMessageTime = messageDetail.time;
            conversation.noReadMessages = 1;

            imConversationService.addConversation(conversation).then(function (insertId) {
              conversation.id = insertId;
              for (var cOb in conversationObservers) {
                conversationObservers[cOb].onAddConversation(conversation);
              }
              //$state.go('main.im-detail', {'cid': messageDetail.cUserId});
              userUtils.gotoIM(messageDetail.cUserId);
            }, function (error) {
              $log.error('add Conversation failed:' + error);
            });
          }, function (error) {
            $log.error('getUserInfo failed:userId(#userId#) error(#error#)'
              .replace('#userId#', messageDetail.cUserId).replace('#error#', error));
          })
        }

      }
      else {
        $log.info("conversation:" + JSON.stringify(conversation));
        userUtils.gotoIM(messageDetail.cUserId);
        //$state.go('main.im-detail', {'cid': messageDetail.cUserId});
      }
    }

    var config = {
      onSingleReceiveMessage: onSingleReceiveMessage,
      onOpenMessage: onOpenMessage,
    };

    jimService.updateMessageNotifyCB(config);

    var sendMessage = function (cUser, message) {
      var _innerDefer = $q.defer();
      var cbObj = null;
      $log.info("sendMessage: cUserId(#cUserId#) message(#message#)".replace('#cUserId#', cUser.userId).replace('#message#', message.message));
      jimService.sendTextMessage(message.userId, cUser.loginName + '_' + message.cUserId, message.type, message.message, function (response) {
        _innerDefer.resolve();
      }, function (response) {
        $log.error('sendMessage failed:' + JSON.stringify(response));
        _innerDefer.reject(response);
      });
      return _innerDefer.promise;
    }

    var enterConversation = function (cUser) {
      return jimService.enterConversation(cUser.loginName + '_' + cUser.userId);
    }

    var exitConversation = function (cUser) {
      return jimService.exitConversation(cUser.loginName + '_' + cUser.userId);
    }

    var onOpenNotification = function (event) {
      var alert = event.aps.alert;
      $log.debug('enter onOpenNotification:' + alert);
      console.log('enter onOpenNotification:' + alert);
      if (alert != null) {
        var cUserNickname = alert.split(':')[0];
        console.log('onOpenNotification:' + cUserNickname);
        userNetService.getUserInfoByNickname(cUserNickname).then(function(userInfo) {
          console.log('onOpenNotification get user info by nickname success');
          console.log('get user info by nickname(#nickname#):'.replace('#nickname#',cUserNickname) + JSON.stringify(userInfo));
          $state.go('main.im-detail', {'cid': userInfo.userId});
        },function(error) {
          $log.error('onOpenNotification failed:' + error);
        });
      }
    }

    return {
      registerMsgObserver: registerMsgObserver,
      unregisterMsgObserver: unregisterMsgObserver,
      registerConversationObserver: registerConversationObserver,
      unregisterConversationObserver: unregisterConversationObserver,
      sendMessage: sendMessage,
      enterConversation: enterConversation,
      exitConversation: exitConversation,
      onOpenNotification: onOpenNotification,
    };
  }

  IMInterfaceServiceFn.$inject = ['$log', '$q', 'imConversationService', 'imMessageStorageService'];
  function IMInterfaceServiceFn($log, $q, imConversationService, imMessageStorageService) {
    var _innerDefer = $q.defer();
    var unReadMessageCount = 0;

    var initService = function (currentUserId) {
      imMessageStorageService.initDB(currentUserId)
        .then(
        function () {
          return imConversationService.initService()
        }, function (error) {
          var _errorDefer = $q.defer();
          _errorDefer.reject(error);
          return _errorDefer.promise;
        })
        .then(
        function () {
          $log.info('init im module success');
          refreshUnReadMessageCount();
          _innerDefer.resolve();
        }, function (error) {
          $log.error('init imConversationService failed:' + error);
          _innerDefer.reject();
        });
      return _innerDefer.promise;
    }


    var refreshUnReadMessageCount = function () {
      unReadMessageCount  = imConversationService.unReadMessageCount();
    }


    var test = function () {

      var deferred = $q.defer();
      var promise = deferred.promise;
      var status;
      promise.then(function (result) {
        result = result + "you have passed the first then()";
        status = result;
        return result;
      }, function (error) {
        error = error + "failed but you have passed the first then()";
        status = error;
        return error;
      }).then(function (result) {
        alert("Success: " + result);
      }, function (error) {
        alert("Fail: " + error);
      })

      var flag = false;
      if (flag) {
        deferred.resolve("you are lucky!");
      } else {
        deferred.reject("sorry, it lost!");
      }

      //for test im message storage service
      //imMessageStorageService.initDB(userInfo.userId).then(function () {
      //  imMessageStorageService.getMaxIdForMessage().then(function (maxMesssageid) {
      //    $log.debug('getMaxIdForMessage success:' + JSON.stringify(maxMesssageid));
      //    imMessageStorageService.getMessageList(1, 2,maxMesssageid,10).then(function (res) {
      //      $log.error('getMessageList success,message length:' + res.length);
      //      for (var index = 0; index < res.length; ++index) {
      //        $log.debug("id=#id# userId=#userId# cUserId=#cUserId# message=#message#".replace('#userId#', res[index].userId)
      //          .replace('#cUserId#', res[index].cUserId).replace('#message#', res[index].message).replace('#id#', res[index].id));
      //      }
      //
      //      imMessageStorageService.addConversation(1, 2, 'hello', 'dassdf').then(function (res) {
      //        $log.debug('add conversation success:' + JSON.stringify(res));
      //      })
      //    }, function (error) {
      //      $log.error(JSON.stringify(error));
      //    });
      //  }, function (error) {
      //    $log.error(error);
      //  })
      //    .then(function (res) {
      //
      //    }, function (error) {
      //
      //    });
      //
      //}, function (error) {
      //
      //});
    }

    return {
      initService: initService,
      unReadMessageCount: unReadMessageCount,
    };
  }
})
();


