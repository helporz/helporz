/**
 * Created by binfeng on 16/6/20.
 */

(function () {
  'use strict';

  angular.module('com.helporz.task.noticemessage', ['com.helporz.utils.service', 'com.helporz.task.netservice', 'pusher'])
    .factory('NoticeMessageNetService', NoticeMessageNetServiceFn)
    .factory('NoticeMessageService', NoticeMessageServiceFn)
    .factory('NoticeMessageDB', NoticeMessageDBFn)
    .factory('NoticeMessageServiceTest', NoticeMessageServiceTestFn);


  NoticeMessageServiceFn.$inject = ['$log', '$q', 'NoticeMessageDB', 'NoticeMessageNetService', 'pushService', 'debugHelpService'];

  function NoticeMessageServiceFn($log, $q, NoticeMessageDB, NoticeMessageNetService, pushService, debugHelpService) {
    var _observerList = new Array();
    var _currentUserId = null;
    var NOTICE_TYPE = {
      POSTER_UNCOMPLETED_TASK_MESSAGE_TYPE: 1,
      ACCEPTER_UNCOMPLETED_TASK_MESSAGE_TYPE: 2,
      COMMENT_TASK_MESSAGE_TYPE: 3,
      FRIEND_TASK_MESSAGE_TYPE: 4,
      POSTER_COMPLETED_TASK_MESSAGE_TYPE: 5,
      ACCEPTER_COMPLETED_TASK_MESSAGE_TYPE: 6,
    };

    var onOpenNotification = function (event) {
      console.log(" index onOpenNotification");

      try {
        //var alertContent;
        //if (device.platform == "Android") {
        //  alertContent = event.alert;
        //} else {
        //  alertContent = event.aps.alert;
        //}
        //alert("open Notificaiton:" + alertContent);
        _onReceiveNoticeMessageList(getMessageFromNotificationEvent(event));
      }
      catch (exception) {
        console.log("JPushPlugin:onOpenNotification" + exception);
      }
    }

    var onReceiveNotification = function (event) {
      $log.info(" index onReceiveNotification");
      try {
        //var alertContent;
        //if (device.platform == "Android") {
        //  //alertContent = window.plugins.jPushPlugin.receiveNotification.alert;
        //  alertContent = event.alert;
        //} else {
        //  alertContent = event.aps.alert;
        //}
        //alert("Receive Notificaiton:" + alertContent);
        _onReceiveNoticeMessageList(getMessageFromNotificationEvent(event));
        //$("#notificationResult").html(alertContent);

      }
      catch (exception) {
        console.log(exception)
      }
    }

    var onReceivePushMessage = function (event) {
      try {
        $log.info('on receive push message');
        //var message;
        //if (device.platform == "Android") {
        //  message = event.message;
        //} else {
        //  message = event.content;
        //}
        //console.log(message);
        //alert("Receive Push Message:" + message );
        _onReceiveNoticeMessageList(getMessageFromNotificationEvent(event));
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
        //$("#tagAliasResult").html(result);
      }
      catch (exception) {
        console.log(exception)
      }
    }
    var getMessageFromNotificationEvent = function (event) {
      var message = {};
      if (device.platform == "Android") {

        message.alert = event.alert;
        message.userId = event.extras['cn.jpush.android.EXTRA'].userId;
        message.type = event.extras['cn.jpush.android.EXTRA'].type;
        message.correlationId = event.extras['cn.jpush.android.EXTRA'].correlation_id;
      } else {
        message.alert = event.aps.alert;
        message.userId = event.userId;
        message.type = event.type;
        message.correlationId = event.correlation_id;
      }
      //$log.info(debugHelpService.writeObj(message));
      return message;
    }

    var _initService = function (userId) {
      $log.info('NoticeMessageService init');
      if (_currentUserId != null && _currentUserId === userId) {
        $log.info('NoticeMessageService 已经初始化了');
        return;
      }
      _currentUserId = userId;
      var config = {
        onOpenNotification: onOpenNotification,
        onReceiveNotification: onReceiveNotification,
        onReceivePushMessage: onReceivePushMessage,
        onSetTagsWithAlias: onSetTagsWithAlias
      };

      pushService.setNotificationFn(config);
      pushService.getRegistrationID();
      NoticeMessageDB.initDB(userId);
    }

    var _onReceiveNoticeMessageList = function (noticeMessage) {
      $log.info('enter on receive notice message list');
      var _innerDefer = $q.defer();
      if (noticeMessage.userId == null || _currentUserId == null || noticeMessage.userId !== _currentUserId) {
        //忽略不是当前登录用户的通知消息
        $log.warn("收到非当前登录用户推送消息,当前用户Id#cId#,推送消息用户ID#uId#".replace('#cId#', _currentUserId).replace('#uId#', noticeMessage.userId));
        return;
      }

      $log.info('will call refresh notice message list');
      _refreshNoticeMessageListFromServer().then(function (res) {
        $log.debug('completed refresh notice message from server');
        $log.debug('observer count:' + _observerList.length);
        for (var observerIndex = 0; observerIndex < _observerList.length; ++observerIndex) {
          _observerList[observerIndex].onNotify();
        }
        _innerDefer.resolve(res);
      }, function (error) {
        _innerDefer.reject(error);
      });

      return _innerDefer.promise;
    }


    var _refreshNoticeMessageListFromServer = function () {
      var _innerDefer = $q.defer();
      NoticeMessageDB.getMaxSerialNo().then(function (maxSerialNo) {
        NoticeMessageNetService.getUnreadMessageBySerialNo(maxSerialNo).then(function (noticeMessageList) {

          if (noticeMessageList == null || noticeMessageList.length == 0) {
            _innerDefer.resolve([]);
          }
          else {
            $log.debug('message length ' + noticeMessageList.length);
            var newMaxSerialNo = noticeMessageList[0].serialNo;
            if (newMaxSerialNo > maxSerialNo) {
              NoticeMessageDB.addNoticeMessages(newMaxSerialNo, noticeMessageList).then(function (res) {
                _innerDefer.resolve(res);
              }, function (error) {
                _innerDefer.reject(error);
              })
            }
            else {
              _innerDefer.resolve(noticeMessageList);
            }
          }

        }, function (error) {
          _innerDefer.reject(error);
        });
      }, function (error) {
        _innerDefer.reject(error);
      });

      return _innerDefer.promise;
    }

    var _registerObserver = function (observer) {
      $log.debug('register observer');
      _observerList.push(observer);
    }

    var _getNoticeMessage = function (type) {
      var _innerDefer = $q.defer();
      _refreshNoticeMessageListFromServer().then(function () {
        NoticeMessageDB.getUnReadMessageByType(type).then(function (res) {
            _innerDefer.resolve(res);
          },
          function (error) {
            _innerDefer.reject(error);
          })
      });
      return _innerDefer.promise;
    }

    var getAllNoticeMessage = function () {
      var _innerDefer = $q.defer();
      _refreshNoticeMessageListFromServer().then(function () {
        NoticeMessageDB.getAllUnreadMessage().then(function (res) {
            _innerDefer.resolve(res);
          },
          function (error) {
            _innerDefer.reject(error);
          })
      });
      return _innerDefer.promise;
    }

    var getAllNoticeMessageEx = function () {
      var _innerDefer = $q.defer();
      _refreshNoticeMessageListFromServer().then(function () {
        NoticeMessageDB.getAllUnreadMessageEx(' correlationId desc ').then(function (res) {
            var uncompleted_post_task_message_list = new Array();
            var completed_post_task_message_list = new Array();
            var uncompleted_accept_task_message_list = new Array();
            var completed_accept_task_message_list = new Array();
            var comment_task_message_list = new Array();
            var friend_task_message_list = new Array();

            //POSTER_UNCOMPLETED_TASK_MESSAGE_TYPE: 1,
            //  ACCEPTER_UNCOMPLETED_TASK_MESSAGE_TYPE
            //:
            //2,
            //  COMMENT_TASK_MESSAGE_TYPE
            //:
            //3,
            //  FRIEND_TASK_MESSAGE_TYPE
            //:
            //4,
            //  POSTER_COMPLETED_TASK_MESSAGE_TYPE
            //:
            //5,
            //  ACCEPTER_COMPLETED_TASK_MESSAGE_TYPE
            //:
            //6,
            var currentCorrelationId = null;
            var correlationCompletedPostMessage = null;
            var correlationUncompletedPostMessage = null;
            var correlationCompletedAcceptMessage = null;
            var correlationUncompletedAcceptMessage = null;
            $log.info('raw notice message length:' + res.length);

            for (var index = 0; index < res.length; ++index) {
              if (res[index].type == NOTICE_TYPE.COMMENT_TASK_MESSAGE_TYPE) {
                comment_task_message_list.push(res[index]);
                continue;
              }

              if (res[index].type == NOTICE_TYPE.FRIEND_TASK_MESSAGE_TYPE) {
                friend_task_message_list.push(res[index]);
              }

              if (currentCorrelationId == null) {
                currentCorrelationId = res[index].correlationId;
              }

              if (currentCorrelationId === res[index].correlationId) {
                switch (res[index].type) {
                  case NOTICE_TYPE.POSTER_UNCOMPLETED_TASK_MESSAGE_TYPE:
                    if (correlationCompletedPostMessage == null) {
                      correlationUncompletedPostMessage = res[index];
                    }
                    break;
                  case NOTICE_TYPE.POSTER_COMPLETED_TASK_MESSAGE_TYPE:
                    correlationCompletedPostMessage = res[index];
                    correlationUncompletedPostMessage = null;
                    break;
                  case NOTICE_TYPE.ACCEPTER_UNCOMPLETED_TASK_MESSAGE_TYPE:
                    if (correlationCompletedAcceptMessage == null) {
                      correlationUncompletedAcceptMessage = res[index];
                    }
                    break;
                  case NOTICE_TYPE.ACCEPTER_COMPLETED_TASK_MESSAGE_TYPE:
                    correlationCompletedAcceptMessage = res[index];
                    correlationUncompletedAcceptMessage = null;
                    break;

                }

              }
              else {
                if (correlationCompletedPostMessage != null) {
                  completed_post_task_message_list.push(correlationCompletedPostMessage);
                }

                if (correlationUncompletedPostMessage != null) {
                  uncompleted_post_task_message_list.push(correlationUncompletedPostMessage);
                }

                if (correlationCompletedAcceptMessage != null) {
                  completed_accept_task_message_list.push(correlationCompletedAcceptMessage);
                }

                if (correlationUncompletedAcceptMessage != null) {
                  uncompleted_accept_task_message_list.push(correlationUncompletedAcceptMessage);
                }

                currentCorrelationId = res[index].correlationId;
                correlationCompletedPostMessage = null;
                correlationUncompletedPostMessage = null;
                correlationCompletedAcceptMessage = null;
                correlationUncompletedAcceptMessage = null;
                --index; //下次循环再处理

              }
            }

            //处理最后一的correlationId的消息
            if (correlationCompletedPostMessage != null) {
              completed_post_task_message_list.push(correlationCompletedPostMessage);
            }

            if (correlationUncompletedPostMessage != null) {
              uncompleted_post_task_message_list.push(correlationUncompletedPostMessage);
            }

            if (correlationCompletedAcceptMessage != null) {
              completed_accept_task_message_list.push(correlationCompletedAcceptMessage);
            }

            if (correlationUncompletedAcceptMessage != null) {
              uncompleted_accept_task_message_list.push(correlationUncompletedAcceptMessage);
            }
            var noticeMessageData = {
              uncompleted_post_task_message_list: uncompleted_post_task_message_list,
              completed_post_task_message_list: completed_post_task_message_list,
              uncompleted_accept_task_message_list: uncompleted_accept_task_message_list,
              completed_accept_task_message_list: completed_accept_task_message_list,
              comment_task_message_list: comment_task_message_list,
              friend_task_message_list: friend_task_message_list,
            }
            _innerDefer.resolve(noticeMessageData);
          },
          function (error) {
            _innerDefer.reject(error);
          })
      });
      return _innerDefer.promise;
    }

    var _setReadFlagByCorrelationId = function (type, correlationId) {
      return NoticeMessageDB.setReadFlagByCorrelationId(type, correlationId);
    }

    var _setReadFlagForLessAndEqualSerialNo = function (type, serialNo) {
      return NoticeMessageDB.setReadFlagForLessAndEqualSerialNo(type, serialNo);
    }

    var setReadFlagByType = function (type) {
      return NoticeMessageDB.setReadFlagByType(type);
    }

    var setReadFlagBySerialNo = function (serialNo) {
      return NoticeMessageDB.setReadFlagBySerialNo(serialNo);
    }

    return {
      initService: _initService,
      onReceiveNoticeMessageList: _onReceiveNoticeMessageList,
      refreshNoticeMessageListFromServer: _refreshNoticeMessageListFromServer,
      registerObserver: _registerObserver,
      getNoticeMessage: _getNoticeMessage,
      getAllNoticeMessage: getAllNoticeMessage,
      getAllNoticeMessageEx: getAllNoticeMessageEx,
      setReadFlagByCorrelationId: _setReadFlagByCorrelationId,
      setReadFlagForLessAndEqualSerialNo: _setReadFlagForLessAndEqualSerialNo,
      setReadFlagByType: setReadFlagByType,
      setReadFlagBySerialNo: setReadFlagBySerialNo,
    };


  }

  NoticeMessageDBFn.$inject = ['$log', '$q', 'dbService', 'debugHelpService'];
  function NoticeMessageDBFn($log, $q, dbService, debugHelpService) {
    var patterns = {
      noticeMessage: {'userId': '0', 'serialNo': '0', 'type': 0, 'correlationId': '0', 'message': null, 'ext': null},
      userMaxNoticeSerialNo: {'userId': '0', 'serialNo': '0'},
    };

    var recordSetItem2Record = function (table, recordSetItem) {
      var pattern = patterns[table];
      if (pattern == null || pattern == '') {
        $log.error("invalid table name");
        return null;
      }

      return dbService.createRow(table, recordSetItem, pattern);
    }
    var _createRecord = function (table) {
      var pattern = patterns[table];
      if (pattern == null || pattern == '') {
        $log.error("invalid table name");
        return null;
      }

      return dbService.createRow(table, null, pattern);
    };

    var _currentUserId = null;
    var _initDB = function (userId) {
      $log.info('NoticeMessageDB init -> userId:' + userId);
      if (userId != null) {
        _currentUserId = userId;
      }

      var tableSqlList = ['CREATE TABLE IF NOT EXISTS noticeMessage(userId text,serialNo text,type INTEGER,correlationId text,message text,ext text)',
        'CREATE TABLE IF NOT EXISTS userMaxNoticeSerialNo(userId text, serialNo text)'];
      dbService.executeSqlList(tableSqlList).then(function () {
        $log.info('create notice message tables success');
      }, function (error) {
        $log.error('create notice message tables error: ' + error.message);
      });
    }

    var _getMaxSerialNo = function () {
      var _innerDefer = $q.defer();
      dbService.findRecords('userMaxNoticeSerialNo', 'userId = "' + _currentUserId + '"').then(function (res) {
        $log.info('userMaxNoticeSerialNo success');
        //debugHelpService.writeObj(res);
        if (typeof res == 'undefined' || res === null) {
          _innerDefer.resolve("0");
          return;
        }
        if( res.rows.length == 0) {
          _innerDefer.resolve("0");
          return ;
        }
        var record = recordSetItem2Record('userMaxNoticeSerialNo', res.rows.item(res.rows.length - 1));
        $log.info('getMaxSerialNo: userMaxNoticeSerialNo record count:' + res.rows.length);
        $log.info('userMaxNoticeSerialNo:' + record.serialNo);
        _innerDefer.resolve(record.serialNo);
      }, function (error) {
        $log.error("getMaxSerialNo failed:" + error.message);
        _innerDefer.reject();
      });
      return _innerDefer.promise;
    }

    var _setMaxSerialNo = function (serialNo) {
      var _innerDefer = $q.defer();
      var record = _createRecord('userMaxNoticeSerialNo');
      record.userId = _currentUserId;
      record.serialNo = serialNo;
      dbService.saveRecords('userMaxNoticeSerialNo', new Array().push(record)).then(
        function (res) {
          _innerDefer.resolve();
        },
        function (error) {
          $log.error("setMaxSerialNo failed:" + error.message);
          _innerDefer.reject();
        });
      return _innerDefer.promise;
    }

    var _addNoticeMessages = function (maxSerialNo, noticeMessageList) {
      $log.debug('addNoticeMessage maxSerialNo:' + maxSerialNo);
      var _innerDefer = $q.defer();

      for (var index = 0; index < noticeMessageList.length; ++index) {
        noticeMessageList[index].userId = _currentUserId;
      }

      var saveNoticeMessageListSql = dbService.getSaveRecordSql('noticeMessage', noticeMessageList, patterns['noticeMessage']);

      var userMaxNoticeSerialNoRecord = _createRecord('userMaxNoticeSerialNo');
      userMaxNoticeSerialNoRecord.userId = _currentUserId;
      userMaxNoticeSerialNoRecord.serialNo = maxSerialNo;
      var maxSerialUpdateSql = dbService.getSaveRecordSql('userMaxNoticeSerialNo',
        userMaxNoticeSerialNoRecord,
        patterns['userMaxNoticeSerialNo']);

      var sqlArray = new Array();
      sqlArray.push(maxSerialUpdateSql);
      sqlArray.push(saveNoticeMessageListSql);
      $log.debug('maxSerialUpdateSql:' + maxSerialUpdateSql);
      $log.debug('saveNoticeMessageListSql:' + saveNoticeMessageListSql);

      dbService.executeSqlList(sqlArray).then(function () {
        _innerDefer.resolve();
      }, function () {
        _innerDefer.reject();
      });
      //dbService.sqlBatch(sqlArray).then(function () {
      //  _innerDefer.resolve();
      //}, function () {
      //  _innerDefer.reject();
      //});
      return _innerDefer.promise;
    }

    var _setReadFlagForLessAndEqualSerialNo = function (type, serialNo) {
      var _innerDefer = $q.defer();
      dbService.dropRecords('noticeMessage', 'userId ="' +
        _currentUserId + '" and type = "' + type + '" and serialNo <= "' + serialNo + '"').then(function (res) {
        _innerDefer.resolve();
      }, function (error) {
        _innerDefer.reject();
      });
      return _innerDefer.promise;
    }

    var _setReadFlagByCorrelationId = function (type, correlationId) {
      var _innerDefer = $q.defer();
      dbService.dropRecords('noticeMessage', 'userId ="' +
        _currentUserId + '" and type = "' + type + '" and correlationId = "' + correlationId + '"').then(function (res) {
        _innerDefer.resolve();
      }, function (error) {
        _innerDefer.reject();
      });
      return _innerDefer.promise;
    }

    var setReadFlagByType = function (type, correlationId) {
      var _innerDefer = $q.defer();
      dbService.dropRecords('noticeMessage', 'userId ="' +
        _currentUserId + '" and type = "' + type + '"').then(function (res) {
        _innerDefer.resolve();
      }, function (error) {
        _innerDefer.reject();
      });
      return _innerDefer.promise;
    }

    var setReadFlagBySerialNo = function (serialNo) {
      var _innerDefer = $q.defer();
      dbService.dropRecords('noticeMessage', 'userId ="' +
        _currentUserId + '" and serialNo = "' + serialNo + '"').then(function (res) {
        _innerDefer.resolve();
      }, function (error) {
        _innerDefer.reject();
      });
      return _innerDefer.promise;
    }


    var _getUnReadMessageByType = function (type) {
      var _innerDefer = $q.defer();
      dbService.findRecordsEx('noticeMessage',
        "userId='#uId#' and type=#tId#".replace('#uId#', _currentUserId).replace('#tId#', type),
        patterns['noticeMessage']).then(function (res) {
          _innerDefer.resolve(res);
        }, function (error) {
          _innerDefer.reject(error);
        });
      return _innerDefer.promise;
    }

    var _getAllUnreadMessage = function () {
      var _innerDefer = $q.defer();
      dbService.findRecordsEx('noticeMessage',
        "userId='#uId#'".replace('#uId#', _currentUserId),
        patterns['noticeMessage']).then(function (res) {
          _innerDefer.resolve(res);
        }, function (error) {
          _innerDefer.reject(error);
        })
      return _innerDefer.promise;
    }

    var getAllUnreadMessageEx = function (orderBy) {
      var _innerDefer = $q.defer();
      var where = "userId='#uId#'".replace('#uId#', _currentUserId) + " order by " + orderBy;
      dbService.findRecordsEx('noticeMessage',
        where,
        patterns['noticeMessage']).then(function (res) {
          _innerDefer.resolve(res);
        }, function (error) {
          _innerDefer.reject(error);
        })

      return _innerDefer.promise;
    }

    return {
      initDB: _initDB,
      createRecord: _createRecord,
      getMaxSerialNo: _getMaxSerialNo,
      setMaxSerialNo: _setMaxSerialNo,
      addNoticeMessages: _addNoticeMessages,
      setReadFlagByCorrelationId: _setReadFlagByCorrelationId,
      setReadFlagForLessAndEqualSerialNo: _setReadFlagForLessAndEqualSerialNo,
      setReadFlagByType: setReadFlagByType,
      setReadFlagBySerialNo: setReadFlagBySerialNo,
      getUnReadMessageByType: _getUnReadMessageByType,
      getAllUnreadMessage: _getAllUnreadMessage,
      getAllUnreadMessageEx: getAllUnreadMessageEx,
    };
  }

  NoticeMessageNetServiceFn.$inject = ['$log', '$q', 'httpBaseService'];
  function NoticeMessageNetServiceFn($log, $q, httpBaseService) {
    var _getUnreadMessageBySerialNo = function (serialNo) {
      $log.debug('getUnreadMessageBySerialNo:' + serialNo);
      var _innerDefer = $q.defer();
      var param = {
        serialNo: serialNo,
      };
      httpBaseService.getForPromise('/message/by_serial_no', param).then(function (res) {
        _innerDefer.resolve(res);
      }, function (error) {
        _innerDefer.reject(error);
      });
      return _innerDefer.promise;
    }

    return {
      getUnreadMessageBySerialNo: _getUnreadMessageBySerialNo,
    }
  }

  NoticeMessageServiceTestFn.$inject = ['$log', 'NoticeMessageService'];
  function NoticeMessageServiceTestFn($log, NoticeMessageService) {
    $log.error('NoticeMessageServiceTest');
    var unreadMessageList = null;
    var taskNoticeMessageMonitor = {
      onNotify: function () {
        NoticeMessageService.getAllNoticeMessageEx().then(function (noticeMessageData) {
          if(noticeMessageData.uncompleted_post_task_message_list!= null ) {
            unreadMessageList = noticeMessageData.uncompleted_post_task_message_list;
            for (var msgIndex = 0; msgIndex < unreadMessageList.length; ++msgIndex) {
              $log.info('noticemsg[#index#] type[#type#] serialNo[#serialNo#] correlationId[#correlationId#] message[#message#]'
                .replace('#index#', msgIndex).replace('#type#',unreadMessageList[msgIndex].type)
                .replace('#serialNo#', unreadMessageList[msgIndex].serialNo).replace("correlationId",unreadMessageList[msgIndex].correlationId).
                replace("message",unreadMessageList[msgIndex].message)
              );
            }
          }

          if(noticeMessageData.completed_post_task_message_list != null ) {
            unreadMessageList = noticeMessageData.completed_post_task_message_list ;
            for (var msgIndex = 0; msgIndex < unreadMessageList.length; ++msgIndex) {
              $log.info('noticemsg[#index#] type[#type#] serialNo[#serialNo#] correlationId[#correlationId#] message[#message#]'
                  .replace('#index#', msgIndex).replace('#type#',unreadMessageList[msgIndex].type)
                  .replace('#serialNo#', unreadMessageList[msgIndex].serialNo).replace("correlationId",unreadMessageList[msgIndex].correlationId).
                  replace("message",unreadMessageList[msgIndex].message)
              );
            }
          }

          if( noticeMessageData.uncompleted_accept_task_message_list != null ) {
            unreadMessageList = noticeMessageData.uncompleted_accept_task_message_list;
            for (var msgIndex = 0; msgIndex < unreadMessageList.length; ++msgIndex) {
              $log.info('noticemsg[#index#] type[#type#] serialNo[#serialNo#] correlationId[#correlationId#] message[#message#]'
                  .replace('#index#', msgIndex).replace('#type#',unreadMessageList[msgIndex].type)
                  .replace('#serialNo#', unreadMessageList[msgIndex].serialNo).replace("correlationId",unreadMessageList[msgIndex].correlationId).
                  replace("message",unreadMessageList[msgIndex].message)
              );
            }
          }

          if( noticeMessageData.completed_accept_task_message_list != null ) {
            unreadMessageList = noticeMessageData.completed_accept_task_message_list;
            for (var msgIndex = 0; msgIndex < unreadMessageList.length; ++msgIndex) {
              $log.info('noticemsg[#index#] type[#type#] serialNo[#serialNo#] correlationId[#correlationId#] message[#message#]'
                  .replace('#index#', msgIndex).replace('#type#',unreadMessageList[msgIndex].type)
                  .replace('#serialNo#', unreadMessageList[msgIndex].serialNo).replace("correlationId",unreadMessageList[msgIndex].correlationId).
                  replace("message",unreadMessageList[msgIndex].message)
              );
            }
          }

          if( noticeMessageData.comment_task_message_list != null ) {
            unreadMessageList = noticeMessageData.comment_task_message_list;
            for (var msgIndex = 0; msgIndex < unreadMessageList.length; ++msgIndex) {
              $log.info('noticemsg[#index#] type[#type#] serialNo[#serialNo#] correlationId[#correlationId#] message[#message#]'
                  .replace('#index#', msgIndex).replace('#type#',unreadMessageList[msgIndex].type)
                  .replace('#serialNo#', unreadMessageList[msgIndex].serialNo).replace("correlationId",unreadMessageList[msgIndex].correlationId).
                  replace("message",unreadMessageList[msgIndex].message)
              );
            }
          }

          if( noticeMessageData.friend_task_message_list != null ) {
            unreadMessageList = noticeMessageData.friend_task_message_list;
            for (var msgIndex = 0; msgIndex < unreadMessageList.length; ++msgIndex) {
              $log.info('noticemsg[#index#] type[#type#] serialNo[#serialNo#] correlationId[#correlationId#] message[#message#]'
                  .replace('#index#', msgIndex).replace('#type#',unreadMessageList[msgIndex].type)
                  .replace('#serialNo#', unreadMessageList[msgIndex].serialNo).replace("correlationId",unreadMessageList[msgIndex].correlationId).
                  replace("message",unreadMessageList[msgIndex].message)
              );
            }
          }

          //NoticeMessageService.setReadFlagByType(1);

          //if (noticeMessageList != null && noticeMessageList.length > 0) {
          //  unreadMessageList = noticeMessageList;
          //  for (var msgIndex = 0; msgIndex < unreadMessageList.length; ++msgIndex) {
          //    $log.info('noticemsg[#index#] serialNo[#serialNo#]'
          //      .replace('#index#', msgIndex)
          //      .replace('#serialNo#', unreadMessageList[msgIndex].serialNo));
          //  }
          //
          //  NoticeMessageService.setReadFlagForLessAndEqualSerialNo(1, noticeMessageList[0].serialNo);
          //}
        }, function (error) {
          $log.error(error);
        });
      }
    }
    NoticeMessageService.registerObserver(taskNoticeMessageMonitor);
    return taskNoticeMessageMonitor;
  }

})();

