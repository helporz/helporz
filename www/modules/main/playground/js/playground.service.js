/**
 * Created by binfeng on 16/4/22.
 */
;
(function () {
  'use strict';
  angular.module('com.helporz.playground').factory('PlaygroundNetService', PlaygroundNetServiceFn)
    .factory('PlaygroundDBService', PlaygroundDBServiceFactoryFn)
    .factory('favouriteTopicService', favouriteTopicServiceFactoryFn)
    .factory('collectionTopicService', collectionTopicServiceFactoryFn)
    .factory('topicBlacklistService', topicBlacklistServiceFactoryFn)
    .factory('topicService', topicServiceFactoryFn)
    .factory('topicGroupService', topicGroupServiceFactoryFn)
    .factory('topicModalService', topicModalServiceFactoryFn)
    .factory('filterTopicService', filterTopicServiceFactoryFn)
    .factory('PlaygroundStartupService', PlaygroundStartupServiceFn);

  topicModalServiceFactoryFn.$inject = [];

  function topicModalServiceFactoryFn() {
    var _publishModal;
    var _setPublishModal = function (modal) {
      _publishModal = modal;
    }

    var _getPublishModal = function () {
      return _publishModal;
    }

    return {
      setPublishModal: _setPublishModal,
      getPublishModal: _getPublishModal
    };
  }

  PlaygroundNetServiceFn.$inject = ['httpBaseService'];
  function PlaygroundNetServiceFn(httpBaseService) {
    var _getTopicGroupList = function () {
      return httpBaseService.getForPromise('/playground/topic-group/list', null);
    }

    var _getTopicListByGroup = function (startTopicId, pageNum, pageSize, groupId) {
      var param = {
        startTopicId: startTopicId,
        pageNum: pageNum,
        pageSize: pageSize,
        groupId: groupId
      };
      return httpBaseService.getForPromise('/playground/topic/list/bygroup', param);
    }

    var _getOwnTopicListByUser = function (startTopicId, pageNum, pageSize) {
      var param = {
        startTopicId: startTopicId,
        pageNum: pageNum,
        pageSize: pageSize
      };
      return httpBaseService.getForPromise('/playground/topic/list/byuser', param);
    }

    var _getCollectionTopicListByUser = function (pageNum, pageSize) {
      var param = {
        pageNum: pageNum,
        pageSize: pageSize
      };
      return httpBaseService.getForPromise('/playground/topic/collection/list', param);
    }

    var _getTopicDetailInfo = function (topicId, startCommentId, pageNum, pageSize) {
      var param = {
        topicId: topicId,
        startCommentId: startCommentId,
        pageNum: pageNum,
        pageSize: pageSize
      };

      return httpBaseService.getForPromise('/playground/topic/' + topicId + '/detail', param);
    }

    var _getSysTopicListByGroup = function (startTopicId, pageNum, pageSize, groupId) {
      var param = {
        startTopicId: startTopicId,
        pageNum: pageNum,
        pageSize: pageSize,
        groupId: groupId
      };
      return httpBaseService.getForPromise('/playground/systopic/list/bygroup', param);
    }

    var _getTopicCommentList = function (topicId, startCommentId, pageNum, pageSize) {
      var param = {
        topicId: topicId,
        startCommentId: startCommentId,
        pageNum: pageNum,
        pageSize: pageSize
      };
      return httpBaseService.getForPromise('/playground/topic-comment/list', param);
    };

    var _getTopicCommentListBySessionId = function (commentSessionId, pageNum, pageSize) {
      var param = {
        pageNum: pageNum,
        pageSize: pageSize
      };
      return httpBaseService.getForPromise('/playground/topic-comment/' + commentSessionId + '/list', param);
    }

    var _getTopicCommentListByUser = function (pageNum, pageSize) {
      var param = {
        pageNum: pageNum,
        pageSize: pageSize
      };
      return httpBaseService.getForPromise('/playground/topic-comment/list/byuser', param);
    }

    var _getReplyMessageListByUserId = function (pageNum, pageSize) {
      var param = {
        pageNum: pageNum,
        pageSize: pageSize
      };
      return httpBaseService.getForPromise('/playground/reply-message/list', param);
    }

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

    var _addComment2Blacklist = function (topicGroupId, topicId, commentId) {
      var param = {
        topicGroupId: topicGroupId,
        topicId: topicId,
        commentId: commentId,
      };
      return httpBaseService.postForPromise('/playground/comment/blacklist', param);
    }

    var _addTopicComment = function (topicId, content, commentSessionId, replyOtherCommentId, replyUserId) {
      var param = {
        content: content,
        commentSessionId: commentSessionId,
        replyOtherCommentId: replyOtherCommentId,
        replyUserId: replyUserId
      };

      return httpBaseService.postForPromise('/playground/topic/' + topicId + '/comment/add', param);
    }

    var _addTopic = function (groupId, content, imgCount, audioCount, tagInfoArray) {
      var tagJsonList = (tagInfoArray != null && tagInfoArray.length != 0) ? JSON.stringify(tagInfoArray) : null;
      var param = {
        groupId: groupId,
        content: content,
        imgCount: imgCount,
        audioCount: audioCount,
        tagList: tagJsonList,
      };

      return httpBaseService.postForPromise('/playground/topic/add', param);
    };

    var _addCollectionTopic = function (topicId) {
      var param = {
        topicId: topicId
      };

      return httpBaseService.postForPromise('/playground/topic/collection', param);
    }

    var _cancelCollectionTopic = function (topicId) {
      var param = {
        topicId: topicId
      };

      return httpBaseService.postForPromise('/playground/topic/collection/cancel', param);
    }

    //var _addShareCount = function (topicId) {
    //  return httpBaseService.postForPromise('/playground/topic/' + topicId + '/addShareCount', null);
    //}

    var _getTopicTagList = function () {
      return httpBaseService.getForPromise('/playground/topic/tags', null);
    }

    var getAdList = function () {
      return httpBaseService.getForPromise('/playground/adList', null);
    }

    return {
      getTopicGroupList: _getTopicGroupList,
      getTopicListByGroup: _getTopicListByGroup,
      getOwnTopicListByUser: _getOwnTopicListByUser,
      getCollectionTopicListByUser: _getCollectionTopicListByUser,
      getSysTopicListByGroup: _getSysTopicListByGroup,
      getTopicDetailInfo: _getTopicDetailInfo,
      getTopicCommentList: _getTopicCommentList,
      getTopicCommentListBySessionId: _getTopicCommentListBySessionId,
      getTopicCommentListByUser: _getTopicCommentListByUser,
      getReplyMessageListByUserId: _getReplyMessageListByUserId,
      favouriteTopic: _favouriteTopic,
      cancelFavouriteTopic: _cancelFavouriteTopic,
      filterTopic: _filterTopic,
      addTopic2Blacklist: _addTopic2Blacklist,
      addComment2Blacklist: _addComment2Blacklist,
      addTopicComment: _addTopicComment,
      addTopic: _addTopic,
      addCollectionTopic: _addCollectionTopic,
      cancelCollectionTopic: _cancelCollectionTopic,
      //addShareCount: _addShareCount,
      getTopicTagList: _getTopicTagList,
      getAdList: getAdList,
    };
  };

  PlaygroundDBServiceFactoryFn.$inject = ['$log', '$q', 'dbService'];
  function PlaygroundDBServiceFactoryFn($log, $q, dbService) {
    var patterns = {
      filterTopic: {'topicId': '0', userId: '0', 'groupId': '0', 'topicCreate': null},
      favouriteTopic: {'topicId': '0', userId: '0', 'groupId': '0', 'topicCreate': null},
      topicBlacklist: {'topicId': '0', userId: '0', 'groupId': '0', 'topicCreate': null},
      collectionTopic: {'topicId': '0', userId: '0', 'groupId': '0', 'topicCreate': null}
    };

    var _init = function () {
      var tableSqlList = ['CREATE TABLE IF NOT EXISTS filterTopic(topicId text, userId text,groupId text,topicCreate text)',
        'CREATE TABLE IF NOT EXISTS favouriteTopic(topicId text, userId text,groupId text,topicCreate text)',
        'CREATE TABLE IF NOT EXISTS topicBlacklist(topicId text, userId text,groupId text,topicCreate text)',
        'CREATE TABLE IF NOT EXISTS collectionTopic(topicId text, userId text,groupId text,topicCreate text)'];
      dbService.executeSqlList(tableSqlList).then(function () {
        $log.info('create playground tables success');
      }, function (error) {
        $log.error('create playground tables error: ' + error.message);
      });
    }

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

    var _saveRecords = function (table, records) {
      var pattern = patterns[table];
      if (pattern == null || pattern == '') {
        throw "invalid table name";
      }

      return dbService.saveRecords(table, records, pattern);
    };

    var _findRecords = function (table, where) {
      var _innerDefer = $q.defer();
      dbService.findRecords(table, where).then(function (res) {
        if (typeof res == 'undefined' || res === null) {
          _innerDefer.resolve(new Array());
          return;
        }
        var records = new Array();
        if (res.rows.length) {
          for (var index = 0; index < res.rows.length; ++index) {
            var record = recordSetItem2Record(table, res.rows.item(index));
            if (record != null) {
              records.push(record);
            }
          }
        }
        _innerDefer.resolve(records);
      }, function (err) {
        _innerDefer.reject(err);
      });
      return _innerDefer.promise;
    };

    var _dropRecords = function (table, where) {
      return dbService.dropRecords(table, where);
    };

    return {
      createTable: _init,
      createRecord: _createRecord,
      saveRecords: _saveRecords,
      findRecords: _findRecords,
      dropRecords: _dropRecords,
    };
  }

  filterTopicServiceFactoryFn.$inject = ['$log', '$q', '$$HashMap', 'PlaygroundDBService', 'PlaygroundNetService'];
  function filterTopicServiceFactoryFn($log, $q, $$HashMap, PlaygroundDBService, PlaygroundNetService) {
    var _cacheTable = new $$HashMap([], true);
    var _currentUserId = '';
    var _buildCacheFromDB = function (currentUserId) {
      PlaygroundDBService.findRecords('filterTopic', 'userId = "' + currentUserId + '"').then(function (records) {
        for (var index = 0; index < records.length; ++index) {
          var record = records[index];
          _cacheTable.put(record.topicId, record);
        }
        _currentUserId = currentUserId;
      }, function (e) {
        $log.error("create topic filter cache from db failed:" + e.message);
      });
    };

    var _buildCacheFromServer = function (currentUserId) {
      _currentUserId = currentUserId;
    };

    var _addFilterTopic = function (topicId, groupId, topicCreated) {
      var _innerDefer = $q.defer();
      PlaygroundNetService.filterTopic(topicId).then(function (res) {
        var record = PlaygroundDBService.createRecord('filterTopic');

        record.topicId = topicId;
        record.groupId = groupId;
        record.userId = _currentUserId;
        record.topicCreate = topicCreated;
        PlaygroundDBService.saveRecords('filterTopic', record).then(function (res) {
          _cacheTable.put(topicId, record);
          _innerDefer.resolve(topicId);
        }, function (e) {
          $log.error('向数据库中添加过滤话题失败:' + e.message);
          _innerDefer.reject(e);
        });
      }, function (e) {
        $log.error('向服务器发生添加过滤话题失败:' + e.message);
        _innerDefer.reject(e);
      });
      return _innerDefer.promise;
    };

    var _isFilterTopic = function (topicId) {
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

  favouriteTopicServiceFactoryFn.$inject = ['$log', '$q', '$$HashMap', 'PlaygroundDBService', 'PlaygroundNetService'];
  function favouriteTopicServiceFactoryFn($log, $q, $$HashMap, PlaygroundDBService, PlaygroundNetService) {
    var _cacheTable = new $$HashMap([], true);
    var _currentUserId = '';

    var _buildCacheFromDB = function (currentUserId) {
      PlaygroundDBService.findRecords('favouriteTopic', 'userId = "' + currentUserId + '"').then(function (records) {
        for (var index = 0; index < records.length; ++index) {
          var record = records[index];
          _cacheTable.put(record.topicId, record);
        }
        _currentUserId = currentUserId;
      }, function (e) {
        $log.error("create favourite topic cache from db failed:" + e.message);
      });
    };

    var _buildCacheFromServer = function (currentUserId) {
      _currentUserId = currentUserId;
    };

    var _addFavouriteTopic = function (topicId, groupId, topicCreated) {
      var _innerDefer = $q.defer();
      PlaygroundNetService.favouriteTopic(topicId).then(function (res) {
        var record = PlaygroundDBService.createRecord('favouriteTopic');

        record.topicId = topicId;
        record.groupId = groupId;
        record.userId = _currentUserId;
        record.topicCreate = topicCreated;
        PlaygroundDBService.saveRecords('favouriteTopic', record).then(function (res) {
          _cacheTable.put(topicId, record);
          _innerDefer.resolve(topicId);
        }, function (e) {
          $log.error('向数据库中添加点赞话题失败:' + e.message);
          _innerDefer.reject(e);
        });
      }, function (e) {
        $log.error('向服务器发送添加点赞话题失败:' + e.message);
        _innerDefer.reject(e);
      });
      return _innerDefer.promise;
    };

    var _deleteFavouriteTopic = function (topicId, groupId, topicCreated) {
      var _innerDefer = $q.defer();
      PlaygroundNetService.cancelFavouriteTopic(topicId).then(function (res) {
        PlaygroundDBService.dropRecords('favouriteTopic', 'topicId = "' + topicId + '" and userId = "' + _currentUserId + '"').then(
          function (res) {
            _cacheTable.remove(topicId);
            _innerDefer.resolve(topicId);
          },
          function (e) {
            $log.error('从数据库中删除点赞话题失败:' + e.message);
            _innerDefer.reject(e);
          }
        )
      }, function (e) {
        $log.error('向服务器发送去掉点赞请求失败:' + e.message);
        _innerDefer.reject(e);
      });
      return _innerDefer.promise;
    }

    var _isFavouriteTopic = function (topicId) {
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

  collectionTopicServiceFactoryFn.$inject = ['$log', '$q', '$$HashMap', 'PlaygroundDBService', 'PlaygroundNetService'];

  function collectionTopicServiceFactoryFn($log, $q, $$HashMap, PlaygroundDBService, PlaygroundNetService) {
    var _cacheTable = new $$HashMap([], true);
    var _currentUserId = '';

    var _buildCacheFromDB = function (currentUserId) {
      PlaygroundDBService.findRecords('collectionTopic', 'userId = "' + currentUserId + '"').then(function (records) {
        for (var index = 0; index < records.length; ++index) {
          var record = records[index];
          _cacheTable.put(record.topicId, record);
        }
        _currentUserId = currentUserId;
      }, function (e) {
        $log.error("create collectionTopic topic cache from db failed:" + e.message);
      });
    };

    var _buildCacheFromServer = function (currentUserId) {
      _currentUserId = currentUserId;
    };

    var _addCollectionTopic = function (topicId, topicCreated) {
      var _innerDefer = $q.defer();
      PlaygroundNetService.addCollectionTopic(topicId).then(function (res) {
        var record = PlaygroundDBService.createRecord('collectionTopic');

        record.topicId = topicId;
        //record.groupId = groupId;
        record.userId = _currentUserId;
        record.topicCreate = topicCreated;
        PlaygroundDBService.saveRecords('collectionTopic', record).then(function (res) {
          _cacheTable.put(topicId, record);
          _innerDefer.resolve(topicId);
        }, function (e) {
          $log.error('向数据库中添加收藏话题失败:' + e.message);
          _innerDefer.reject(e);
        });
      }, function (e) {
        $log.error('向服务器发送添加收藏话题失败:' + e.message);
        _innerDefer.reject(e);
      });
      return _innerDefer.promise;
    };

    var _cancelCollectionTopic = function (topicId, groupId, topicCreated) {
      var _innerDefer = $q.defer();
      PlaygroundNetService.cancelCollectionTopic(topicId).then(function (res) {
        PlaygroundDBService.dropRecords('collectionTopic', 'topicId = "' + topicId + '" and userId = "' + _currentUserId + '"').then(
          function (res) {
            _cacheTable.remove(topicId);
            _innerDefer.resolve(topicId);
          },
          function (e) {
            $log.error('从数据库中删除收藏话题失败:' + e.message);
            _innerDefer.reject(e);
          }
        )
      }, function (e) {
        $log.error('向服务器发送去掉收藏请求失败:' + e.message);
        _innerDefer.reject(e);
      });
      return _innerDefer.promise;
    }

    var _isCollectionTopic = function (topicId) {
      var info = _cacheTable.get(topicId);
      if (info == null || info == '') {
        return false;
      }
      return true;
    }

    return {
      buildCacheFromDB: _buildCacheFromDB,
      addCollectionTopic: _addCollectionTopic,
      cancelCollectionTopic: _cancelCollectionTopic,
      isCollectionTopic: _isCollectionTopic,
    };
  }

  topicBlacklistServiceFactoryFn.$inject = ['$log', '$q', '$$HashMap', 'PlaygroundDBService', 'PlaygroundNetService'];
  function topicBlacklistServiceFactoryFn($log, $q, $$HashMap, PlaygroundDBService, PlaygroundNetService) {
    var _cacheTable = new $$HashMap([], true);
    var _currentUserId = '';
    var _buildCacheFromDB = function (currentUserId) {
      PlaygroundDBService.findRecords('topicBlacklist', 'userId = "' + currentUserId + '"').then(function (records) {
        for (var index = 0; index < records.length; ++index) {
          var record = records[index];
          _cacheTable.put(record.topicId, record);
        }
        _currentUserId = currentUserId;
      }, function (e) {
        $log.error("create topic blacklist cache from db failed:" + e.message);
      });
    };

    var _buildCacheFromServer = function (currentUserId) {
      _currentUserId = currentUserId;
    };

    var _addTopicBlacklist = function (topicId, groupId, topicCreated) {
      var _innerDefer = $q.defer();
      PlaygroundNetService.addTopic2Blacklist(topicId).then(function (res) {
        var record = PlaygroundDBService.createRecord('topicBlacklist');

        record.topicId = topicId;
        record.groupId = groupId;
        record.userId = _currentUserId;
        record.topicCreate = topicCreated;
        PlaygroundDBService.saveRecords('topicBlacklist', record).then(function (res) {
          _cacheTable.put(topicId, record);
          _innerDefer.resolve(topicId);
        }, function (e) {
          $log.error('向数据库中添加话题黑名单失败:' + e.message);
          _innerDefer.reject(e);
        });
      }, function (e) {
        $log.error('向服务器发生添加话题黑名单失败:' + e.message);
        _innerDefer.reject(e);
      });
      return _innerDefer.promise;
    };

    var _isInTopicBlacklist = function (topicId) {
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

  topicServiceFactoryFn.$inject = ['$log', '$q', '$$HashMap', 'PlaygroundDBService', 'PlaygroundNetService',
    'favouriteTopicService', 'topicBlacklistService', 'filterTopicService', 'SharePageWrapService'];
  function topicServiceFactoryFn($log, $q, $$HashMap, PlaygroundDBService, PlaygroundNetService,
                                 favouriteTopicService, topicBlacklistService, filterTopicService,
                                 SharePageWrapService) {
    var _topicCacheTable = new $$HashMap([], true);
    var _sysTopicCacheTable = new $$HashMap([], true);
    var _topicTagList = null;
    var _topicADList = null;
    var _init = function () {
      _getTopicTagList();
      getADList();
    }

    var preprocessTopic = function (topic) {
      topic.isShow = true;
      topic.isFavourite = false;
      if (topicBlacklistService.isInTopicBlacklist(topic.id) == true) {
        topic.isShow = false;

      }
      if (filterTopicService.isFilterTopic(topic.id) == true) {
        topic.isShow = false;
      }

      if (favouriteTopicService.isFavouriteTopic(topic.id) == true) {
        topic.isFavourite = true;
      }
      return topic;
    }

    var _refreshSysTopic = function (topicGroupId) {
      var _innerDefer = $q.defer();
      PlaygroundNetService.getSysTopicListByGroup(0, 1, 10, topicGroupId).then(function (data) {

        var topicList = new Array();
        for (var index = 0; index < data.length; ++index) {
          topicList.push(preprocessTopic(data[index]));
        }
        _sysTopicCacheTable.put(topicGroupId, topicList);
        _innerDefer.resolve(topicList);
      }, function (err) {
        _innerDefer.reject(err);
      });
      return _innerDefer.promise;
    }

    var _refreshTopic = function (topicGroupId) {
      var _innerDefer = $q.defer();
      PlaygroundNetService.getTopicListByGroup(0, 1, 10, topicGroupId).then(function (data) {
        var topicList = new Array();
        for (var index = 0; index < data.length; ++index) {
          topicList.push(preprocessTopic(data[index]));
        }
        _topicCacheTable.put(topicGroupId, topicList);
        _innerDefer.resolve(topicList);
      }, function (err) {
        _innerDefer.reject(err);
      });
      return _innerDefer.promise;
    }

    var _moreTopic = function (topicGroupId) {
      var topicList = _topicCacheTable.get(topicGroupId);
      var _innerDefer = $q.defer();
      if (topicList == null || topicList.length == 0) {
        return _refreshTopic(topicGroupId);
      }

      var firstTopic = topicList[0];
      var lastTopic = topicList[topicList.length - 1];
      var pageSize = 20;
      PlaygroundNetService.getTopicListByGroup(firstTopic.id, Math.ceil(topicList.length / pageSize) + 1, pageSize, topicGroupId).then(function (data) {
        var dataLen = data.length;
        for (var index = 0; index < dataLen; ++index) {
          if (lastTopic.id <= data[index].id) {
            // 话题已经在缓存中，后续话题将忽略
            break;
          }
          else {
            topicList.push(preprocessTopic(data[index]));
          }
        }
        _innerDefer.resolve(topicList);
      }, function (err) {
        _innerDefer.reject(err);
      });
      return _innerDefer.promise;
    }

    var _getSysTopicList = function (topicGroupId) {
      return _sysTopicCacheTable.get(topicGroupId);
    }
    var _getTopicList = function (topicGroupId) {
      return _topicCacheTable.get(topicGroupId);
    }

    var updateTopic2Cache = function (topic) {
      var topicList = _topicCacheTable.get(topic.groupId);
      if (topicList == null) {
        return;
      }

      for (var index = 0; index < topicList.length; ++index) {
        if (topicList[index].id === topic.id) {
          topicList[index] = preprocessTopic(topic);
          break;
        }
      }
    }

    var _currentDetailTopic = {};
    var _setCurrentDetailTopic = function (topic) {
      _currentDetailTopic = topic;
    }

    var _getCurrentDetailTopic = function () {
      return _currentDetailTopic;
    }

    var _shareTopic = function (topic) {
      SharePageWrapService.shareTopic(topic.id, 1).then(function (res) {
        topic.shareCount++;
      }, function (error) {

      });
    }

    var _getTopicTagList = function () {
      if (_topicTagList == null || _topicTagList.length == 0) {
        PlaygroundNetService.getTopicTagList().then(function (data) {
          _topicTagList = data;
        }, function (error) {
          $log.error('getTopicTagList faile:' + error);
        })
      }
      return _topicTagList;
    }

    var getADList = function () {
      if (_topicADList == null || _topicADList.length == 0) {
        PlaygroundNetService.getAdList().then(function (adList) {
          _topicADList = adList;
        }, function (error) {
          $log.error('getAddList failed:' + error);
        });
      }

      return _topicADList;
    }

    var _currentDetailTopicCommentList = []
    var setCurrentDetailTopicCommentList = function (commentList) {
      _currentDetailTopicCommentList = commentList;
    }

    var getCurrentDetailTopicCommentList = function () {
      return _currentDetailTopicCommentList;
    }

    var getCollectionTopicListByUser = function (pageNum, pageSize) {
      var _innerDefer = $q.defer();
      PlaygroundNetService.getCollectionTopicListByUser(pageNum, pageSize).then(function (data) {
        var topicList = new Array();
        for (var index = 0; index < data.length; ++index) {
          topicList.push(preprocessTopic(data[index]));
        }
        _innerDefer.resolve(topicList);

      }, function (error) {
        _innerDefer.reject(error);
      });
      return _innerDefer.promise;
    }

    var getOwnTopicListByUser = function (pageNum, pageSize) {
      var _innerDefer = $q.defer();
      PlaygroundNetService.getOwnTopicListByUser(0, pageNum, pageSize).then(function (data) {
        var topicList = new Array();
        for (var index = 0; index < data.length; ++index) {
          topicList.push(preprocessTopic(data[index]));
        }
        _innerDefer.resolve(topicList);

      }, function (error) {
        _innerDefer.reject(error);
      });
      return _innerDefer.promise;
    }

    var getTopicDetailInfo = function (topicId, startCommentId, pageNum, pageSize) {
        var _innerDefer = $q.defer();
      PlaygroundNetService.getTopicDetailInfo(topicId,startCommentId,pageNum,pageSize).then(function(res) {
        res.topic = preprocessTopic(res.topic);
        _innerDefer.resolve(res);
      },function(error) {
        _innerDefer.reject(error);
      });
      return _innerDefer.promise;
    }

    return {
      initService: _init,
      setCurrentDetailTopic: _setCurrentDetailTopic,
      getCurrentDetailTopic: _getCurrentDetailTopic,
      setCurrentDetailTopicCommentList: setCurrentDetailTopicCommentList,
      getCurrentDetailTopicCommentList: getCurrentDetailTopicCommentList,
      refreshSysTopic: _refreshSysTopic,
      refreshTopic: _refreshTopic,
      moreTopic: _moreTopic,
      getSysTopicList: _getSysTopicList,
      getTopicList: _getTopicList,
      shareTopic: _shareTopic,
      getTopicTagList: _getTopicTagList,
      getADList: getADList,
      getCollectionTopicListByUser: getCollectionTopicListByUser,
      getOwnTopicListByUser: getOwnTopicListByUser,
      updateTopic2Cache:updateTopic2Cache,
      getTopicDetailInfo:getTopicDetailInfo,
    };
  }

  topicGroupServiceFactoryFn.$inject = ['$log', '$q', '$$HashMap', 'PlaygroundNetService'];
  function topicGroupServiceFactoryFn($log, $q, $$HashMap, PlaygroundNetService) {
    var _groupList = [{
      'id': 1,
      'name': '捎带侠论坛',
      'description': '捎带侠们聚集起来',
      'publicNotice': '1.捎带侠们聚集起来<br/> 2.捎带侠们聚集起来 <br/>  3.2.捎带侠们聚集起来 ',
      'pic': 'img/task/publish/shaodai-logo.png'
    }, {
      'id': 2,
      'name': '情报侠论坛',
      'description': '情报侠们聚集起来',
      'publicNotice': '1.捎带侠们聚集起来<br/> 2.捎带侠们聚集起来 <br/>  3.2.捎带侠们聚集起来 ',
      'pic': 'img/task/publish/qingbao-logo.png'
    }, {
      'id': 3,
      'name': '借宝侠论坛',
      'description': '借宝侠们聚集起来',
      'publicNotice': '1.捎带侠们聚集起来<br/> 2.捎带侠们聚集起来 <br/>  3.2.捎带侠们聚集起来 ',
      'pic': 'img/task/publish/jiebao-logo.png'
    }, {
      'id': 1,
      'name': '捎带侠论坛',
      'description': '捎带侠们聚集起来',
      'publicNotice': '1.捎带侠们聚集起来<br/> 2.捎带侠们聚集起来 <br/> 3.2.捎带侠们聚集起来 ',
      'pic': 'img/task/publish/shaodai-logo.png'
    }, {
      'id': 2,
      'name': '情报侠论坛',
      'description': '情报侠们聚集起来',
      'publicNotice': '1.捎带侠们聚集起来<br/> 2.捎带侠们聚集起来 <br/> 3.2.捎带侠们聚集起来 ',
      'pic': 'img/task/publish/qingbao-logo.png'
    }, {
      'id': 3,
      'name': '借宝侠论坛',
      'description': '借宝侠们聚集起来',
      'publicNotice': '捎带侠们聚集起来 捎带侠们聚集起来 ',
      'pic': 'img/task/publish/jiebao-logo.png'
    }, {
      'id': 1,
      'name': '捎带侠论坛',
      'description': '捎带侠们聚集起来',
      'publicNotice': '捎带侠们聚集起来 捎带侠们聚集起来 ',
      'pic': 'img/task/publish/shaodai-logo.png'
    }, {
      'id': 2,
      'name': '情报侠论坛',
      'description': '情报侠们聚集起来',
      'publicNotice': '捎带侠们聚集起来 捎带侠们聚集起来 ',
      'pic': 'img/task/publish/qingbao-logo.png'
    }, {
      'id': 3,
      'name': '借宝侠论坛',
      'description': '借宝侠们聚集起来',
      'publicNotice': '捎带侠们聚集起来 捎带侠们聚集起来 ',
      'pic': 'img/task/publish/jiebao-logo.png'
    }];
    var _refresh = function () {

    }

    var _getGroupInfo = function (groupId) {
      return _groupList[groupId];
    }

    var _getGroupInfoList = function () {
      return _groupList;
    }
    return {
      refresh: _refresh,
      getGroupInfo: _getGroupInfo,
      getGroupInfoList: _getGroupInfoList
    };
  }

  PlaygroundStartupServiceFn.$inject = ['topicService', 'PlaygroundDBService', 'favouriteTopicService',
    'topicBlacklistService', 'filterTopicService'];
  function PlaygroundStartupServiceFn(topicService, PlaygroundDBService, favouriteTopicService,
                                      topicBlacklistService, filterTopicService) {
    var _init = function (currentUserId) {
      PlaygroundDBService.createTable();
      topicService.initService();
      favouriteTopicService.buildCacheFromDB(currentUserId);
      topicBlacklistService.buildCacheFromDB(currentUserId);
      filterTopicService.buildCacheFromDB(currentUserId);
    }

    return {
      initService: _init
    }
  }
})();

