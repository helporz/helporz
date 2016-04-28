/**
 * Created by Midstream on 16/3/29.
 */

(function () {
    'use strict';

    angular.module('main.task')
      .controller('mainTaskCtrl', ['$log', '$ionicLoading', '$scope', 'taskNetService', 'taskUtils', mainTaskCtrl]);

    function mainTaskCtrl($log, $ionicLoading, $scope, taskNetService, taskUtils) {
      var vm = $scope.vm = {};

      //test:
      $scope.items = [];
      for (var i = 0; i < 100; i++)
        $scope.items.push("line " + i);

      vm.isFirstIn = true;

      vm.doRefresh = function () {
        taskNetService.queryNewTaskList().then(flushSuccessFn, flushFailedFn).finally(function () {
          $scope.$broadcast('scroll.refreshComplete');
        });
      };

      $scope.$on("$ionicView.beforeEnter", function () {
        if (vm.isFirstIn) {
          vm.isFirstIn = false;

          //   $ionicLoading.show({
          //     template:'加载数据中...'
          //   });
          //
          //   taskNetService.queryNewTaskList().then(flushSuccessFn,flushFailedFn).finally(function() {
          //     $ionicLoading.hide();
          //   });
          //}
        }
      });


      vm.cb_post = function() {
        console.log('post');
        vm.tabSelectedIndex = 0;
      }

      vm.cb_accept = function() {
        console.log('accept');
        vm.tabSelectedIndex = 1;
      }

      //////////////////////////////////////////////////
      vm.postList = [
        1,2,3,4,5,6,7
      ]
      vm.acceptList = [
        1,2,3,4,5,6,7
      ]

    }
  })
()
