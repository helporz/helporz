/**
 * Created by Midstream on 16/3/29.
 */

(function () {
    'use strict';

    angular.module('main.task')
      .controller('mainTaskCtrl', ['$log', '$state', '$ionicLoading', '$scope', 'taskNetService', 'taskUtils', mainTaskCtrl]);

    function mainTaskCtrl($log, $state, $ionicLoading, $scope, taskNetService, taskUtils) {
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
        //if (vm.isFirstIn) {
        //  vm.isFirstIn = false;
        //
        //  $ionicLoading.show({
        //    template:'加载数据中...'
        //  });
        //
        //  taskNetService.getPostTaskList().then(cb_success,cb_failed).finally(function() {
        //    $ionicLoading.hide();
        //  });
        //}

        function cb_success(taskList){

        }
        function cb_failed(error) {
          alert(error);
        }
      });


      vm.cb_post = function() {
        console.log('post');
        vm.tabSelectedIndex = 0;

        vm.repeatList = vm.postList;
      }

      vm.cb_accept = function() {
        console.log('accept');
        vm.tabSelectedIndex = 1;

        vm.repeatList = vm.acceptList;
      }

      //////////////////////////////////////////////////

      vm.postList = [
        {
          state: 0
        },{
          state: 1
        },{
          state: 2
        }
      ]
      vm.acceptList = [
        {
          state: 0
        },{
          state: 1
        },{
          state: 2
        },
        {
          state: 0
        },{
          state: 1
        },{
          state: 2
        },
        {
          state: 0
        },{
          state: 1
        },{
          state: 2
        },
        {
          state: 0
        },{
          state: 1
        },{
          state: 2
        }
      ]

      vm.repeatList = vm.postList;

      vm.cb_click = function() {
        console.log('click');
      }
      vm.stateType = 1;


      //////////////////////////////////////////////////
      vm.opt_comment = function(){
        $state.go('main.comment');
      }


    }
  })
()
