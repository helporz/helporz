/**
 * Created by binfeng on 16/4/9.
 */

;
(function () {
  'use strict'
  angular.module('com.helporz.task.netservice', []).factory('taskNetService', ['$q', '$log', 'httpBaseService',
    'errorCodeService', 'httpErrorCodeService','uploadService','userLoginInfoService',
    'NoticeMessageService','$rootScope', '$ionicPopup',
    TaskNetServiceFactoryFn]);

  function TaskNetServiceFactoryFn($q, $log, httpBaseService, errorCodeService, httpErrorCodeService,uploadService,userLoginInfoService,
  NoticeMessageService, $rootScope, $ionicPopup) {

    // cache
    var cache = {

      isNearTaskNeedRefresh: true,
      nearTaskList: [],

      //isPostTaskNeedRefresh: true,
      postTaskList: [],
      //isAcceptTaskNeedRefresh: true,
      acceptTaskList: [],


      isPostTaskGoingNeedRefresh: true,
      postTaskGoingList: [],
      isPostTaskFinishNeedRefresh: true,
      postTaskFinishList: [],

      isAcceptTaskGoingNeedRefresh: true,
      acceptTaskGoingList: [],
      isAcceptTaskFinishNeedRefresh: true,
      acceptTaskFinishList: [],

      // notice
      nm_postGoing: [],
      nm_postFinish: [],
      nm_acceptGoing: [],
      nm_acceptFinish: [],
      nm_comment: [],
      nm_follow: [],
      nm_main_changed: false,
      nm_task_changed: false,
      nm_follow_changed: false
    };

    var _postTask = function (type, summary, pubLocation, startTime, deadLine, posterLong,
                              posterLat, rewardType, rewardSubType, rewardCount, payMethodType) {
      var localeStartTime = (startTime == null) ? null : startTime.toLocaleString();
      var locateDeadline = (deadLine == null) ? null : deadLine.toLocaleString();
      var taskInfo = {
        taskType: type,
        summary: summary,
        pubLocation: pubLocation,
        startTime: localeStartTime,
        deadLine: locateDeadline,
        posterLong: posterLong,
        posterLat: posterLat,
        rewardType: rewardType,
        rewardSubType: rewardSubType,
        rewardCount: rewardCount,
        payMethodType: payMethodType,
      };
      return httpBaseService.postForPromise('/v2/task/post', taskInfo);
    };

    var _acceptTask = function (taskId) {
      return httpBaseService.postForPromise('/task/' + taskId + '/accept', null);
    };

    var _cancelByAcceptor = function (taskId) {
      return httpBaseService.postForPromise('/task/' + taskId + '/cancel_by_accepter', null);
    }

    var _cancelByPoster = function (taskId) {
      return httpBaseService.postForPromise('/task/' + taskId + '/cancel_by_poster', null);
    }

    var _completeByAcceptor = function (taskId) {
      return httpBaseService.postForPromise('/task/' + taskId + '/complete', null);
    }

    var _confirmByPoster = function (taskId, status, commentLevel, comment) {
      var data = {
        status: status,
        level: commentLevel,
        comment: comment
      };
      return httpBaseService.postForPromise('/task/' + taskId + '/confirm_by_poster', data);
    }

    var _commentByPoster = function (taskId, commentLevel, comment, tagList,imgList,audioList) {
      $log.debug("commentByPoster imgList:" + JSON.stringify(imgList));
      var imgCount = imgList.length;
      var audioCount = audioList.length;
      var data = {
        level: commentLevel,
        comment: comment,
        tags: tagList,
        imgCount:imgCount,
        audioCount:audioCount,
      };

      var _innerDefer = $q.defer();

      httpBaseService.postForPromise('/task/' + taskId + '/comment_by_poster', data).then(function(ret) {
          var promiseArray = new Array();
          if( imgList.length > 0 ) {
            for(var imgIndex = 0; imgIndex < imgList.length; ++imgIndex) {
              var imgPromise = _uploadTaskCommentImgByPoster(taskId,imgList[imgIndex]);
              if( imgPromise != null ) {
                promiseArray.push(imgPromise);
              }
            }
          }

          if( audioList.length > 0) {
            for( var audioIndex = 0; audioIndex < audioList.length; ++audioIndex) {
              var audioPromise = _uploadTaskCommentAudioByPoster(taskId,audioList[audioIndex]);
              if( imgPromise != null ) {
                promiseArray.push(imgPromise);
              }
            }
          }

          if( promiseArray.length > 0 ) {
            $q.all(promiseArray).then(function () {
              _innerDefer.resolve();
            }, function () {
              _innerDefer.reject();
            });
          }
          else {
            _innerDefer.resolve();
          }
      },
      function(error) {
          _innerDefer.reject(error);
      });

      return _innerDefer.promise;
    }

    var _commentByAcceptor = function (taskId, commentLevel, comment, tagList,imgList,audioList) {
      $log.debug("commentByAcceptor imgList:" + JSON.stringify(imgList));
      var imgCount = imgList.length;
      var audioCount = audioList.length;
      var data = {
        level: commentLevel,
        comment: comment,
        tags: tagList,
        imgCount:imgCount,
        audioCount:audioCount,
      };

      var _innerDefer = $q.defer();
      httpBaseService.postForPromise('/task/' + taskId + '/comment_by_accepter', data).then(function(ret) {
          var promiseArray = new Array();
          if( imgList.length > 0 ) {
            for(var imgIndex = 0; imgIndex < imgList.length; ++imgIndex) {
              var imgPromise = _uploadTaskCommentImgByAcceptor(taskId,imgList[imgIndex]);
              if( imgPromise != null ) {
                promiseArray.push(imgPromise);
              }
            }
          }

          if( audioList.length > 0) {
            for( var audioIndex = 0; audioIndex < audioList.length; ++audioIndex) {
              var audioPromise = _uploadTaskCommentAudioByAcceptor(taskId,audioList[audioIndex]);
              if( imgPromise != null ) {
                promiseArray.push(imgPromise);
              }
            }
          }

          if( promiseArray.length > 0 ) {
            $q.all(promiseArray).then(function () {
              _innerDefer.resolve();
            }, function () {
              _innerDefer.reject();
            });
          }
          else {
            _innerDefer.resolve();
          }
        },
        function(error) {
          _innerDefer.reject(error);
        });

      return _innerDefer.promise;
    }

    var _uploadTaskCommentImgByPoster = function(taskId,fileNativeUrl) {
      var headers = {
        Connection: "close",
        'x-login-key': userLoginInfoService.getLoginTicket()
      };

      return uploadService.uploadImgFile(fileNativeUrl, appConfig.API_SVC_URL +
        '/task/' + taskId +'/topic/img/true' , headers);
    };

    var _uploadTaskCommentImgByAcceptor = function(taskId,fileNativeUrl) {
      var headers = {
        Connection: "close",
        'x-login-key': userLoginInfoService.getLoginTicket()
      };

      return uploadService.uploadImgFile(fileNativeUrl, appConfig.API_SVC_URL +
        '/task/' + taskId +'/topic/img/false' , headers);
    };

    var _uploadTaskCommentAudioByPoster = function(taskId,fileNativeUrl) {
      var headers = {
        Connection: "close",
        'x-login-key': userLoginInfoService.getLoginTicket()
      };

      return uploadService.uploadImgFile(fileNativeUrl, appConfig.API_SVC_URL +
        '/task/' + taskId +'/topic/audio/true' , headers);
    };

    var _uploadTaskCommentAudioByAcceptor = function(taskId,fileNativeUrl) {
      var headers = {
        Connection: "close",
        'x-login-key': userLoginInfoService.getLoginTicket()
      };

      return uploadService.uploadImgFile(fileNativeUrl, appConfig.API_SVC_URL +
        '/task/' + taskId +'/topic/audio/false' , headers);
    };

    var _queryNewTaskList = function (beginTaskId,taskCount) {
      var param = {};
      if( beginTaskId != null && beginTaskId > 0 ) {
        param.beginTaskId = beginTaskId;
      }

      if( taskCount != null && taskCount > 0) {
        param.taskCount = taskCount;
      }
      return httpBaseService.getForPromise('/task/query/random/new', param);
    };

    var _queryTaskInfo = function (taskId) {
      return httpBaseService.getForPromise('/task/' + taskId + '/detail', null);
    };

    var _getTaskInNearList = function (taskId) {
      if (cache.nearTaskList) {
        for (var i = 0; i < cache.nearTaskList.length; i++) {
          if (cache.nearTaskList[i].id == taskId) {
            return cache.nearTaskList[i];
          }
        }
        return null;
      }
      return null;
    };

    var _queryTaskInNearList = function(taskId) {
      var d = $q.defer();
      return _queryTaskInfo(taskId).then(
        function(task) {
          d.resolve(task);
          for (var i in cache.nearTaskList) {
            if(cache.nearTaskList[i].id = taskId){
              cache.nearTaskList[i] = task;
            }
          }
          return d.promise;
        },
        function(err) {
          d.reject(err);
          return d.promise;
        }
      )
    }

    var _getTaskInPostList = function (taskId) {
      if (cache.postTaskGoingList) {
        for (var i = 0; i < cache.postTaskGoingList.length; i++) {
          if (cache.postTaskGoingList[i].id == taskId) {
            return cache.postTaskGoingList[i];
          }
        }
      }
      if (cache.postTaskFinishList) {
        for (var i = 0; i < cache.postTaskFinishList.length; i++) {
          if (cache.postTaskFinishList[i].id == taskId) {
            return cache.postTaskFinishList[i];
          }
        }
      }
      return null;
    };
    var _getTaskInAcceptList = function (taskId) {
      if (cache.acceptTaskGoingList) {
        for (var i = 0; i < cache.acceptTaskGoingList.length; i++) {
          if (cache.acceptTaskGoingList[i].id == taskId) {
            return cache.acceptTaskGoingList[i];
          }
        }
      }
      if (cache.acceptTaskFinishList) {
        for (var i = 0; i < cache.acceptTaskFinishList.length; i++) {
          if (cache.acceptTaskFinishList[i].id == taskId) {
            return cache.acceptTaskFinishList[i];
          }
        }
      }
      return null;
    };

    var _getAcceptTaskList = function (pageIndex, pageSize) {
      var params = {
        pageIndex: pageIndex,
        pageSize: pageSize
      };
      return httpBaseService.getForPromise('/task/query/accepted', params);
    }

    var _getCompletedAcceptTaskList = function (pageNum, pageSize) {
      var params = {
        pageNum: pageNum,
        pageSize: pageSize
      };
      var d = $q.defer();
      return httpBaseService.getForPromise('/task/query/accepted/completed', params).then(
        function(taskList) {
          d.resolve(taskList);
          cache.isAcceptTaskFinishNeedRefresh = false;
          cache.acceptTaskFinishList = taskList;
          return d.promise;
        },
        function(err) {
          d.reject(err);
          return d.promise;
        }
      )
    }

    var _getUncompletedAcceptTaskList = function () {
      var d = $q.defer();
      return httpBaseService.getForPromise('/task/query/accepted/uncompleted', null).then(
        function(taskList) {
          d.resolve(taskList);
          cache.isAcceptTaskGoingNeedRefresh = false;
          cache.acceptTaskGoingList = taskList;
          return d.promise;
        },
        function(err) {
          d.reject(err);
          return d.promise;
        }
      )
    }

    var _getPostTaskList = function (pageIndex, pageSize) {
      var params = {
        pageIndex: pageIndex,
        pageSize: pageSize
      };

      return httpBaseService.getForPromise('/task/query/posted', params);
    }

    var _getCompletedPostTaskList = function (pageNum, pageSize) {
      var params = {
        pageNum: pageNum,
        pageSize: pageSize
      };

      var d = $q.defer();
      return httpBaseService.getForPromise('/task/query/posted/completed', params).then(
				function(taskList) {
					d.resolve(taskList);
					cache.isPostTaskFinishNeedRefresh = false;
          cache.postTaskFinishList = taskList;
          return d.promise;
				},
        function(err) {
          d.reject(err);
          return d.promise;
        }
      );
    }

    var _getUncompletedPostTaskList = function () {
      var d = $q.defer();
      return httpBaseService.getForPromise('/task/query/posted/uncompleted').then(
        function(taskList) {
          d.resolve(taskList);
          cache.isPostTaskGoingNeedRefresh = false;
          cache.postTaskGoingList = taskList;
          return d.promise;
        },
        function(err) {
          d.reject(err);
          return d.promise;
        }
      )
    }

    var _getTaskList = function () {
      var d = $q.defer();
      return httpBaseService.getForPromise('/task/query').then(
        function(taskList) {
          d.resolve(taskList);
          cache.isPostTaskGoingNeedRefresh = false;
          cache.isPostTaskFinishNeedRefresh = false;
          cache.isAcceptTaskGoingNeedRefresh = false;
          cache.isAcceptTaskFinishNeedRefresh = false;
          cache.postTaskGoingList = taskList.uncompletedPostList || [];
          cache.postTaskFinishList = taskList.completedPostList || [];
          cache.acceptTaskGoingList = taskList.uncompletedAcceptList || [];
          cache.acceptTaskFinishList = taskList.completedAcceptList || [];
          ho.trace(taskList);
          return d.promise;
        },
        function(err) {
          d.reject(err);
          return d.promise;
        }
      )
    }

    var _commentTask = function (taskId, comment) {
      var data = {
        comment: comment
      };

      return httpBaseService.postForPromise('/task/' + taskId + '/comment', data);
    }
    var _getTaskSharePage = function (taskId) {
      return httpBaseService.getForPromise('/task/' + taskId + '/share_page', null);
    }

    var getWaitingTaskList = function(userId) {
      $log.debug('get waiting task list:' + userId);
      var param = {
        userId:userId,
      }
      return httpBaseService.getForPromise('/task/query/status/waiting',param);
    }

    var _onNotifyNoticeMessage = function() {
      if(ionic.Platform.isIOS()) {
        var popupScope = $rootScope.$new();
        var pp = $ionicPopup.show({
          templateUrl: 'js/templates/ios-push-notify.html',
          scope: popupScope
        });
        popupScope.cb_ok = function() {
          pp.close();
        }
      }
      _fetchNoticeMessage();
    }
    // notice message
    var _fetchNoticeMessage = function() {

      ho.alert('_fetchMessage');
      NoticeMessageService.getAllNoticeMessage().then(function (noticeMessageList) {

        //old
        var postGoing_oldCount = cache.nm_postGoing.length;
        var postFinish_oldCount = cache.nm_postFinish.length;
        var acceptGoing_oldCount = cache.nm_acceptGoing.length;
        var acceptFinish_oldFinish = cache.nm_acceptFinish.length;
        var comment_oldCount = cache.nm_comment.length;
        var follow_oldCount = cache.nm_follow.length;

        // clear notice message cache
        var postGoing = cache.nm_postGoing = [];
        var postFinish = cache.nm_postFinish = [];
        var acceptGoing = cache.nm_acceptGoing = [];
        var acceptFinish = cache.nm_acceptFinish = [];
        var comment = cache.nm_comment = [];
        var follow = cache.nm_follow = [];


        // analyze fetched message
        //
        /*{
          POSTER_UNCOMPLETED_TASK_MESSAGE_TYPE: 1,
          ACCEPTER_UNCOMPLETED_TASK_MESSAGE_TYPE: 2,
          COMMENT_TASK_MESSAGE_TYPE: 3,
          FRIEND_TASK_MESSAGE_TYPE: 4,
          POSTER_COMPLETED_TASK_MESSAGE_TYPE: 5,
          ACCEPTER_COMPLETED_TASK_MESSAGE_TYPE: 6,
        }*/

        var NMT = NoticeMessageService.getNoticeMessageTypes();

        if (noticeMessageList != null && noticeMessageList.length > 0) {
          var unreadMessageList = noticeMessageList;
          for (var msgIndex = 0; msgIndex < unreadMessageList.length; ++msgIndex) {
            //$log.info('noticemsg[#index#] serialNo[#serialNo#]'
            //  .replace('#index#', msgIndex)
            //  .replace('#serialNo#', unreadMessageList[msgIndex].serialNo));

            var msg = unreadMessageList[msgIndex];
            if(msg.type == NMT.POSTER_UNCOMPLETED_TASK_MESSAGE_TYPE) {
              postGoing.push(msg);
            }else if(msg.type == NMT.ACCEPTER_UNCOMPLETED_TASK_MESSAGE_TYPE) {
              acceptGoing.push(msg);
            }else if(msg.type == NMT.COMMENT_TASK_MESSAGE_TYPE) {
              comment.push(msg);
            }else if(msg.type == NMT.FRIEND_TASK_MESSAGE_TYPE) {
              follow.push(msg);
            }else if(msg.type == NMT.POSTER_COMPLETED_TASK_MESSAGE_TYPE) {
              postFinish.push(msg);
            }else if(msg.type == NMT.ACCEPTER_COMPLETED_TASK_MESSAGE_TYPE) {
              acceptFinish.push(msg);
            }
          }

          //未读消息如果有增加,则刷新对应页面
          if(postGoing.length > postGoing_oldCount || comment.length > comment_oldCount){
            cache.isPostTaskGoingNeedRefresh = true;
          }
          if(postFinish.length > postFinish_oldCount) {
            cache.isPostTaskFinishNeedRefresh = true;
          }
          if(acceptGoing.length > acceptGoing_oldCount) {
            cache.isAcceptTaskGoingNeedRefresh = true;
          }
          if(acceptFinish.length > acceptFinish_oldFinish) {
            cache.isAcceptTaskFinishNeedRefresh = true;
          }

          cache.nm_main_changed = true;
          cache.nm_task_changed = true;

          if(follow.length > follow_oldCount) {
            cache.nm_follow_changed = true;
          }

          //NoticeMessageService.setReadFlagForLessAndEqualSerialNo(1,noticeMessageList[0].serialNo);
        }
      }, function (error) {
        $log.error(error);
      });
    };

    var _setCommentReadFlag = function(taskId) {
      for(var i in cache.nm_comment) {
        if(cache.nm_comment[i].correlationId == taskId) {
          NoticeMessageService.setReadFlagBySerialNo(cache.nm_comment[i].serialNo);
          cache.nm_comment.splice(i, 1);
          break;
        }
      }
    };

    var _observeNoticeMessage = function() {
      var taskNoticeMessageMonitor = {
        onNotify: _onNotifyNoticeMessage
      }
      NoticeMessageService.registerObserver(taskNoticeMessageMonitor);
    };

    return {
      postTask: _postTask,
      acceptTask: _acceptTask,
      cancelByAcceptor: _cancelByAcceptor,
      cancelByPoster: _cancelByPoster,
      completeByAcceptor: _completeByAcceptor,
      confirmByPoster: _confirmByPoster,
      commentByPoster: _commentByPoster,
      commentByAcceptor: _commentByAcceptor,
      queryTaskInfo: _queryTaskInfo,
      getAcceptTaskList: _getAcceptTaskList,
      getCompletedAcceptTaskList:_getCompletedAcceptTaskList,
      getUncompletedAcceptTaskList:_getUncompletedAcceptTaskList,
      getPostTaskList: _getPostTaskList,
      getCompletedPostTaskList:_getCompletedPostTaskList,
      getUncompletedPostTaskList:_getUncompletedPostTaskList,
      getTaskList:_getTaskList,
      commentTask: _commentTask,
      getTaskSharePage: _getTaskSharePage,
      queryNewTaskList: _queryNewTaskList,
      uploadTaskCommentImgByPoster:_uploadTaskCommentImgByPoster,
      uploadTaskCommentImgByAcceptor:_uploadTaskCommentImgByAcceptor,
      uploadTaskCommentAudioByPoster:_uploadTaskCommentAudioByPoster,
      uploadTaskCommentAudioByAceptor:_uploadTaskCommentAudioByAcceptor,
      getWaitingTaskList:getWaitingTaskList,

      //cache
      cache: cache,

      //util get
      getTaskInNearList: _getTaskInNearList,
      queryTaskInNearList: _queryTaskInNearList,  // 暂时不用
      getTaskInPostList: _getTaskInPostList,
      getTaskInAcceptList: _getTaskInAcceptList,

      // notice message
      fetchNoticeMessage: _fetchNoticeMessage,
      observeNoticeMessage: _observeNoticeMessage,
      setCommentReadFlag: _setCommentReadFlag
    };
  }
})();
