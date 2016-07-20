/**
 * Created by Midstream on 16/7/20.
 */

(function () {
  'use strict'

  angular.module('app.netwrapper.service')

    .factory('taskNetWrapper', ['$rootScope', '$timeout', 'taskNetService', '$ionicLoading','taskUtils',
      function ($rootScope, $timeout, taskNetService, $ionicLoading, taskUtils) {

        return {
          acceptTask: acceptTask
        };

        function acceptTask(task, cb_success, cb_fail) {

          $ionicLoading.show();
          taskNetService.acceptTask(task.id).then(
            function (data) {

              //成功
              $ionicLoading.show({
                duration: 1500,
                templateUrl: 'modules/components/templates/ionic-loading/task-accept-success.html'
              });
              $timeout(function () {


                //接物品,提示出示证件
                if(taskUtils.mainByTypeValue(task.taskTypesId) == 2){
                  $ionicLoading.show({
                    duration: 2000,
                    template: '请记录对方出示的学生证以防欺诈'
                  });
                  $timeout(function() {
                    taskNetService.cache.isNearTaskNeedRefresh = true;
                    taskNetService.cache.isAcceptTaskGoingNeedRefresh = true;
                    if(cb_success) {
                      cb_success();
                    }
                  }, 1500);

                }else{
                  taskNetService.cache.isNearTaskNeedRefresh = true;
                  taskNetService.cache.isAcceptTaskGoingNeedRefresh = true;
                  if (cb_success) {
                    cb_success();
                  }
                }

              }, 1500);

            },
            function () {
              //失败
              $ionicLoading.show({
                duration: 1500,
                templateUrl: 'modules/components/templates/ionic-loading/task-not-exist.html'
              });
              $timeout(function () {
                taskNetService.cache.isNearTaskNeedRefresh = true;
              }, 1200);

            }).finally(function () {
              console.log('accept taskid=' + task.id);
            });
        }
      }]);
})();
