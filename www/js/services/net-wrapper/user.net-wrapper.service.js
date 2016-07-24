/**
 * Created by Midstream on 16/7/22.
 */

(function () {
  'use strict'

  angular.module('app.netwrapper.service')

    .factory('userNetWrapper', ['$rootScope', '$timeout', 'userNetService', 'taskNetService', '$ionicLoading', 'taskUtils', 'promptService',
      'NoticeMessageService', 'userUtils',
      function ($rootScope, $timeout,userNetService, taskNetService, $ionicLoading, taskUtils, promptService,
                NoticeMessageService, userUtils) {

        return {
          refreshSelfInfo: refreshSelfInfo,
        };

        function refreshSelfInfo(cb_success, cb_fail) {

          $ionicLoading.show();
          userNetService.getSelfInfoForPromise().then(
            function () {

              // pre-calculate ui data
              var friends = userNetService.cache.selfInfo.attentionList;
              for (var i in friends) {
                userUtils.uiProcessFollow(friends[i]);
              }

              friends = userNetService.cache.selfInfo.funsList;
              for (var i in friends) {
                userUtils.uiProcessFollowed(friends[i]);
              }

              // then invoke callback
              if (cb_success) {
                cb_success();
              }

              $ionicLoading.hide();

            },
            function (err) {
              promptService.promptErrorInfo(err, 1500);
              //$timeout(function () {
              //  taskNetService.cache.isNearTaskNeedRefresh = true;
              //}, 1200);
              if (cb_fail) {
                cb_fail();
              }

            }).finally(function () {
              taskNetService.cache.isSelfInfoNeedRefresh = false;
            });
        }
      }]);
})();
