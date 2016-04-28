/**
 * Created by binfeng on 16/4/22.
 */
;
(function () {
  'use strict';
  angular.module('com.helporz.playground').factory('PlaygroundNetService', PlaygroundNetServiceFn)
    .factory('PlaygroundDBService', PlaygroundDBServiceFactoryFn)
    .factory('favouriteTopicService', favouriteTopicServiceFactoryFn)
    .factory('topicBlacklistService', topicBlacklistServiceFactoryFn)
    .factory('filterTopicService', filterTopicServiceFactoryFn);

  PlaygroundNetServiceFn.$inject = ['$scope', 'httpBaseService'];
  function PlaygroundNetServiceFn($scope, httpBaseService) {
    var _getTopicGroupList = function () {
      return httpBaseService.getForPromise('/playground/topic-group/list', null);
    }

    var _getTopicListByGroup = function (startTopicId, pageIndex, pageSize, groupId) {
      var param = {
        startTopicId: startTopicId,
        pageIndex: pageIndex,
        pageSize: pageSize,
        groupId: groupId
      };
      return httpBaseService.getForPromise('/playground/topic/list/bygroup', param);
    }

    var _getTopicCommentList = function (startCommentId, pageIndex, pageSize, groupId) {
      var param = {
        startTopicId: startTopicId,
        pageIndex: pageIndex,
        pageSize: pageSize,
        groupId: groupId
      };
      return httpBaseService.getForPromise('/playground/topic-comment/list', param);
    };

    var _favouriteTopic = function (topicId) {
      return httpBaseService.postForPromise('/playground/topic/' + topicId + '/favourite', null);
    }

    var _cancelFavouriteTopic = function (topicId) {
      return httpBaseService.postForPromise('/playground/topic/' + topicId + '/favourite/cancel', null);
    }

    var _filterTopic = function (topicId) {
      return httpBaseService.postForPromise('/playground/topic/' + topicId + '/filter', null);
    }

    var _addTopic2Blacklist = function (topicId) {
      var param = {
        topicId: topicId
      };
      return httpBaseService.postForPromise('/playground/topic/blacklist', param);
    }

    var _addTopicComment = function (topicId, content, replyOtherCommentId) {
      var param = {
        content: content,
        replyOtherCommentId: replyOtherCommentId
      };

      return httpBaseService.postForPromise('/playground/topic/' + topicId + '/comment/add', param);
    }

    var _addTopic = function (groupId, content, hasImg, hasAudio) {
      var param = {
        groupId: groupId,
        content: content,
        hasImg: hasImg,
        hasAudio: hasAudio
      };

      return httpBaseService.postForPromise('/playground/topic/add', param);
    };

    return {
      getTopicGroupList: _getTopicGroupList,
      getTopicListByGroup: _getTopicListByGroup,
      getTopicCommentList: _getTopicCommentList,
      favouriteTopic: _favouriteTopic,
      cancelFavouriteTopic: _cancelFavouriteTopic,
      filterTopic: _filterTopic,
      addTopic2BlackList: _addTopic2Blacklist,
      addTopicComment: _addTopicComment,
      addTopic: _addTopic
    };
  };

  PlaygroundDBServiceFactoryFn.$inject = ['$log', 'dbService'];
  function PlaygroundDBServiceFactoryFn($log, dbService) {
    var patterns = {
      filterTopic: {'topicId': '0', userId: '0', 'groupId': '0', 'topicCreate': null},
      favouriteTopic: {'topicId': '0', userId: '0', 'groupId': '0', 'topicCreate': null},
      topicBlacklist: {'topicId': '0', userId: '0', 'groupId': '0', 'topicCreate': null}
    };

    var _createRecord = function (table) {
      var pattern = patterns[table];
      if (pattern == null || pattern == '') {
        $log.error("invalid table name");
        return null;
      }

      return dbService.createRow(table, pattern);
    };

    var _saveRecords = function (table, records) {
      var pattern = patterns[table];
      if (pattern == null || pattern == '') {
        throw "invalid table name";
      }

      return dbService.saveRecords(table, records, pattern);
    };

    var _findRecords = function (table, where) {
      return dbService.findRecords(table, where);
    };

    var _dropRecords = function (table, where) {
      return dbService.dropRecords(table, where);
    };

    return {
      createRecord: _createRecord,
      saveRecords: _saveRecords,
      findRecords: _findRecords,
      dropRecords: _dropRecords,
    };
  }

  filterTopicServiceFactoryFn.$inject = ['$log', '$$HashMap', 'PlaygroundDBService', 'PlaygroundNetService'];
  function filterTopicServiceFactoryFn($log, $$HashMap, PlaygroundDBService, PlaygroundNetService) {
    var _cacheTable = $$HashMap([], true);
    var _buildCacheFromDB = function (currentUserId) {
      PlaygroundDBService.findRecords('filterTopic', 'userId = "' + currentUserId + '"').then(function (records) {
        for (var index = 0; index < records.length; ++index) {
          var record = records[index];
          _cacheTable.put(record.topicId, record);
        }
      }, function (e) {
        $log.error("create topic filter cache from db failed:" + e.message);
      });
    };

    var _buildCacheFromServer = function (currentUserId) {

    };

    var _addFilterTopic = function (currentUserId, topicId, groupId, topicCreated) {
      PlaygroundNetService.filterTopic(topicId).then(function (res) {
        var record = PlaygroundDBService.createRecord('filterTopic');

        record.topicId = topicId;
        record.groupId = groupId;
        record.userId = currentUserId;
        record.topicCreate = topicCreated;
        PlaygroundDBService.saveRecords('filterTopic', record).then(function (res) {
          _cacheTable.put(topicId, record);
        }, function (e) {
          $log.error('向数据库中添加过滤话题失败:' + e.message);
        });
      }, function (e) {
        $log.error('向服务器发生添加过滤话题失败:' + e.message);
      });
    };

    var _isFilterTopic = function (currentUserId, topicId) {
      var filterInfo = _cacheTable.get(topicId);
      if (filterInfo == null || filterInfo == '') {
        return false;
      }
      return true;
    }

    return {
      buildCacheFromDB: _buildCacheFromDB,
      addFilterTopic: _addFilterTopic,
      isFilterTopic: _isFilterTopic,
    };
  };

  favouriteTopicServiceFactoryFn.$inject = ['$log', '$$HashMap', 'PlaygroundDBService', 'PlaygroundNetService'];
  function favouriteTopicServiceFactoryFn($log, $$HashMap, PlaygroundDBService, PlaygroundNetService) {
    var _cacheTable = $$HashMap([], true);
    var _buildCacheFromDB = function (currentUserId) {
      PlaygroundDBService.findRecords('favouriteTopic', 'userId = "' + currentUserId + '"').then(function (records) {
        for (var index = 0; index < records.length; ++index) {
          var record = records[index];
          _cacheTable.put(record.topicId, record);
        }
      }, function (e) {
        $log.error("create favourite topic cache from db failed:" + e.message);
      });
    };

    var _buildCacheFromServer = function (currentUserId) {

    };

    var _addFavouriteTopic = function (currentUserId, topicId, groupId, topicCreated) {
      PlaygroundNetService.filterTopic(topicId).then(function (res) {
        var record = PlaygroundDBService.createRecord('favouriteTopic');

        record.topicId = topicId;
        record.groupId = groupId;
        record.userId = currentUserId;
        record.topicCreate = topicCreated;
        PlaygroundDBService.saveRecords('filterTopic', record).then(function (res) {
          _cacheTable.put(topicId, record);
        }, function (e) {
          $log.error('向数据库中添加点赞话题失败:' + e.message);
        });
      }, function (e) {
        $log.error('向服务器发送添加点赞话题失败:' + e.message);
      });
    };

    var _deleteFavouriteTopic = function (currentUserId, topicId, groupId, topicCreated) {
      PlaygroundNetService.cancelFavouriteTopic(topicId).then(function (res) {
        PlaygroundDBService.dropRecords('filterTopic', 'topicId = "' + topicId + '"').then(
          function (res) {
            _cacheTable.remove(topicId);
          },
          function (e) {
            $log.error('从数据库中删除点赞话题失败:' + e.message);
          }
        )
      }, function (e) {
        $log.error('向服务器发送去掉点赞请求失败:' + e.message);
      })
    }

    var _isFavouriteTopic = function (currentUserId, topicId) {
      var info = _cacheTable.get(topicId);
      if (info == null || info == '') {
        return false;
      }
      return true;
    }

    return {
      buildCacheFromDB: _buildCacheFromDB,
      addFavouriteTopic: _addFavouriteTopic,
      deleteFavouriteTopic: _deleteFavouriteTopic,
      isFavouriteTopic: _isFavouriteTopic,
    };
  }

  topicBlacklistServiceFactoryFn.$inject = ['$log', '$$HashMap', 'PlaygroundDBService', 'PlaygroundNetService'];
  function topicBlacklistServiceFactoryFn($log, $$HashMap, PlaygroundDBService, PlaygroundNetService) {
    var _cacheTable = $$HashMap([], true);
    var _buildCacheFromDB = function (currentUserId) {
      PlaygroundDBService.findRecords('topicBlacklist', 'userId = "' + currentUserId + '"').then(function (records) {
        for (var index = 0; index < records.length; ++index) {
          var record = records[index];
          _cacheTable.put(record.topicId, record);
        }
      }, function (e) {
        $log.error("create topic blacklist cache from db failed:" + e.message);
      });
    };

    var _buildCacheFromServer = function (currentUserId) {

    };

    var _addTopicBlacklist = function (currentUserId, topicId, groupId, topicCreated) {
      PlaygroundNetService.filterTopic(topicId).then(function (res) {
        var record = PlaygroundDBService.createRecord('topicBlacklist');

        record.topicId = topicId;
        record.groupId = groupId;
        record.userId = currentUserId;
        record.topicCreate = topicCreated;
        PlaygroundDBService.saveRecords('topicBlacklist', record).then(function (res) {
          _cacheTable.put(topicId, record);
        }, function (e) {
          $log.error('向数据库中添加话题黑名单失败:' + e.message);
        });
      }, function (e) {
        $log.error('向服务器发生添加话题黑名单失败:' + e.message);
      });
    };

    var _isInTopicBlacklist = function (currentUserId, topicId) {
      var filterInfo = _cacheTable.get(topicId);
      if (filterInfo == null || filterInfo == '') {
        return false;
      }
      return true;
    }

    return {
      buildCacheFromDB: _buildCacheFromDB,
      addTopicBlacklist: _addTopicBlacklist,
      isInTopicBlacklist: _isInTopicBlacklist,
    };
  }
})();

