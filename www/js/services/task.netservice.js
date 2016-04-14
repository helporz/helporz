/**
 * Created by binfeng on 16/4/9.
 */

;(
  function() {
    'use strict'
   angular.module('com.helporz.task.netservice',[]).factory('taskNetService',['$q','$log','httpBaseService',
     'errorCodeService','httpErrorCodeService',TaskNetServiceFactoryFn]);

    function TaskNetServiceFactoryFn($q,$log,httpBaseService,errorCodeService,httpErrorCodeService) {

      var _postTask  = function(type,summary,pubLocation,startTime,deadLine,posterLong,
                                posterLat,rewardType,rewardSubType,rewardCount,payMethodType) {
        var taskInfo = {
         taskType:type,
         summary:summary,
         pubLocation:pubLocation,
         startTime:startTime,
         deadLine:deadLine,
         posterLong:posterLong,
         posterLat:posterLat,
         rewardType:rewardType,
         rewardSubType:rewardSubType,
         rewardCount:rewardCount,
         payMethodType:payMethodType,
        };
        return httpBaseService.postForPromise('/task/post/v2',data);
      };

      var _acceptTask = function(taskId) {
          return httpBaseService.postForPromise('/task/' + taskId + '/accept',null);
      };

      var _cancelByAcceptor = function (taskId) {
          return httpBaseService.postForPromise('/task/' + taskId +'/cancel_by_accepter',null);
      }

      var _cancelByPoster = function(taskId) {
          return httpBaseService.postForPromise('/task/'+ taskId + '/cancel_by_poster',null);
      }

      var _completeByAcceptor = function(taskId) {
        return httpBaseService.postForPromise('/task/'+ taskId + '/complete',null);
      }

      var _confirmByPoster = function(taskId,status,commentLevel,comment) {
        var data = {
          status :status,
          level:level,
          comment:comment
        };
        return httpBaseService.postForPromise('/task/'+ taskId + '/confirm_by_poster',data);
      }

      var _commentByPoster = function(taskId,commentLevel,comment,tagList) {
        var data = {
          level:level,
          comment:comment,
          tags:tagList
        };
        return httpBaseService.postForPromise('/task/' + taskId + '/comment_by_poster',data);
      }

      var _commentByAcceptor = function(taskId,commentLevel,comment,tagList) {
        var data = {
          level :level,
          comment:comment,
          tags:tagList
        };

        return httpBaseService.postForPromise('/task/' + taskId + '/comment_by_accepter' ,data);
      }

      var _queryNewTaskList = function() {
        return httpBaseService.getForPromise('/task/query/random/new',null);
      };

      var _getTaskInfo = function(taskId) {
        return httpBaseService.getForPromise('/task/' + taskId + '/detail',null);
      };



      var _getAcceptTaskList = function(pageIndex,pageSize) {
          var params = {
            pageIndex:pageIndex,
            pageSize:pageSize
          };
        return httpBaseService.getForPromise('/task/query/accepted',params);
      }

      var _getPostTaskList = function(pageIndex,pageSize) {
        var params = {
          pageIndex:pageIndex,
          pageSize:pageSize
        };

        return httpBaseService.getForPromise('/task/query/posted',params);
      }

      var _commentTask = function(taskId,comment) {
        var data = {
          comment:comment
        };

        return httpBaseService.postForPromise('/task/' + taskId + '/comment',data);
      }
      var _getTaskSharePage = function(taskId) {
        return httpBaseService.getForPromise('/task/' + taskId + '/share_page',null);
      }

      return {
        postTask:_postTask,
        acceptTask:_acceptTask,
        cancelByAcceptor:_cancelByAcceptor,
        cancelByPoster:_cancelByPoster,
        completeByAcceptor:_completeByAcceptor,
        confirmByPoster:_confirmByPoster,
        commentByPoster:_commentByPoster,
        commentByAcceptor:_commentByAcceptor,
        getTaskInfo:_getTaskInfo,
        getAcceptTaskList:_getAcceptTaskList,
        getPostTaskList:_getPostTaskList,
        commentTask:_commentTask,
        getTaskSharePage:_getTaskSharePage,
        queryNewTaskList:_queryNewTaskList,
      };
    }
  }
)();