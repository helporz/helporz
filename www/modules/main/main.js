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
      .state('main.near_user-info', {
        url: '/near/user-info/:id',
        views: {
          'near': {
            templateUrl: 'modules/main/details/user-info/user-info.html',
            controller: 'mainUserInfoCtrl'
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
      .state('main.topic-group_user-info', {
        url: '/topic-group/user-info/:id',
        views: {
          'topic-group': {
            templateUrl: 'modules/main/details/user-info/user-info.html',
            controller: 'mainUserInfoCtrl'
          }
        }
      })
      .state('main.topic-group_topic-detail', {
        url: '/topic-group/topic-detail/{topicId}',
        views: {
          'topic-group': {
            templateUrl: 'modules/main/playground/templates/topic-detail.html',
            controller: 'topicDetailController'
          }
        }
      })
      .state('main.topic-group_own-topic-list', {
        url: '/topic-group/own-topic-list',
        views: {
          'topic-group': {
            templateUrl: 'modules/main/playground/templates/own-topic-list.html',
            controller: 'ownTopicListController'
          }
        }
      })
      .state('main.topic-group_collection-topic-list', {
        url: '/topic-group/collection-topic-list',
        views: {
          'topic-group': {
            templateUrl: 'modules/main/playground/templates/collection-topic-list.html',
            controller: 'collectionTopicListController'
          }
        }
      })
      .state('main.topic-group_my-comment-list', {
        url: '/topic-group/my-comment-list',
        views: {
          'topic-group': {
            templateUrl: 'modules/main/playground/templates/my-comment-list.html',
            controller: 'myCommentListController'
          }
        }
      })
      .state('main.topic-group_my-message-list', {
        url: '/topic-group/my-message-list',
        views: {
          'topic-group': {
            templateUrl: 'modules/main/playground/templates/my-message-list.html',
            controller: 'myMessageListController'
          }
        }
      })
      .state('main.topic-group_comment-session', {
        url: '/topic-group/comment-session/{sessionId}',
        views: {
          'topic-group': {
            templateUrl: 'modules/main/playground/templates/comment-session.html',
            controller: 'commentSessionController'
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
      .state('main.near_im', {
        url: '/near/im',
        views: {
          'near': {
            templateUrl: 'modules/im/list.html',
            controller: 'imMessageListController',
          }
        }
      })
      .state('main.task_im', {
        url: '/task/im',
        views: {
          'task': {
            templateUrl: 'modules/im/list.html',
            controller: 'imMessageListController',
          }
        }
      })
      .state('main.topic-group_im', {
        url: '/topic-group/im',
        views: {
          'topic-group': {
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
      .state('main.me_im-detail', {
        url:'/me/im-detail/{cid}',
        views: {
          'me': {
            templateUrl:'modules/im/detail.html',
            controller:'imMessageDetailController',
          }
        }
      })
      .state('main.near_im-detail', {
        url:'/near/im-detail/{cid}',
        views: {
          'near': {
            templateUrl:'modules/im/detail.html',
            controller:'imMessageDetailController',
          }
        }
      })
      .state('main.topic-group_im-detail', {
        url:'/topic-group/im-detail/{cid}',
        views: {
          'topic-group': {
            templateUrl:'modules/im/detail.html',
            controller:'imMessageDetailController',
          }
        }
      })
      .state('main.task_im-detail', {
        url:'/task/im-detail/{cid}',
        views: {
          'task': {
            templateUrl:'modules/im/detail.html',
            controller:'imMessageDetailController',
          }
        }
      })
      .state('main.me_user-info', {
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
        url: '/me/user-tasks/{userId}/{nickname}',
        views: {
          'me': {
            templateUrl: 'modules/main/details/user-tasks/user-tasks.html',
            controller: 'mainUserTasksCtrl'
          }
        }
      })
      .state('main.near_user-tasks', {
        url: '/near/user-tasks/{userId}/{nickname}',
        views: {
          'near': {
            templateUrl: 'modules/main/details/user-tasks/user-tasks.html',
            controller: 'mainUserTasksCtrl'
          }
        }
      })
      .state('main.topic-group_user-tasks', {
        url: '/topic-group/user-tasks/{userId}/{nickname}',
        views: {
          'topic-group': {
            templateUrl: 'modules/main/details/user-tasks/user-tasks.html',
            controller: 'mainUserTasksCtrl'
          }
        }
      })
      .state('main.task_user-tasks', {
        url: '/task/user-tasks/{userId}/{nickname}',
        views: {
          'task': {
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
      .state('main.near_user-tasks_task-detail', {
        url: '/near/user-tasks/task-detail/:id',
        views: {
          'near': {
            templateUrl: 'modules/main/near/task-detail/task-detail.html',
            controller: 'mainNearTaskDetailCtrl'
          }
        }
      })
      .state('main.topic-group_user-tasks_task-detail', {
        url: '/topic-group/user-tasks/task-detail/:id',
        views: {
          'topic-group': {
            templateUrl: 'modules/main/near/task-detail/task-detail.html',
            controller: 'mainNearTaskDetailCtrl'
          }
        }
      })
      .state('main.task_user-tasks_task-detail', {
        url: '/task/user-tasks/task-detail/:id',
        views: {
          'task': {
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
      .state('main.task_user-info', {
        url: '/task/user-info/:id',
        views: {
          'task': {
            templateUrl: 'modules/main/details/user-info/user-info.html',
            controller: 'mainUserInfoCtrl'
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
        url: '/task/task-detail/:id',
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

  mainRun.$inject = ['$log','$ionicPlatform', '$ionicPopup', '$rootScope', '$location','$ionicHistory','$ionicLoading'];
  function mainRun($log,$ionicPlatform, $ionicPopup, $rootScope, $location,$ionicHistory,$ionicLoading) {
    var exitClickTime = null;
    function showConfirm() {
      var popupScope = $rootScope.$new();

      popupScope.cancel = function() {

      };
      popupScope.exit = function() {
        ionic.Platform.exitApp();
      }
      var exitConfirmPopup = $ionicPopup.show(
        {
          templateUrl: 'modules/exit-confirm-popup.html',
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
        || $location.path() === '/main/task' || $location.path() === '/main/topic-group' || $location.path() === '/login') {
        //showConfirm();
        var currentDate = new Date().getTime();
        if( exitClickTime == null ||  currentDate - exitClickTime > 3000 ) {
          exitClickTime = currentDate;
          $ionicLoading.hide();
          $ionicLoading.show({
            duration: 1000,
            template: '再按一次将退出大侠拜托',
          });
          $timeout(function () {
            $ionicLoading.hide();
            $state.go('login');
          }, 2000);
        }
        else {
          ionic.Platform.exitApp();
        }

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
