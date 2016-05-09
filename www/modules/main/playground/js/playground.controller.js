/**
 * Created by binfeng on 16/4/22.
 */

(function () {
  'use strict';
  angular.module('com.helporz.playground')
    .controller('topicGroupController', topicGroupControllerFn)
    .controller('topicDetailController', topicDetailControllerFn)
    .controller('topicPublishController', topicPublishControllerFn)
    .controller('playgroundListController', playgroundListControllerFn);

  playgroundListControllerFn.$inject = ['$scope', '$state', '$log', 'topicGroupService'];
  function playgroundListControllerFn($scope, $state, $log, topicGroupService) {
    var vm = $scope.vm = {};
    vm.gotoGroup = function (groupId) {
      $state.go('topic-group', {'groupId': groupId});
    }

    vm.slideList = [{
      'groupId': 1,
      'pic': 'img/intro/jieshao1@2x.png'
    }, {
      'groupId': 2,
      'pic': 'img/intro/jieshao2@2x.png'
    }, {
      'groupId': 3,
      'pic': 'img/intro/jieshao3@2x.png'
    }, {
      'groupId': 4,
      'pic': 'img/intro/jieshao4@2x.png'
    }];
    vm.groupList = topicGroupService.getGroupInfoList();
    //[{
    //  'id': 1,
    //  'name': '捎带侠论坛',
    //  'description': '捎带侠们聚集起来',
    //  'pic': 'img/task/publish/shaodai-logo.png'
    //}, {
    //  'id': 2,
    //  'name': '情报侠论坛',
    //  'description': '情报侠们聚集起来',
    //  'pic': 'img/task/publish/qingbao-logo.png'
    //}, {
    //  'id': 3,
    //  'name': '借宝侠论坛',
    //  'description': '借宝侠们聚集起来',
    //  'pic': 'img/task/publish/jiebao-logo.png'
    //}, {
    //  'id': 1,
    //  'name': '捎带侠论坛',
    //  'description': '捎带侠们聚集起来',
    //  'pic': 'img/task/publish/shaodai-logo.png'
    //}, {
    //  'id': 2,
    //  'name': '情报侠论坛',
    //  'description': '情报侠们聚集起来',
    //  'pic': 'img/task/publish/qingbao-logo.png'
    //}, {
    //  'id': 3,
    //  'name': '借宝侠论坛',
    //  'description': '借宝侠们聚集起来',
    //  'pic': 'img/task/publish/jiebao-logo.png'
    //}, {
    //  'id': 1,
    //  'name': '捎带侠论坛',
    //  'description': '捎带侠们聚集起来',
    //  'pic': 'img/task/publish/shaodai-logo.png'
    //}, {
    //  'id': 2,
    //  'name': '情报侠论坛',
    //  'description': '情报侠们聚集起来',
    //  'pic': 'img/task/publish/qingbao-logo.png'
    //}, {
    //  'id': 3,
    //  'name': '借宝侠论坛',
    //  'description': '借宝侠们聚集起来',
    //  'pic': 'img/task/publish/jiebao-logo.png'
    //}];

  }

  topicGroupControllerFn.$inject = ['$scope', '$stateParams', '$state', '$log', '$timeout', '$ionicActionSheet',
    '$ionicPopover', '$ionicModal', 'topicService', 'topicGroupService', 'filterTopicService', 'topicBlacklistService',
    'favouriteTopicService', 'topicModalService'];
  function topicGroupControllerFn($scope, $stateParams, $state, $log, $timeout, $ionicActionSheet,
                                  $ionicPopover, $ionicModal, topicService, topicGroupService, filterTopicService,
                                  topicBlacklistService, favouriteTopicService, topicModalService) {
    var vm = $scope.vm = {};
    vm.groupId = $stateParams.groupId;
    vm.topicGroup = topicGroupService.getGroupInfo(vm.groupId);

    vm.sysTopicList = topicService.getSysTopicList(vm.groupId);
    vm.userTopicList = topicService.getTopicList(vm.groupId);

    //$scope.$on('$stateChangeSuccess', function () {
    //  vm.loadMore();
    //});
    vm.moreDataCanBeLoaded = function () {
      if (vm.userTopicList != null) {
        return true;
      }
      else {
        return false;
      }
    }
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
      vm.popover.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function () {
      // Execute action
      vm.popover.hide();
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function () {
      // Execute action
      vm.popover.remove();
    });

    var popoverScope = $scope.$new();

    //popupScope.subTypeList = $scope.subTaskArray;
    //popupScope.selectedSubType = _ctlSelf.selectedSubType;
    popoverScope.cancel = vm.hidePopover;
    //popupScope.typeName = $scope.publishTaskTypeName;
    $ionicPopover.fromTemplateUrl('modules/main/playground/templates/topic-group-popover.html',
      {
        title: null,
        subTitle: null,
        scope: popoverScope
      }
    ).then(function (pov) {
        vm.popover = pov;
      });


    vm.hidePopover = function () {
      vm.popover.hide();
    }

    vm.showPopover = function (event) {
      vm.popover.show(event);

    }

    //vm.isFavourite = function (topicId) {
    //  return true;
    //}

    vm.shareTopic = function (topic) {

    }

    vm.favouriteToggle = function (topic) {
      if (topic.isFavourite == false) {
        favouriteTopicService.addFavouriteTopic(topic.id, topic.groupId, topic.created).then(function (topicId) {
          topic.isFavourite = true;
          ++topic.favouriteCount;
        }, function (exception) {
          $log.error(exception);
        })
      }
      else {
        favouriteTopicService.deleteFavouriteTopic(topic.id, topic.groupId, topic.created).then(function (topicId) {
          topic.isFavourite = false;
          --topic.favouriteCount;
        }, function (exception) {
          $log.error(exception);
        })
      }
    }

    vm.loadMore = function () {
      topicService.moreTopic(vm.groupId).then(function (topicList) {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }, function (err) {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
      //$timeout(function () {
      //  var topic = {
      //    'id': '3',
      //    'name': '大侠跨快快',
      //    'commentCount': 1,
      //    'favouriteCount': 1,
      //    'description': '大侠半帮帮忙',
      //    'created': '2016-4-27',
      //    'imgList': ['img/task/publish/jiebao-logo.png', 'img/task/publish/qingbao-logo.png'],
      //    'postor': {
      //      'name': '小泡泡',
      //      'gender': '2',
      //      'pic': 'img/task/publish/jiebao-logo.png',
      //      'org': {
      //        'name': '华中科技大学'
      //      }
      //    }
      //  };
      //  vm.userTopicList.push(topic);
      //  $scope.$broadcast('scroll.infiniteScrollComplete');
      //}, 100);

    }

    vm.doRefresh = function () {
      topicService.refreshSysTopic(vm.groupId).then(function (sysTopicList) {
        vm.sysTopicList = sysTopicList;
        topicService.refreshTopic(vm.groupId).then(function (topicList) {
          $scope.$broadcast('scroll.refreshComplete');
          vm.userTopicList = topicList;
        }, function (err) {
          $scope.$broadcast('scroll.refreshComplete');
        });
      }, function (err) {
        $scope.$broadcast('scroll.refreshComplete');
      });
      $scope.$broadcast('scroll.refreshComplete');
    }

    vm.filterTopic = function (topic) {
      filterTopicService.addFilterTopic(topic.id, topic.groupId, topic.created).then(function (topicId) {
        topic.isShow = false;
      }, function (exception) {
        $log.error(exception);
      });
      //$log.info("add topic " + topicId + " to filter list");
    }

    vm.addTopic2BlackList = function (topic) {
      //$log.info("add topic " + topicId + " to black list");
      topicBlacklistService.addTopicBlacklist(topic.id).then(function (topicId) {
        topic.isShow = false;
      }, function (exception) {
        $log.error(exception);
      });
    }

    vm.moreOpt = function (topic) {
      $ionicActionSheet.show({
        titleText: '选择',
        buttons: [
          {
            text: '不想看到本条目'
          },
          {
            text: '举报'
          },
        ],
        //destructiveText: '删除',
        cancelText: '取消',
        cancel: function () {
          console.log('CANCELLED');
        },
        buttonClicked: function (index) {
          console.log('BUTTON CLICKED', index);
          if (index == 0) {
            vm.filterTopic(topic);
          }
          else if (index == 1) {
            vm.addTopic2BlackList(topic);
          }
          return true;
        },
        //destructiveButtonClicked: function () {
        //  console.log('DESTRUCT');
        //  return true;
        //}
      });
    }

    vm.go2AddTopic = function () {
      //$state.go('topic-add', {'groupId': vm.groupId});
      $ionicModal.fromTemplateUrl('modules/main/playground/templates/topic-publish.html', {
        scope: $scope,
        animation: "slide-in-up"
      }).then(function (modal) {
        topicModalService.setPublishModal(modal);
        modal.show();
      });
    }

    vm.go2TopicDetail = function (topic) {
      $state.go('topic-detail', {'topic': topic});
    }


    //[{
    //  'id': '1',
    //  'name': '大侠半帮帮忙',
    //  'commentCount': 0,
    //  'favouriteCount': 1,
    //  'description': '大侠半帮帮忙',
    //  'created': '2016-4-27',
    //  'imgList': ['img/task/publish/shaodai-logo.png', 'img/task/publish/jiebao-logo.png'],
    //  'postor': {
    //    'name': '系统管理员',
    //    'gender': '1',
    //    'pic': 'img/task/publish/jiebao-logo.png',
    //    'org': {
    //      'name': '华中科技大学'
    //    }
    //  }
    //},
    //  {
    //    'id': '2',
    //    'name': '大侠半帮帮忙',
    //    'commentCount': 0,
    //    'favouriteCount': 1,
    //    'description': '大侠半帮帮忙',
    //    'created': '2016-4-27',
    //    'imgList': ['img/task/publish/shaodai-logo.png', 'img/task/publish/jiebao-logo.png'],
    //    'postor': {
    //      'name': '系统管理员',
    //      'gender': '1',
    //      'pic': 'img/task/publish/jiebao-logo.png',
    //      'org': {
    //        'name': '华中科技大学'
    //      }
    //    }
    //  }
    //];

    //[{
    //  'id': '1',
    //  'name': '大侠半帮帮忙',
    //  'commentCount': 0,
    //  'favouriteCount': 1,
    //  'description': '大侠半帮帮忙',
    //  'created': '2016-4-27',
    //  'imgList': ['img/task/publish/shaodai-logo.png', 'img/task/publish/jiebao-logo.png'],
    //  'postor': {
    //    'name': '小泡泡',
    //    'gender': '2',
    //    'pic': 'img/task/publish/jiebao-logo.png',
    //    'org': {
    //      'name': '华中科技大学'
    //    }
    //  }
    //}, {
    //  'id': '2',
    //  'name': '大侠半帮帮忙1',
    //  'commentCount': 1,
    //  'favouriteCount': 1,
    //  'description': '大侠半帮帮忙',
    //  'created': '2016-4-27',
    //  'imgList': ['img/task/publish/shaodai-logo.png', 'img/task/publish/jiebao-logo.png'],
    //  'postor': {
    //    'name': '小泡泡',
    //    'gender': '2',
    //    'pic': 'img/task/publish/jiebao-logo.png',
    //    'org': {
    //      'name': '华中科技大学'
    //    }
    //  }
    //}];
  }


  topicPublishControllerFn.$inject = ['$scope', '$stateParams', '$state', '$log', '$timeout', 'topicModalService'];
  function topicPublishControllerFn($scope, $stateParams, $state, $log, $timeout, topicModalService) {

    var imgList = new Array();
    this.imgList = imgList;
    var imgIncreaseId = 1;
    var emptyImgList = {
      id: 0,
      imgSrc: '',
    }

    imgList[0] = emptyImgList;
    this.closeModal = function () {
      var modal = topicModalService.getPublishModal();
      modal.remove();
    }

    this.clickImg = function (item) {

    }

    this.addImg = function (imgSrc) {
      var imgItem = {
        id: imgIncreaseId++,
        imgSrc: imgSrc
      };
      imgList[imgList.length -1 ] = imgItem;
      if( imgList < 4 ) {
        imgList.push(emptyImgList);
      }
    }

    this.delImg = function (item) {
      for(var index = 0; index < imgList.length; ++ index) {
        if( imgList[index].id == item.id) {
          imgList.splice(index,1);

          if( imgList.length == 3) {
            imgList.push(emptyImgList);
          }
          break;
        }
      }
    }

    this.publish = function() {

    }

  }

  topicDetailControllerFn.$inject = ['$scope', '$stateParams', '$state', '$log', '$timeout', '$ionicActionSheet'];
  function topicDetailControllerFn($scope, $stateParams, $state, $log, $timeout, $ionicActionSheet) {

  }
})();
