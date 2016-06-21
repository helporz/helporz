/**
 * Created by binfeng on 16/6/20.
 */

(function () {
  'use strict';

  angular.module('com.helporz.task.noticemessage', ['com.helporz.utils.service', 'com.helporz.task.netservice',])
    .factory('NoticeMessageNetService', NoticeMessageNetServiceFn)
    .factory('NoticeMessageService', NoticeMessageServiceFn)
    .factory('NoticeMessageDB', NoticeMessageDBFn);


  NoticeMessageServiceFn.$inject = ['$log','$q', 'NoticeMessageDB', 'NoticeMessageNetService'];

  function NoticeMessageServiceFn($log,$q, NoticeMessageDB, NoticeMessageNetService) {
    var _observerList = new Array();
    var _currentUserId = null;
    var _initService = function (userId) {
      $log.info('NoticeMessageService init');
      _currentUserId = userId;
      NoticeMessageDB.initDB(userId);
    }

    var _onReceiveNoticeMessageList = function (userId, msgType, correlationId, msg) {
      var _innerDefer = $q.defer();
      if ( userId == null || _currentUserId == null || userId !== _currentUserId) {
        //忽略不是当前登录用户的通知消息
        return;
      }

      _refreshNoticeMessageListFromServer().then(function (res) {
        for (var observerIndex = 0; observerIndex < _observerList.length; ++observerIndex) {
          _observerList[observerIndex].onNotification();
        }
        _innerDefer.resolve(res);
      }, function (error) {
        _innerDefer.reject(error);
      });

      return _innerDefer.promise;
    }


    var _refreshNoticeMessageListFromServer = function () {
      var _innerDefer = $q.defer();
      NoticeMessageNetService.getAllUnreadMessage().then(function (noticeMessageList) {
        if (noticeMessageList == null && noticeMessageList.length) {
          _innerDefer.resolve();
        }

        var maxSerialNo = noticeMessageList[0].serialNo;
        NoticeMessageDB.addNoticeMessages(maxSerialNo, noticeMessageList).then(function (res) {
          _innerDefer.resolve(res);
        }, function (error) {
          _innerDefer.reject(error);
        })
      }, function (error) {
        _innerDefer.reject(error);
      });
      return _innerDefer.promise;
    }

    var _registerObserver = function (observer) {
      _observerList.push(observer);
    }

    var _getNoticeMessage = function (type) {
      var _innerDefer = $q.defer();
        _refreshNoticeMessageListFromServer().then(function() {
          NoticeMessageDB.getUnReadMessageByType(type).then(function(res) {
            _innerDefer.resolve(res);
          },
          function(error) {
            _innerDefer.reject(error);
          })
        });
      return _innerDefer.promise;
    }

    var _setReadFlagByCorrelationId = function (type, correlationId) {
      return NoticeMessageDB.setReadFlagByCorrelationId(type,correlationId);
    }

    var _setReadFlagForLessAndEqualSerialNo = function (type,serialNo) {
      return NoticeMessageDB.setReadFlagForLessAndEqualSerialNo(type,serialNo);
    }

    return {
      initService:_initService,
      onReceiveNoticeMessageList:_onReceiveNoticeMessageList,
      refreshNoticeMessageListFromServer:_refreshNoticeMessageListFromServer,
      registerObserver:_registerObserver,
      getNoticeMessage:_getNoticeMessage,
      setReadFlagByCorrelationId:_setReadFlagByCorrelationId,
      setReadFlagForLessAndEqualSerialNo:_setReadFlagForLessAndEqualSerialNo,
    };
  }

  NoticeMessageDBFn.$inject = ['$log', '$q', 'dbService'];
  function NoticeMessageDBFn($log, $q, dbService) {
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
      $log.info('NoticeMessageDB init');
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
        if (typeof res == 'undefined' || res === null) {
          _innerDefer.resolve("0");
          return;
        }

        var record = recordSetItem2Record('userMaxNoticeSerialNo', res.rows.item(0));
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
      var _innerDefer = $q.defer();

      for (var index = 0; index < noticeMessageList.length; ++index) {
        noticeMessageList[index].userId = _currentUserId;
      }

      var saveNoticeMessageListSql = dbService.getSaveRecordSql('noticeMessage', noticeMessageList, patterns['noticeMessage']);

      var userMaxNoticeSerialNoRecord = _createRecord('userMaxNoticeSerialNo');
      userMaxNoticeSerialNoRecord.userId = _currentUserId;
      userMaxNoticeSerialNoRecord.serialNo = serialNo;
      var maxSerialUpdateSql = dbService.getSaveRecordSql('userMaxNoticeSerialNo',
        new Array().push(userMaxNoticeSerialNoRecord),
        patterns['userMaxNoticeSerialNo']);

      var sqlArray = new Array();
      sqlArray.push(maxSerialUpdateSql);
      sqlArray.push(saveNoticeMessageListSql);
      dbService.sqlBatch(sqlArray).then(function () {
        _innerDefer.resolve();
      }, function () {
        _innerDefer.reject();
      });
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

    var _setReadFlagByCorrelationId = function (type,correlationId) {
      var _innerDefer = $q.defer();
      dbService.dropRecords('noticeMessage', 'userId ="' +
        _currentUserId + '" and type = "' + type + '" and correlationId = "' + correlationId + '"').then(function (res) {
        _innerDefer.resolve();
      }, function (error) {
        _innerDefer.reject();
      });
      return _innerDefer.promise;
    }

    var _getUnReadMessageByType = function (type) {
      var _innerDefer = $q.defer();
      dbService.findRecordsEx('noticeMessage',
        "userId='#uId#' and type=#tId#".repeat('#uId#', _currentUserId).repeat('#tId#', type),
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
        "userId='#uId#'".repeat('#uId#', _currentUserId),
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
      getUnReadMessageByType: _getUnReadMessageByType,
      getAllUnreadMessage: _getAllUnreadMessage,
    };
  }

  NoticeMessageNetServiceFn.$inject = ['$q', 'httpBaseService'];
  function NoticeMessageNetServiceFn($q, httpBaseService) {
    var _getUnreadMessageBySerialNo = function (serialNo) {
      var _innerDefer = $q.defer();
      var param = {
        serialNo: serialNo,
      };
      httpBaseService.getForPromise('/message/by_serial_no', serialNo).then(function (res) {
        _innerDefer.resolve(res.data);
      }, function (error) {
        _innerDefer.reject(error);
      });
      return _innerDefer.promise;
    }

    return {
      getUnreadMessageBySerialNo:_getUnreadMessageBySerialNo,
    }
  }

})();

