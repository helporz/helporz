/**
 * Created by Midstream on 16/3/30.
 */

(function () {
  "use strict";

  angular.module('main', [
    'ionic',
    'main.near',
    'main.post',
    'main.task',
    'main.me',
    'com.helporz.task.publish',
    'impress.utils.service',
    'com.helporz.playground',
    'com.helporz.im',
    'interval.service'
  ]).config(mainConfig).controller('mainController', mainControllerFn).run(mainRun);

  mainControllerFn.$inject = ['$scope', '$ionicModal', 'taskPublishModalService',
    'taskNetService', 'intervalCenter', '$ionicTabsDelegate', '$timeout'];
  function mainControllerFn($scope, $ionicModal, taskPublishModalService,
                            taskNetService, intervalCenter, $ionicTabsDelegate, $timeout) {
    var vm = $scope.vm = {};
    $ionicModal.fromTemplateUrl('modules/main/task-publish/modal-list.html', {
      scope: $scope,
      animation: "slide-in-up"
    }).then(function (modal) {
      $scope.vm.publishListModal = modal;
      taskPublishModalService.setListModal(modal);
    });

    $scope.vm.showPublishList = function () {
      $scope.vm.publishListModal.show();
    }

    vm.ui_taskBadge = 0;
    vm.ui_meBadge = 0;

    $scope.$on("$ionicView.enter", function () {
      //刷新tab标签数
      intervalCenter.add(0, 'main', function(){
        var cache = taskNetService.cache;
        if(cache.nm_main_changed) {
          cache.nm_main_changed = false;
					vm.ui_taskBadge = cache.nm_acceptGoing.length +
                          cache.nm_acceptFinish.length +
													cache.nm_postGoing.length +
                          cache.nm_postFinish.length +
													cache.nm_comment.length;

          vm.ui_meBadge = cache.nm_follow.length;

					$timeout(function(){
						$scope.$apply();
					})
        }
      });

    });

    $scope.$on('$ionicView.leave', function() {
      //切换tab时,这里会走到..(我觉得是ionic的bug),只当他为第一个tab时,会$ionicView.enter,切换到非第一个tab,$ionic.leave.
      //intervalCenter.remove(0, 'main');
    })
  }

  mainConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider'];

  function mainConfig($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $stateProvider
      .state('main', {
        url: '/main',
        abstract: true,
        templateUrl: 'modules/main/main.html',
        controller: 'mainController'
      })

      .state('main.near', {
        url: '/near',
        views: {
          'near': {
            templateUrl: 'modules/main/near/near.html',
            controller: 'mainNearCtrl'
          }
        }
      })
      .state('main.task-detail', {
        url: '/near/task-detail/:id',
        views: {
          'near': {
            templateUrl: 'modules/main/near/task-detail/task-detail.html',
            controller: 'mainNearTaskDetailCtrl'
          }
        }
      })

      .state('main.topic-group', {
        url: '/topic-group',
        views: {
          'topic-group': {
            templateUrl: 'modules/main/playground/templates/topic-group.html',
            controller: 'topicGroupController'
          }
        }
      })

      .state('main.me', {
        url: '/me',
        views: {
          'me': {
            templateUrl: 'modules/main/me/me.html',
            controller: 'mainMeCtrl'
          }
        }
      })

      .state('main.im', {
        url: '/me/im',
        views: {
          'me': {
            templateUrl: 'modules/im/list.html',
            controller: 'imMessageListController',
          }
        }
      })
      .state('main.im-detail', {
        url:'/me/im-detail/{cid}',
        views: {
          'me': {
            templateUrl:'modules/im/detail.html',
            controller:'imMessageDetailController',
          }
        }
      })
      .state('main.user-info', {
        //url: '/me/{id:[s+]}',
        url: '/me/:id',
        views: {
          'me': {
            templateUrl: 'modules/main/details/user-info/user-info.html',
            controller: 'mainUserInfoCtrl'
          }
        }
      })

      .state('main.edit', {
        url: '/me/edit',
        views: {
          'me': {
            templateUrl: 'modules/main/me/edit/edit.html',
            controller: 'mainEditCtrl'
          }
        }
      })

      .state('main.setting', {
        url: '/me/setting',
        views: {
          'me': {
            templateUrl: 'modules/main/me/setting/setting.html',
            controller: 'mainSettingCtrl'
          }
        }
      })

      .state('main.edit-sheet', {
        url: '/me/edit-sheet',
        views: {
          'me': {
            templateUrl: 'modules/main/details/edit-sheet/edit-sheet.html',
            controller: 'mainEditSheetCtrl'
          }
        }
      })

      .state('main.about', {
        url: '/me/setting/about',
        views: {
          'me': {
            templateUrl: 'modules/main/details/about/about.html'
          }
        }
      })

      .state('main.me_user-tasks', {
        url: '/me/user-tasks',
        views: {
          'me': {
            templateUrl: 'modules/main/details/user-tasks/user-tasks.html',
            controller: 'mainUserTasksCtrl'
          }
        }
      })
      .state('main.me_user-tasks_task-detail', {
        url: '/me/user-tasks/task-detail/:id',
        views: {
          'me': {
            templateUrl: 'modules/main/near/task-detail/task-detail.html',
            controller: 'mainNearTaskDetailCtrl'
          }
        }
      })

      .state('main.task', {
        url: '/task',
        views: {
          'task': {
            templateUrl: 'modules/main/task/task.html',
            controller: 'mainTaskCtrl'
          }
        }
      })

      .state('main.comment', {
        url: '/task/comment/:desc',
        views: {
          'task': {
            templateUrl: 'modules/main/task/comment/comment.html',
            controller: 'mainCommentCtrl'
          }
        }
      })

      .state('main.task-state', {
        url: '/task/task-state/:id',
        views: {
          'task': {
            templateUrl: 'modules/main/task/task-state/task-state.html',
            controller: 'mainTaskTaskStateCtrl'
          }
        }
      })

      .state('main.task_task-detail', {
        url: '/task/task-state/:id',
        views: {
          'task': {
            templateUrl: 'modules/main/near/task-detail/task-detail.html',
            controller: 'mainNearTaskDetailCtrl'
          }
        }
      })

    ;

    //tab位置设置到下面
    $ionicConfigProvider.tabs.position('bottom')
  }

  mainRun.$inject = ['$log','$ionicPlatform', '$ionicPopup', '$rootScope', '$location','$ionicHistory'];
  function mainRun($log,$ionicPlatform, $ionicPopup, $rootScope, $location,$ionicHistory) {

    function showConfirm() {
      var popupScope = $rootScope.$new();

      popupScope.cancel = function() {

      };
      popupScope.exit = function() {
        ionic.Platform.exitApp();
      }
      var exitConfirmPopup = $ionicPopup.show(
        {
          templateUrl: 'modules//exit-confirm-popup.html',
          title: null,
          subTitle: null,
          scope: popupScope
        }
      );

      //var confirmPopup = $ionicPopup.confirm({
      //  title: '<strong>退出应用?</strong>',
      //  template: '你确定要退出应用吗?',
      //  okText: '退出',
      //  cancelText: '取消'
      //});
      //
      //confirmPopup.then(function (res) {
      //  if (res) {
      //    ionic.Platform.exitApp();
      //  } else {
      //    // Don't close
      //  }
      //});
    }

    //$rootScope.showConfirm = showConfirm;
    //主页面显示退出提示框
    $ionicPlatform.registerBackButtonAction(function (e) {

      e.preventDefault();



      $log.info('current location:' + $location.path());
      // Is there a page to go back to?
      if ($location.path() === '/main/near' || $location.path() === '/main/me'
        || $location.path() === '/main/task' || $location.path() === '/main/topic-group') {
        //showConfirm();
        ionic.Platform.exitApp();
      } else if ($ionicHistory.backView()) {
        console.log('currentView:', $ionicHistory.currentView);
        // Go back in history
        $ionicHistory.goBack();
      } else {
        // This is the last page: Show confirmation popup
        //showConfirm();
        ionic.Platform.exitApp();
      }

      return false;
    }, 101);
  }

})()
