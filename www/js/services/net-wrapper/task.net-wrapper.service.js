/**
 * Created by Midstream on 16/7/20.
 */

(function () {
  'use strict'

  angular.module('app.netwrapper.service')

    .factory('taskNetWrapper', ['$rootScope', '$timeout', 'taskNetService', '$ionicLoading', 'taskUtils', 'promptService',
      'NoticeMessageService','userNetService',
      function ($rootScope, $timeout, taskNetService, $ionicLoading, taskUtils, promptService,
                NoticeMessageService, userNetService) {

        return {
          acceptTask: acceptTask,
        };

        function acceptTask(task, cb_success, cb_fail) {

          $ionicLoading.show();
          taskNetService.acceptTask(task.id).then(
            function (data) {
              NoticeMessageService.addLocalUnreadMessage(task.id, NoticeMessageService.NOTICE_TYPE.ACCEPTER_UNCOMPLETED_TASK_MESSAGE_TYPE, '成功接单');
              if (taskNetService.cache.nm_acceptGoing == null) {
                taskNetService.cache.nm_acceptGoing = new Array();
              }
              taskNetService.cache.nm_acceptGoing.push(
                NoticeMessageService.createLocalUnreadMessage(task.id, NoticeMessageService.NOTICE_TYPE.ACCEPTER_UNCOMPLETED_TASK_MESSAGE_TYPE, '成功接单'));

              //成功
              $ionicLoading.show({
                duration: 1500,
                templateUrl: 'modules/components/templates/ionic-loading/task-accept-success.html'
              });
              //
              ////从我的关注,粉丝 的任务列表中移除
              //var friends = userNetService.cache.selfInfo.attentionList;
              //for (var i in friends) {
              //  friends[i].recentTaskIdArray[]
              //}

              //friends = userNetService.cache.selfInfo.funsList;
              //for (var i in friends) {
              //  userUtils.uiProcessFollowed(friends[i]);
              //}

              //
              $timeout(function () {

                //接物品,提示出示证件
                if (taskUtils.mainByTypeValue(task.taskTypesId) == 2) {
                  $ionicLoading.show({
                    duration: 2000,
                    template: '请记录对方出示的学生证以防欺诈'
                  });
                  $timeout(function () {
                    taskNetService.cache.isNearTaskNeedRefresh = true;
                    taskNetService.cache.isAcceptTaskGoingNeedRefresh = true;
                    taskNetService.cache.nm_main_changed = true;
                    taskNetService.cache.nm_task_changed = true;
                    taskNetService.cache.isSelfInfoNeedRefresh = true;
                    if (cb_success) {
                      cb_success();
                    }
                  }, 1500);

                } else {
                  taskNetService.cache.isNearTaskNeedRefresh = true;
                  taskNetService.cache.isAcceptTaskGoingNeedRefresh = true;
                  taskNetService.cache.nm_main_changed = true;
                  taskNetService.cache.nm_task_changed = true;
                  taskNetService.cache.isSelfInfoNeedRefresh = true;
                  if (cb_success) {
                    cb_success();
                  }
                }

              }, 1500);

            },
            function (err) {
              ////失败
              //$ionicLoading.show({
              //  duration: 1500,
              //  templateUrl: 'modules/components/templates/ionic-loading/task-not-exist.html'
              //});
              promptService.promptErrorInfo(err, 1500);
              $timeout(function () {
                taskNetService.cache.isNearTaskNeedRefresh = true;
              }, 1500);

            }).finally(function () {
              console.log('accept taskid=' + task.id);
            });
        }
      }]);
})();
