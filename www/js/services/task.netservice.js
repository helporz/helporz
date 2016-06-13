/**
 * Created by binfeng on 16/4/9.
 */

;
(function () {
  'use strict'
  angular.module('com.helporz.task.netservice', []).factory('taskNetService', ['$q', '$log', 'httpBaseService',
    'errorCodeService', 'httpErrorCodeService','uploadService','userLoginInfoService', TaskNetServiceFactoryFn]);

  function TaskNetServiceFactoryFn($q, $log, httpBaseService, errorCodeService, httpErrorCodeService,uploadService,userLoginInfoService) {

    // cache
    var cache = {

      isNearTaskNeedRefresh: true,
      nearTaskList: [],

      isPostTaskNeedRefresh: true,
      postTaskList: [],
      isAcceptTaskNeedRefresh: true,
      acceptTaskList: [],


      isPostTaskGoingRefresh: true,
      postTaskGoingList: [],
      isPostTaskFinishRefresh: true,
      postTaskFinishList: [],

      isAcceptTaskGoingRefresh: true,
      acceptTaskGoingList: [],
      isAcceptTaskFinishRefresh: true,
      acceptTaskFinishList: [],
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
              var imgPromise = _uploadTaskCommentImgByPoster(vm.taskId,imgList[imgIndex]);
              if( imgPromise != null ) {
                promiseArray.push(imgPromise);
              }
            }
          }

          if( audioList.length > 0) {
            for( var audioIndex = 0; audioIndex < audioList.length; ++audioIndex) {
              var audioPromise = _uploadTaskCommentAudioByPoster(vm.taskId,audioList[audioIndex]);
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
              var imgPromise = _uploadTaskCommentImgByAcceptor(vm.taskId,imgList[imgIndex]);
              if( imgPromise != null ) {
                promiseArray.push(imgPromise);
              }
            }
          }

          if( audioList.length > 0) {
            for( var audioIndex = 0; audioIndex < audioList.length; ++audioIndex) {
              var audioPromise = _uploadTaskCommentAudioByAcceptor(vm.taskId,audioList[audioIndex]);
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

    var _queryNewTaskList = function () {
      return httpBaseService.getForPromise('/task/query/random/new', null);
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
    var _getTaskInPostList = function (taskId) {
      if (cache.postTaskList) {
        for (var i = 0; i < cache.postTaskList.length; i++) {
          if (cache.postTaskList[i].id == taskId) {
            return cache.postTaskList[i];
          }
        }
        return null;
      }
      return null;
    };
    var _getTaskInAcceptList = function (taskId) {
      if (cache.acceptTaskList) {
        for (var i = 0; i < cache.acceptTaskList.length; i++) {
          if (cache.acceptTaskList[i].id == taskId) {
            return cache.acceptTaskList[i];
          }
        }
        return null;
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

    var _getPostTaskList = function (pageIndex, pageSize) {
      var params = {
        pageIndex: pageIndex,
        pageSize: pageSize
      };

      return httpBaseService.getForPromise('/task/query/posted', params);
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
      getPostTaskList: _getPostTaskList,
      commentTask: _commentTask,
      getTaskSharePage: _getTaskSharePage,
      queryNewTaskList: _queryNewTaskList,
      uploadTaskCommentImgByPoster:_uploadTaskCommentImgByPoster,
      uploadTaskCommentImgByAcceptor:_uploadTaskCommentImgByAcceptor,
      uploadTaskCommentAudioByPoster:_uploadTaskCommentAudioByPoster,
      uploadTaskCommentAudioByAceptor:_uploadTaskCommentAudioByAcceptor,
      //cache
      cache: cache,

      //util get
      getTaskInNearList: _getTaskInNearList,
      getTaskInPostList: _getTaskInPostList,
      getTaskInAcceptList: _getTaskInAcceptList
    };
  }
})();
