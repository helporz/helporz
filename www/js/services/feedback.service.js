/**
 * Created by binfeng on 16/7/18.
 */
(function () {
  angular.module('com.helporz.utils.service').factory(
    'feedbackService', feedbackServiceFn
  );

  feedbackServiceFn.$inject = ['httpBaseService'];
  function feedbackServiceFn(httpBaseService) {
    var feedback = function (msg) {
      var param = {
        msg: msg,
      }
      return httpBaseService.postForPromise('/message/feedback', param);
    }

    var reportTask = function (taskId,type, msg) {
      var param = {
        type: type,
        desc: msg,
      }
      return httpBaseService.postForPromise('/report/task/' + taskId, param);
    }

    var reportUser = function (userId,type, msg) {
      var param = {
        type: type,
        desc: msg,
      }
      return httpBaseService.postForPromise('/report/user/' + userId, param);
    }

    return {
      feedback: feedback,
      reportTask: reportTask,
      reportUser: reportUser,
    }
  }
})();
