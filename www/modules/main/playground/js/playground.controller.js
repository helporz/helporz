/**
 * Created by binfeng on 16/4/22.
 */

(function () {
  'use strict';
  angular.module('com.helporz.playground')
    .controller('topicGroupController', topicGroupControllerFn)
    .controller('topicDetailController', topicDetailControllerFn)
    .controller('topicPublishController', topicPublishControllerFn)
    .controller('playgroundListController', playgroundListControllerFn)
    .controller('ownTopicListController', ownTopicListControllerFn)
    .controller('collectionTopicListController', collectionTopicListControllerFn)
    .controller('myCommentListController', myCommentListControllerFn)
    .controller('myMessageListController', myMessageListControllerFn)
    .controller('commentSessionController', commentSessionControllerFn)

    .filter('TagConnector', TagConnector);

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

  topicGroupControllerFn.$inject = ['$q', '$scope', '$stateParams', '$state', '$log', '$timeout', '$ionicActionSheet',
    '$ionicPopover', '$ionicModal', '$ionicLoading', 'topicService', 'topicGroupService', 'filterTopicService', 'topicBlacklistService',
    'favouriteTopicService', 'topicModalService', 'impressUtils', 'userUtils', 'IMInterfaceService', 'PlaygroundNetService'];
  function topicGroupControllerFn($q, $scope, $stateParams, $state, $log, $timeout, $ionicActionSheet,
                                  $ionicPopover, $ionicModal, $ionicLoading, topicService, topicGroupService, filterTopicService,
                                  topicBlacklistService, favouriteTopicService, topicModalService, impressUtils, userUtils,
                                  IMInterfaceService, PlaygroundNetService) {
    var vm = $scope.vm = {};
    if (typeof $stateParams.groupId === 'undefined' || $stateParams.groupId == null) {
      vm.groupId = 1;
    }
    else {
      vm.groupId = $stateParams.groupId;
    }
    vm.state = $state;
    vm.IMInterfaceService = IMInterfaceService;
    vm.topicGroup = topicGroupService.getGroupInfo(vm.groupId);

    vm.sysTopicList = topicService.getSysTopicList(vm.groupId);
    vm.userTopicList = topicService.getTopicList(vm.groupId);
    vm.isCanLoadMore = true;

    vm.adList = topicService.getADList();

    vm.gotoAD = function (ad) {
      PlaygroundNetService.getTopicDetailInfo(ad.actionUrl, 0, 0, 10).then(function (res) {
        topicService.setCurrentDetailTopic(res.topic);
        topicService.setCurrentDetailTopicCommentList(res.commentList);
        $state.go('main.topic-group_topic-detail', {'topicId': ad.actionUrl});
      }, function (error) {

      });

    }

    //$scope.$on('$stateChangeSuccess', function () {
    //  vm.loadMore();
    //});
    vm.moreDataCanBeLoaded = function () {
      if (vm.userTopicList != null && vm.isCanLoadMore) {
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

    $scope.$on('$ionicView.beforeEnter', function () {
      if (vm.userTopicList == null || vm.userTopicList.length == 0) {
        $ionicLoading.show();
        vm.doRefresh().then(function () {
          $ionicLoading.hide();
        }, function () {
          $ionicLoading.hide();
        });
      }

    });

    var popoverScope = $scope.$new();

    //popupScope.subTypeList = $scope.subTaskArray;
    //popupScope.selectedSubType = _ctlSelf.selectedSubType;
    popoverScope.cancel = vm.hidePopover;

    vm.gotoOwnTopic = function () {
      $state.go('main.topic-group_own-topic-list');
      vm.hidePopover();
    }

    vm.gotoCollectionTopic = function () {
      $state.go('main.topic-group_collection-topic-list');
      vm.hidePopover();
    }

    vm.gotoMyMessageList = function () {
      $state.go('main.topic-group_my-message-list');
      vm.hidePopover();
    }
    vm.gotoMyCommentList = function () {
      $state.go('main.topic-group_my-comment-list');
      vm.hidePopover();
    }

    vm.go2AddTopic = function () {
      //$state.go('topic-add', {'groupId': vm.groupId});
      vm.hidePopover();
      var publishScope = $scope.$new();

      publishScope.onRefresh = function () {
        $ionicLoading.show();
        vm.doRefresh().then(function () {
          $ionicLoading.hide();
        }, function () {
          $ionicLoading.hide();
        });
      }
      publishScope.groupId = vm.groupId;
      $ionicModal.fromTemplateUrl('modules/main/playground/templates/topic-publish.html', {
        scope: publishScope,
        animation: "slide-in-up"
      }).then(function (modal) {
        topicModalService.setPublishModal(modal);
        modal.show();
      });
    }

    vm.go2TopicDetail = function (topic) {
      topicService.setCurrentDetailTopic(topic);
      $state.go('main.topic-group_topic-detail', {'topicId': topic.id});
    }

    popoverScope.gotoOwnTopic = vm.gotoOwnTopic;
    popoverScope.gotoCollectionTopic = vm.gotoCollectionTopic;
    popoverScope.gotoMyMessageList = vm.gotoMyMessageList;
    popoverScope.gotoMyCommentList = vm.gotoMyCommentList;
    popoverScope.go2AddTopic = vm.go2AddTopic;
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

    vm.showImgs = function (imgList, event) {
      if (event != null) {
        event.stopPropagation();
      }

      var modalScope = $scope.$new();
      var imgItemList = new Array();
      for (var index = 0; index < imgList.length; ++index) {
        var item = {imgSrc: imgList[index]};
        imgItemList.push(item);
      }
      modalScope.imgList = imgItemList;
      $ionicModal.fromTemplateUrl('modules/main/playground/templates/show-imgs.html', {
        scope: modalScope,
        animation: "slide-in-up"
      }).then(function (modal) {
        modalScope.modal = modal;
        modal.show();
      });
    }

    vm.shareTopic = function (topic, event) {
      if (event != null) {
        event.stopPropagation();
      }
      topicService.shareTopic(topic);
    }

    vm.favouriteToggle = function (topic, event) {
      if (event != null) {
        event.stopPropagation();
      }

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
      var currentUserTopicCount = vm.userTopicList.length;
      topicService.moreTopic(vm.groupId).then(function (topicList) {
        vm.userTopicList = topicList;
        if (topicList.length == 0 || currentUserTopicCount == topicList.length) {
          vm.isCanLoadMore = false;
        }
        //for test
        //for(var topicIndex = 0; topicIndex < vm.userTopicList.length; ++ topicIndex) {
        //  var topic = vm.userTopicList[topicIndex];
        //  if( topicIndex%2==0) {
        //    topic.imgList = new Array();
        //    topic.imgList.push( "data:image/jpeg;base64," + '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwC3BtkT5oxn3HvS/dZswgjJxgfSnqw9aepouIjGwr/qenbPvT4zDCTtQjk9PapVNOGKLgODgoGA6/40gmQ55PH+GaXtimeVHnIFICTzF9eeKUsAQueTUaxoCTjJ96dxuz3HFKwDqQ0hNNJosApNMNBNNJosFwopuaKLBcqBQD94jvUicdH7io8A9acEWmBNG2MZYYx61MGqqEX8qeFHPJoAshqXNV1BH8XpUgNAEmaQtTM0ZoAduppam5pCaAFLAdTSZpjcsvHAOaM0AOzRTM+9FAFYNT1aq6yLnGaeJB68UAWAaeDVdXGCc9KeHHqKAJwaXNRBh60u6gZJmjNR7qM0CH5puabupM0AOzSZpuabuoAeTRUe6ikIpAtgcCnAnHKUgNKDTGP34B+U0u4D+HrTQacDQMerA89OtPDA4Hp2qIGnA0CJt1JuqPdRuoAk3Um6o91JuoAk3U0tTN1NLUCH7qKiLUUAQg0oNVxMe6mgT5P3TQMtA0oaoVfOaduoAmDUu6oQ1KGoAl3Ubqi3UbqAJd1JuqLdRuoAk3U3dUZajdQA/dRUe6igCEOPWlDCq3FKMUAWQ1KGqr+Joz7mgC2Gpd1VNx/vGl3N/eoGWt1G6q29vWje3qKBFjdRuqv5je1HmN6UAT7qN1QeYfSjzT6GgCbNFQeZ7GigBKTA9KKKADA9KABRRQMAopdtFFAhMUUUUAITRmiigAzxRmiigAooooA//9k=');
        //    topic.imgList.push( "data:image/jpeg;base64," + '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwC3BtkT5oxn3HvS/dZswgjJxgfSnqw9aepouIjGwr/qenbPvT4zDCTtQjk9PapVNOGKLgODgoGA6/40gmQ55PH+GaXtimeVHnIFICTzF9eeKUsAQueTUaxoCTjJ96dxuz3HFKwDqQ0hNNJosApNMNBNNJosFwopuaKLBcqBQD94jvUicdH7io8A9acEWmBNG2MZYYx61MGqqEX8qeFHPJoAshqXNV1BH8XpUgNAEmaQtTM0ZoAduppam5pCaAFLAdTSZpjcsvHAOaM0AOzRTM+9FAFYNT1aq6yLnGaeJB68UAWAaeDVdXGCc9KeHHqKAJwaXNRBh60u6gZJmjNR7qM0CH5puabupM0AOzSZpuabuoAeTRUe6ikIpAtgcCnAnHKUgNKDTGP34B+U0u4D+HrTQacDQMerA89OtPDA4Hp2qIGnA0CJt1JuqPdRuoAk3Um6o91JuoAk3U0tTN1NLUCH7qKiLUUAQg0oNVxMe6mgT5P3TQMtA0oaoVfOaduoAmDUu6oQ1KGoAl3Ubqi3UbqAJd1JuqLdRuoAk3U3dUZajdQA/dRUe6igCEOPWlDCq3FKMUAWQ1KGqr+Joz7mgC2Gpd1VNx/vGl3N/eoGWt1G6q29vWje3qKBFjdRuqv5je1HmN6UAT7qN1QeYfSjzT6GgCbNFQeZ7GigBKTA9KKKADA9KABRRQMAopdtFFAhMUUUUAITRmiigAzxRmiigAooooA//9k=');
        //    topic.imgList.push( "data:image/jpeg;base64," + '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwC3BtkT5oxn3HvS/dZswgjJxgfSnqw9aepouIjGwr/qenbPvT4zDCTtQjk9PapVNOGKLgODgoGA6/40gmQ55PH+GaXtimeVHnIFICTzF9eeKUsAQueTUaxoCTjJ96dxuz3HFKwDqQ0hNNJosApNMNBNNJosFwopuaKLBcqBQD94jvUicdH7io8A9acEWmBNG2MZYYx61MGqqEX8qeFHPJoAshqXNV1BH8XpUgNAEmaQtTM0ZoAduppam5pCaAFLAdTSZpjcsvHAOaM0AOzRTM+9FAFYNT1aq6yLnGaeJB68UAWAaeDVdXGCc9KeHHqKAJwaXNRBh60u6gZJmjNR7qM0CH5puabupM0AOzSZpuabuoAeTRUe6ikIpAtgcCnAnHKUgNKDTGP34B+U0u4D+HrTQacDQMerA89OtPDA4Hp2qIGnA0CJt1JuqPdRuoAk3Um6o91JuoAk3U0tTN1NLUCH7qKiLUUAQg0oNVxMe6mgT5P3TQMtA0oaoVfOaduoAmDUu6oQ1KGoAl3Ubqi3UbqAJd1JuqLdRuoAk3U3dUZajdQA/dRUe6igCEOPWlDCq3FKMUAWQ1KGqr+Joz7mgC2Gpd1VNx/vGl3N/eoGWt1G6q29vWje3qKBFjdRuqv5je1HmN6UAT7qN1QeYfSjzT6GgCbNFQeZ7GigBKTA9KKKADA9KABRRQMAopdtFFAhMUUUUAITRmiigAzxRmiigAooooA//9k=');
        //    topic.imgList.push( "data:image/jpeg;base64," + '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwC3BtkT5oxn3HvS/dZswgjJxgfSnqw9aepouIjGwr/qenbPvT4zDCTtQjk9PapVNOGKLgODgoGA6/40gmQ55PH+GaXtimeVHnIFICTzF9eeKUsAQueTUaxoCTjJ96dxuz3HFKwDqQ0hNNJosApNMNBNNJosFwopuaKLBcqBQD94jvUicdH7io8A9acEWmBNG2MZYYx61MGqqEX8qeFHPJoAshqXNV1BH8XpUgNAEmaQtTM0ZoAduppam5pCaAFLAdTSZpjcsvHAOaM0AOzRTM+9FAFYNT1aq6yLnGaeJB68UAWAaeDVdXGCc9KeHHqKAJwaXNRBh60u6gZJmjNR7qM0CH5puabupM0AOzSZpuabuoAeTRUe6ikIpAtgcCnAnHKUgNKDTGP34B+U0u4D+HrTQacDQMerA89OtPDA4Hp2qIGnA0CJt1JuqPdRuoAk3Um6o91JuoAk3U0tTN1NLUCH7qKiLUUAQg0oNVxMe6mgT5P3TQMtA0oaoVfOaduoAmDUu6oQ1KGoAl3Ubqi3UbqAJd1JuqLdRuoAk3U3dUZajdQA/dRUe6igCEOPWlDCq3FKMUAWQ1KGqr+Joz7mgC2Gpd1VNx/vGl3N/eoGWt1G6q29vWje3qKBFjdRuqv5je1HmN6UAT7qN1QeYfSjzT6GgCbNFQeZ7GigBKTA9KKKADA9KABRRQMAopdtFFAhMUUUUAITRmiigAzxRmiigAooooA//9k=');
        //
        //  }
        //  else {
        //    topic.imgList = new Array();
        //    topic.imgList.push( "data:image/jpeg;base64," + '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwC3BtkT5oxn3HvS/dZswgjJxgfSnqw9aepouIjGwr/qenbPvT4zDCTtQjk9PapVNOGKLgODgoGA6/40gmQ55PH+GaXtimeVHnIFICTzF9eeKUsAQueTUaxoCTjJ96dxuz3HFKwDqQ0hNNJosApNMNBNNJosFwopuaKLBcqBQD94jvUicdH7io8A9acEWmBNG2MZYYx61MGqqEX8qeFHPJoAshqXNV1BH8XpUgNAEmaQtTM0ZoAduppam5pCaAFLAdTSZpjcsvHAOaM0AOzRTM+9FAFYNT1aq6yLnGaeJB68UAWAaeDVdXGCc9KeHHqKAJwaXNRBh60u6gZJmjNR7qM0CH5puabupM0AOzSZpuabuoAeTRUe6ikIpAtgcCnAnHKUgNKDTGP34B+U0u4D+HrTQacDQMerA89OtPDA4Hp2qIGnA0CJt1JuqPdRuoAk3Um6o91JuoAk3U0tTN1NLUCH7qKiLUUAQg0oNVxMe6mgT5P3TQMtA0oaoVfOaduoAmDUu6oQ1KGoAl3Ubqi3UbqAJd1JuqLdRuoAk3U3dUZajdQA/dRUe6igCEOPWlDCq3FKMUAWQ1KGqr+Joz7mgC2Gpd1VNx/vGl3N/eoGWt1G6q29vWje3qKBFjdRuqv5je1HmN6UAT7qN1QeYfSjzT6GgCbNFQeZ7GigBKTA9KKKADA9KABRRQMAopdtFFAhMUUUUAITRmiigAzxRmiigAooooA//9k=');
        //    //topic.imgList.push( "data:image/jpeg;base64," + '/9j/6AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwC3BtkT5oxn3HvS/dZswgjJxgfSnqw9aepouIjGwr/qenbPvT4zDCTtQjk9PapVNOGKLgODgoGA6/40gmQ55PH+GaXtimeVHnIFICTzF9eeKUsAQueTUaxoCTjJ96dxuz3HFKwDqQ0hNNJosApNMNBNNJosFwopuaKLBcqBQD94jvUicdH7io8A9acEWmBNG2MZYYx61MGqqEX8qeFHPJoAshqXNV1BH8XpUgNAEmaQtTM0ZoAduppam5pCaAFLAdTSZpjcsvHAOaM0AOzRTM+9FAFYNT1aq6yLnGaeJB68UAWAaeDVdXGCc9KeHHqKAJwaXNRBh60u6gZJmjNR7qM0CH5puabupM0AOzSZpuabuoAeTRUe6ikIpAtgcCnAnHKUgNKDTGP34B+U0u4D+HrTQacDQMerA89OtPDA4Hp2qIGnA0CJt1JuqPdRuoAk3Um6o91JuoAk3U0tTN1NLUCH7qKiLUUAQg0oNVxMe6mgT5P3TQMtA0oaoVfOaduoAmDUu6oQ1KGoAl3Ubqi3UbqAJd1JuqLdRuoAk3U3dUZajdQA/dRUe6igCEOPWlDCq3FKMUAWQ1KGqr+Joz7mgC2Gpd1VNx/vGl3N/eoGWt1G6q29vWje3qKBFjdRuqv5je1HmN6UAT7qN1QeYfSjzT6GgCbNFQeZ7GigBKTA9KKKADA9KABRRQMAopdtFFAhMUUUUAITRmiigAzxRmiigAooooA//9k=');
        //    //topic.imgList.push( "data:image/jpeg;base64," + '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwC3BtkT5oxn3HvS/dZswgjJxgfSnqw9aepouIjGwr/qenbPvT4zDCTtQjk9PapVNOGKLgODgoGA6/40gmQ55PH+GaXtimeVHnIFICTzF9eeKUsAQueTUaxoCTjJ96dxuz3HFKwDqQ0hNNJosApNMNBNNJosFwopuaKLBcqBQD94jvUicdH7io8A9acEWmBNG2MZYYx61MGqqEX8qeFHPJoAshqXNV1BH8XpUgNAEmaQtTM0ZoAduppam5pCaAFLAdTSZpjcsvHAOaM0AOzRTM+9FAFYNT1aq6yLnGaeJB68UAWAaeDVdXGCc9KeHHqKAJwaXNRBh60u6gZJmjNR7qM0CH5puabupM0AOzSZpuabuoAeTRUe6ikIpAtgcCnAnHKUgNKDTGP34B+U0u4D+HrTQacDQMerA89OtPDA4Hp2qIGnA0CJt1JuqPdRuoAk3Um6o91JuoAk3U0tTN1NLUCH7qKiLUUAQg0oNVxMe6mgT5P3TQMtA0oaoVfOaduoAmDUu6oQ1KGoAl3Ubqi3UbqAJd1JuqLdRuoAk3U3dUZajdQA/dRUe6igCEOPWlDCq3FKMUAWQ1KGqr+Joz7mgC2Gpd1VNx/vGl3N/eoGWt1G6q29vWje3qKBFjdRuqv5je1HmN6UAT7qN1QeYfSjzT6GgCbNFQeZ7GigBKTA9KKKADA9KABRRQMAopdtFFAhMUUUUAITRmiigAzxRmiigAooooA//9k=');
        //  }
        //}
        //end for test

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
      var _innerDefer = $q.defer();
      topicService.refreshSysTopic(vm.groupId).then(function (sysTopicList) {
        vm.sysTopicList = sysTopicList;
        topicService.refreshTopic(vm.groupId).then(function (topicList) {
          $scope.$broadcast('scroll.refreshComplete');
          vm.userTopicList = topicList;
          vm.isCanLoadMore = true;

          for (var i in vm.userTopicList) {
            var item = vm.userTopicList[i];
            item.ui_tags = [];
            impressUtils.netTagsToUiTags(item.ui_tags, item.poster.tags);
          }
          _innerDefer.resolve();
        }, function (err) {
          $scope.$broadcast('scroll.refreshComplete');
          _innerDefer.reject();
        });
      }, function (err) {
        $scope.$broadcast('scroll.refreshComplete');
        _innerDefer.reject();
      });
      //$scope.$broadcast('scroll.refreshComplete');
      return _innerDefer.promise;
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

    vm.moreOpt = function (topic, event) {
      if (event != null) {
        event.stopPropagation();
      }

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

    vm.cb_gotoUser = function (userId, event) {
      if (event != null) {
        event.stopPropagation();
      }
      userUtils.gotoUser(userId, 'topic-group');
    }
  }


  topicPublishControllerFn.$inject = ['$timeout', '$scope', '$stateParams', '$state', '$log', '$ionicPopup', '$ionicActionSheet',
    '$cordovaCamera', '$cordovaImagePicker', '$ionicModal', '$q', 'topicModalService', 'PlaygroundNetService', 'uploadService',
    'userLoginInfoService', 'topicService'];
  function topicPublishControllerFn($timeout, $scope, $stateParams, $state, $log, $ionicPopup, $ionicActionSheet,
                                    $cordovaCamera, $cordovaImagePicker, $ionicModal, $q, topicModalService,
                                    PlaygroundNetService, uploadService, userLoginInfoService, topicService) {
    var self = this;
    var imgList = [];
    self.imgList = imgList;
    var imgIncreaseId = 1;
    var maxImgCount = 4;
    self.maxImgCount = maxImgCount;
    self.tagList = [];
    self.selectedCount = 0;
    var orgTagList = topicService.getTopicTagList();
    if (orgTagList != null) {
      for (var tagIndex = 0; tagIndex < orgTagList.length; ++tagIndex) {
        var tagWrap = {base: orgTagList[tagIndex], selected: false};
        //tagWrap.style = "background-color:#ffffff";
        self.tagList.push(tagWrap);
      }
    }

    self.toggleSelected = function (tag) {
      if (tag.selected == true) {
        tag.selected = false;
        //tag.style = "background-color:#ffffff";
        self.selectedCount--;
      }
      else {
        if (self.selectedCount < 3) {
          tag.selected = true;
          //tag.style = "background-color:" +tag.base.color;
          self.selectedCount++;
        }
      }
    }

    //var emptyImgList = {
    //  id: 0,
    //  imgSrc: '',
    //}
    //
    //imgList[0] = {
    //  id:10000,
    //  //imgSrc:'file:///storage/emulated/0/Android/data/com.helporz.hybridapp/cache/1462970409194.jpg',
    //  imgSrc: "data:image/jpeg;base64," + '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwC3BtkT5oxn3HvS/dZswgjJxgfSnqw9aepouIjGwr/qenbPvT4zDCTtQjk9PapVNOGKLgODgoGA6/40gmQ55PH+GaXtimeVHnIFICTzF9eeKUsAQueTUaxoCTjJ96dxuz3HFKwDqQ0hNNJosApNMNBNNJosFwopuaKLBcqBQD94jvUicdH7io8A9acEWmBNG2MZYYx61MGqqEX8qeFHPJoAshqXNV1BH8XpUgNAEmaQtTM0ZoAduppam5pCaAFLAdTSZpjcsvHAOaM0AOzRTM+9FAFYNT1aq6yLnGaeJB68UAWAaeDVdXGCc9KeHHqKAJwaXNRBh60u6gZJmjNR7qM0CH5puabupM0AOzSZpuabuoAeTRUe6ikIpAtgcCnAnHKUgNKDTGP34B+U0u4D+HrTQacDQMerA89OtPDA4Hp2qIGnA0CJt1JuqPdRuoAk3Um6o91JuoAk3U0tTN1NLUCH7qKiLUUAQg0oNVxMe6mgT5P3TQMtA0oaoVfOaduoAmDUu6oQ1KGoAl3Ubqi3UbqAJd1JuqLdRuoAk3U3dUZajdQA/dRUe6igCEOPWlDCq3FKMUAWQ1KGqr+Joz7mgC2Gpd1VNx/vGl3N/eoGWt1G6q29vWje3qKBFjdRuqv5je1HmN6UAT7qN1QeYfSjzT6GgCbNFQeZ7GigBKTA9KKKADA9KABRRQMAopdtFFAhMUUUUAITRmiigAzxRmiigAooooA//9k='
    //};
    //
    //imgList[1] = {
    //  id:10001,
    //  //imgSrc:'file:///storage/emulated/0/Android/data/com.helporz.hybridapp/cache/1462970409194.jpg',
    //  imgSrc: "data:image/jpeg;base64," + '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwC3BtkT5oxn3HvS/dZswgjJxgfSnqw9aepouIjGwr/qenbPvT4zDCTtQjk9PapVNOGKLgODgoGA6/40gmQ55PH+GaXtimeVHnIFICTzF9eeKUsAQueTUaxoCTjJ96dxuz3HFKwDqQ0hNNJosApNMNBNNJosFwopuaKLBcqBQD94jvUicdH7io8A9acEWmBNG2MZYYx61MGqqEX8qeFHPJoAshqXNV1BH8XpUgNAEmaQtTM0ZoAduppam5pCaAFLAdTSZpjcsvHAOaM0AOzRTM+9FAFYNT1aq6yLnGaeJB68UAWAaeDVdXGCc9KeHHqKAJwaXNRBh60u6gZJmjNR7qM0CH5puabupM0AOzSZpuabuoAeTRUe6ikIpAtgcCnAnHKUgNKDTGP34B+U0u4D+HrTQacDQMerA89OtPDA4Hp2qIGnA0CJt1JuqPdRuoAk3Um6o91JuoAk3U0tTN1NLUCH7qKiLUUAQg0oNVxMe6mgT5P3TQMtA0oaoVfOaduoAmDUu6oQ1KGoAl3Ubqi3UbqAJd1JuqLdRuoAk3U3dUZajdQA/dRUe6igCEOPWlDCq3FKMUAWQ1KGqr+Joz7mgC2Gpd1VNx/vGl3N/eoGWt1G6q29vWje3qKBFjdRuqv5je1HmN6UAT7qN1QeYfSjzT6GgCbNFQeZ7GigBKTA9KKKADA9KABRRQMAopdtFFAhMUUUUAITRmiigAzxRmiigAooooA//9k='
    //};
    //
    //imgList[2] = {
    //  id:10003,
    //  //imgSrc:'file:///storage/emulated/0/Android/data/com.helporz.hybridapp/cache/1462970409194.jpg',
    //  imgSrc: "data:image/jpeg;base64," + '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwC3BtkT5oxn3HvS/dZswgjJxgfSnqw9aepouIjGwr/qenbPvT4zDCTtQjk9PapVNOGKLgODgoGA6/40gmQ55PH+GaXtimeVHnIFICTzF9eeKUsAQueTUaxoCTjJ96dxuz3HFKwDqQ0hNNJosApNMNBNNJosFwopuaKLBcqBQD94jvUicdH7io8A9acEWmBNG2MZYYx61MGqqEX8qeFHPJoAshqXNV1BH8XpUgNAEmaQtTM0ZoAduppam5pCaAFLAdTSZpjcsvHAOaM0AOzRTM+9FAFYNT1aq6yLnGaeJB68UAWAaeDVdXGCc9KeHHqKAJwaXNRBh60u6gZJmjNR7qM0CH5puabupM0AOzSZpuabuoAeTRUe6ikIpAtgcCnAnHKUgNKDTGP34B+U0u4D+HrTQacDQMerA89OtPDA4Hp2qIGnA0CJt1JuqPdRuoAk3Um6o91JuoAk3U0tTN1NLUCH7qKiLUUAQg0oNVxMe6mgT5P3TQMtA0oaoVfOaduoAmDUu6oQ1KGoAl3Ubqi3UbqAJd1JuqLdRuoAk3U3dUZajdQA/dRUe6igCEOPWlDCq3FKMUAWQ1KGqr+Joz7mgC2Gpd1VNx/vGl3N/eoGWt1G6q29vWje3qKBFjdRuqv5je1HmN6UAT7qN1QeYfSjzT6GgCbNFQeZ7GigBKTA9KKKADA9KABRRQMAopdtFFAhMUUUUAITRmiigAzxRmiigAooooA//9k='
    //};
    //
    //imgList[3] = {
    //  id:10004,
    //  //imgSrc:'file:///storage/emulated/0/Android/data/com.helporz.hybridapp/cache/1462970409194.jpg',
    //  imgSrc: "data:image/jpeg;base64," + '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwC3BtkT5oxn3HvS/dZswgjJxgfSnqw9aepouIjGwr/qenbPvT4zDCTtQjk9PapVNOGKLgODgoGA6/40gmQ55PH+GaXtimeVHnIFICTzF9eeKUsAQueTUaxoCTjJ96dxuz3HFKwDqQ0hNNJosApNMNBNNJosFwopuaKLBcqBQD94jvUicdH7io8A9acEWmBNG2MZYYx61MGqqEX8qeFHPJoAshqXNV1BH8XpUgNAEmaQtTM0ZoAduppam5pCaAFLAdTSZpjcsvHAOaM0AOzRTM+9FAFYNT1aq6yLnGaeJB68UAWAaeDVdXGCc9KeHHqKAJwaXNRBh60u6gZJmjNR7qM0CH5puabupM0AOzSZpuabuoAeTRUe6ikIpAtgcCnAnHKUgNKDTGP34B+U0u4D+HrTQacDQMerA89OtPDA4Hp2qIGnA0CJt1JuqPdRuoAk3Um6o91JuoAk3U0tTN1NLUCH7qKiLUUAQg0oNVxMe6mgT5P3TQMtA0oaoVfOaduoAmDUu6oQ1KGoAl3Ubqi3UbqAJd1JuqLdRuoAk3U3dUZajdQA/dRUe6igCEOPWlDCq3FKMUAWQ1KGqr+Joz7mgC2Gpd1VNx/vGl3N/eoGWt1G6q29vWje3qKBFjdRuqv5je1HmN6UAT7qN1QeYfSjzT6GgCbNFQeZ7GigBKTA9KKKADA9KABRRQMAopdtFFAhMUUUUAITRmiigAzxRmiigAooooA//9k='
    //};
    self.closeModal = function () {
      var modal = topicModalService.getPublishModal();
      modal.remove();
    }

    self.clickCamera = function () {
      $ionicActionSheet.show({
        titleText: '',
        buttons: [
          {
            text: '打开照相机'
          },
          {
            text: '从手机相册获取'
          },
        ],
        cancelText: '取消',
        cancel: function () {
          console.log('CANCELLED');
        },
        buttonClicked: function (index) {
          console.log('BUTTON CLICKED', index);
          if (index == 0) {
            self.openCamera();
          }
          else if (index == 1) {
            self.openAlbum();
          }
          return true;
        },
      });
    }

    self.clickImg = function (item) {
      $ionicActionSheet.show({
        buttons: [
          {text: '查看照片'},
          {text: '删除照片'}
        ],
        cancelText: '取消',
        cancel: function () {

        },
        buttonClicked: function (index) {
          if (index == 0) {
            self.showImg(item);
          }
          else if (index == 1) {
            self.delImg(item);
          }
          return true;
        }
      });
    }

    self.showImg = function (imgItem) {
      var modalScope = $scope.$new();
      modalScope.imgList = self.imgList;//.slice(0, -1);
      $ionicModal.fromTemplateUrl('modules/main/playground/templates/show-imgs.html', {
        scope: modalScope,
        animation: "slide-in-up"
      }).then(function (modal) {
        modalScope.modal = modal;
        modal.show();
      });
    }

    self.addImg = function (imgSrc, nativeUrl) {
      var imgItem = {
        id: imgIncreaseId++,
        imgSrc: imgSrc,
        nativeUrl: nativeUrl
      };
      imgList.push(imgItem);
      //imgList.push(emptyImgList);
      //if (imgList.length < maxImgCount) {
      //
      //}
      $log.info('image list length:' + imgList.length);
    }

    self.delImg = function (item) {
      $log.info('delImg id:' + item.id);
      for (var index = 0; index < imgList.length; ++index) {
        if (imgList[index].id == item.id) {
          imgList.splice(index, 1);

          //if (imgList.length == maxImgCount - 1) {
          //  imgList.push(emptyImgList);
          //}
          break;
        }
      }

      $log.info('imgList length:' + imgList.length);
    }

    self.openCamera = function () {
      //reference api doc url:https://github.com/apache/cordova-plugin-camera

      var cameraOptions = self.setOptions(Camera.PictureSourceType.CAMERA);

      var cameraPopoverHandle = navigator.camera.getPicture(function (imageData) {
        $log.info('imageData length:' + imageData.length);
        $log.info('image file url:' + imageData);
        resolveLocalFileSystemURL(imageData, function (entry) {
          $log.info('image cvd file:' + entry.toInternalURL());
          self.addImg(entry.toInternalURL(), imageData);
          $scope.$apply();
        });
      }, function (message) {
        alert(message);
      }, cameraOptions);
    }

    self.setOptions = function (srcType) {
      var options = {
        // Some common settings are 20, 50, and 100
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        targetWidth: 800,
        targetHeight: 800,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: false,
        correctOrientation: true  //Corrects Android orientation quirks
      }

      //{
      //  destinationType: Camera.DestinationType.FILE_URI,
      //    //sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      //    sourceType: Camera.PictureSourceType.CAMERA,             //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
      //  allowEdit: false,                                        //在选择之前允许修改截图
      //  encodingType:Camera.EncodingType.JPEG,                   //保存的图片格式： JPEG = 0, PNG = 1
      //  targetWidth: 200,                                        //照片宽度
      //  targetHeight: 200,                                       //照片高度
      //  mediaType:0,                                             //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
      //  cameraDirection:0,
      //  saveToPhotoAlbum:true,
      //  popoverOptions: new CameraPopoverOptions(300, 300, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY)
      //};
      return options;
    }

    self.openAlbum = function () {
      //var options = self.setOptions(Camera.PictureSourceType.PHOTOLIBRARY);
      //
      //$cordovaCamera.getPicture(options).then(function (imageUrl) {
      //  $log.info('image file url:' + imageUrl);
      //  //fileService.readFileFromFullPath(imageData, function (data) {
      //  //  self.addImg("data:image/jpeg;base64," + data);
      //  //}, function (message) {
      //  //  $log.error(message);
      //  //})
      //}, function (message) {
      //  // error
      //  $log.error('camera cleanup failed:' + message);
      //});
      //if( self.imgList.length >= maxImgCount && self.imgList[ maxImgCount - 1].id != 0 ) {
      //  return ;
      //}

      var options = {
        maximumImagesCount: maxImgCount - self.imgList.length + 1,
        width: 800,
        height: 800,
        quality: 80
      };

      $cordovaImagePicker.getPictures(options).then(function (pics) {
        var isLastPic = false;
        for (var index = 0; index < pics.length; ++index) {
          $log.info('picker get picture url:' + pics[index]);
          if (index == pics.length - 1) {
            isLastPic = true;
          }
          resolveLocalFileSystemURL(pics[index], function (entry) {
            $log.info('image cvd file:' + entry.toInternalURL());
            self.addImg(entry.toInternalURL(), entry.toNativeURL());
            if (isLastPic) {
              $log.info('call $scope.$apply()');
              $scope.$apply();
            }
          });
        }

      })
    }

    self.clearContent = function () {

      if (self.content != null && self.content != '') {
        $ionicPopup.confirm(
          {
            title: '提示',
            subTitle: '请确定清空内容',
            cancelText: '取消',
            okText: '确定'
          }
        ).then(function (res) {
            if (res) {
              self.content = '';
            }
            else {

            }
          });
      }
    }

    self.publish = function () {
      var groupId = $scope.groupId;
      var tagInfoArray = new Array();
      for (var tagIndex = 0; tagIndex < self.tagList.length; ++tagIndex) {
        if (self.tagList[tagIndex].selected == true) {
          tagInfoArray.push(self.tagList[tagIndex].base);
        }
      }

      PlaygroundNetService.addTopic(groupId, self.content, self.imgList.length, 0, tagInfoArray).then(function (resp) {
        var topicId = resp.data;
        var pArray = new Array();
        var headers = {
          Connection: "close",
          'x-login-key': userLoginInfoService.getLoginTicket()
        }
        for (var index = 0; index < self.imgList.length; ++index) {

          var uploadRet = uploadService.uploadImgFile(imgList[index].nativeUrl, appConfig.API_SVC_URL +
            '/playground/topic/' + topicId + '/img/' + index, headers);
          if (uploadRet != null) {
            pArray.push(uploadRet);
          }
        }

        $q.all(pArray).then(function () {
          alert('发布话题成功');
          self.closeModal();
          $timeout(function () {
            $scope.onRefresh();
          });
        }, function () {
          alert('发布话题失败，上传图片失败');
        });
      }, function (error) {
        alert('发布话题失败');
      });
    }

  }

  topicDetailControllerFn.$inject = ['$ionicModal', '$scope', '$stateParams', '$state', '$log', '$timeout', '$ionicActionSheet', '$q', '$ionicLoading',
    'topicService', 'PlaygroundNetService', 'collectionTopicService', 'topicBlacklistService', 'favouriteTopicService',
    'impressUtils', 'userUtils', 'operationUtils'];
  function topicDetailControllerFn($ionicModal, $scope, $stateParams, $state, $log, $timeout, $ionicActionSheet, $q, $ionicLoading,
                                   topicService, PlaygroundNetService, collectionTopicService, topicBlacklistService, favouriteTopicService,
                                   impressUtils, userUtils, operationUtils) {
    var vm = $scope.vm = {};

    vm.topicService = topicService;
    vm.topicId = $stateParams.topicId;

    $ionicLoading.show();
    vm.topic = topicService.getCurrentDetailTopic();
    if (vm.topic == null) {
      vm.topic = {id: vm.topicId, poster: {}};
    }

    topicService.setCurrentDetailTopic(null);

    vm.topic.ui_tags = [];
    impressUtils.netTagsToUiTags(vm.topic.ui_tags, vm.topic.poster.tags);

    vm.topicCommentList = topicService.getCurrentDetailTopicCommentList();
    topicService.setCurrentDetailTopicCommentList(null);

    vm.collectionTopicService = collectionTopicService;

    $scope.$on("$ionicView.beforeEnter", function () {
      if (vm.topicCommentList != null && vm.topicCommentList.length == 0) {
        vm.doRefresh().then(function () {
          $ionicLoading.hide();
        }, function () {
          $ionicLoading.hide();
        });
      }
      else {
        $ionicLoading.hide();
      }
    });

    vm.cb_gotoUser = function (userId) {
      if (operationUtils.canClick() == false) {
        return;
      }
      userUtils.gotoUser(userId, 'topic-group');
    }

    vm.refreshCommentList = function () {
      var _innerDefer = $q.defer();
      PlaygroundNetService.getTopicCommentList(vm.topicId, 0, 1, 10).then(function (res) {
        vm.topicCommentList = res;
        _innerDefer.resolve(res);
      }, function (err) {
        _innerDefer.reject(err);
      })
      return _innerDefer.promise;
    }

    vm.showImgs = function (imgList) {
      var modalScope = $scope.$new();
      var imgItemList = new Array();
      for (var index = 0; index < imgList.length; ++index) {
        var item = {imgSrc: imgList[index]};
        imgItemList.push(item);
      }
      modalScope.imgList = imgItemList;
      $ionicModal.fromTemplateUrl('modules/main/playground/templates/show-imgs.html', {
        scope: modalScope,
        animation: "slide-in-up"
      }).then(function (modal) {
        modalScope.modal = modal;
        modal.show();
      });
    }

    vm.setCommentFocus = function (event) {
      vm.isComment = new Object();
      vm.isComment.content = new Date();
      vm.replyCommentItem = null;
      event.stopPropagation();
    }

    vm.setReplyCommentFocus = function (commentItem, event) {
      //只有改变isReplyComment的值才能是 focusMe中的watch方法被调用
      vm.isComment = new Object();
      vm.isComment.content = new Date();

      vm.replyCommentItem = commentItem;
      event.stopPropagation();
    }

    vm.clearReplyComment = function () {
      vm.isComment = false;
      vm.replyCommentItem = null;
    }
    vm.sendComment = function (event) {
      var replyOtherCommentId, commentSessionId, replyUserId;
      if (vm.replyCommentItem != null) {
        replyOtherCommentId = vm.replyCommentItem.id;
        commentSessionId = vm.replyCommentItem.commentSessionId;
        replyUserId = vm.replyCommentItem.commenter.userId;
      }
      else {
        replyUserId = vm.topic.poster.userId;
      }

      $ionicLoading.show();
      PlaygroundNetService.addTopicComment(vm.topic.id, vm.sendContent, commentSessionId, replyOtherCommentId, replyUserId).then(function (res) {
        vm.doRefresh().then(function () {
          $timeout(function () {
            $scope.$apply();
            $ionicLoading.hide();
          })

        }, function () {
          $ionicLoading.hide();
        });
        vm.sendContent = null;

      }, function (error) {
        $ionicLoading.hide();
      });
    }

    vm.doRefresh = function () {
      var _innerDefer = $q.defer();
      PlaygroundNetService.getTopicDetailInfo(vm.topic.id, 0, 1, 10).then(function (res) {
        vm.topic = res.topic;
        vm.topicCommentList = res.commentList;
        $timeout(function () {
          $scope.$apply();
          $scope.$broadcast('scroll.refreshComplete');
          _innerDefer.resolve();
        })
        //$scope.$apply();
        //$scope.$broadcast('scroll.refreshComplete');
      }, function (error) {
        $scope.$broadcast('scroll.refreshComplete');
        _innerDefer.reject();
      });
      return _innerDefer.promise;
    }

    vm.loadMore = function () {
      var topicId = vm.topic.id;
      var startCommentId = (vm.topicCommentList != null && vm.topicCommentList.length > 0) ? vm.topicCommentList[0].id : 0;
      var pageSize = 10;
      var pageNum = (vm.topicCommentList != null) ? Math.ceil(vm.topicCommentList.length / pageSize) + 1 : 1;

      PlaygroundNetService.getTopicCommentList(topicId, startCommentId, pageNum, pageSize).then(function (res) {
        if (vm.topicCommentList == null) {
          vm.topicCommentList = res;
        }
        else {
          vm.topicCommentList = vm.topicCommentList.concat(res);
          //for(var index = 0; index < res.length; ++index) {
          //  vm.topicCommentList.push(res[index]);
          //}
        }

        $timeout(function () {
          $scope.$apply();
        })

        $scope.$broadcast('scroll.infiniteScrollComplete');
      }, function (err) {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    }

    vm.moreDataCanBeLoaded = function () {
      if (vm.topicCommentList == null) {
        return false;
      }

      if (vm.topicCommentList.length >= vm.topic.commentCount) {
        return false;
      }
      return true;
    }

    vm.collectionToggle = function (event) {
      if (collectionTopicService.isCollectionTopic(vm.topicId)) {
        collectionTopicService.cancelCollectionTopic(vm.topicId).then(function () {
          alert("取消收藏成功");
        }, function () {
          alert("取消收藏失败");
        });
      }
      else {
        collectionTopicService.addCollectionTopic(vm.topicId).then(function () {
          alert("收藏成功");
        }, function () {
          alert("收藏失败")
        });
      }
    }
    vm.addTopic2BlackList = function (topic) {
      //$log.info("add topic " + topicId + " to black list");
      topicBlacklistService.addTopicBlacklist(topic.id).then(function (topicId) {
        topic.isShow = false;
      }, function (exception) {
        $log.error(exception);
      });
    }
    vm.operateTopic = function () {
      $ionicActionSheet.show({
        titleText: '选择',
        buttons: [
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
          vm.addTopic2BlackList(vm.topic);

          return true;
        },
      });
    }
    vm.operateComment = function (comment, event) {
      if (operationUtils.canClick() == false) {
        return;
      }
      $ionicActionSheet.show({
        titleText: '选择',
        buttons: [
          {
            text: '举报',
          },
          {
            text: '回复',
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
            PlaygroundNetService.addComment2Blacklist(vm.topic.groupId, vm.topicId, comment.id);
          }
          else if (index == 1) {
            vm.setReplyCommentFocus(comment, event);
          }

          return true;
        },
      });
    }

    vm.favouriteToggle = function () {
      if (vm.topic.isFavourite == false) {
        favouriteTopicService.addFavouriteTopic(vm.topic.id, vm.topic.groupId, vm.topic.created).then(function (topicId) {
          vm.topic.isFavourite = true;
          ++vm.topic.favouriteCount;
        }, function (exception) {
          $log.error(exception);
        })
      }
      else {
        favouriteTopicService.deleteFavouriteTopic(vm.topic.id, vm.topic.groupId, vm.topic.created).then(function (topicId) {
          vm.topic.isFavourite = false;
          --vm.topic.favouriteCount;
        }, function (exception) {
          $log.error(exception);
        })
      }
    }
  }

  commentSessionControllerFn.$inject = ['$scope', '$stateParams', '$state', '$log', '$timeout', '$ionicActionSheet', '$q',
    'topicService', 'PlaygroundNetService'];
  function commentSessionControllerFn($scope, $stateParams, $state, $log, $timeout, $ionicActionSheet, $q,
                                      topicService, PlaygroundNetService) {
    var vm = $scope.vm = {};
    vm.commentSessionId = $stateParams.sessionId;
    vm.pageSize = 20;
    vm.canLoadMoreData = false;
    $scope.$on("$ionicView.afterEnter", function () {
      vm.topicCommentList = null;
      vm.loadMoreCommentList();
    });

    vm.loadMoreCommentList = function () {
      var pageNum = (vm.topicCommentList != null) ? Math.ceil(vm.topicCommentList.length / vm.pageSize) + 1 : 1;

      PlaygroundNetService.getTopicCommentListBySessionId(vm.commentSessionId, pageNum, vm.pageSize).then(function (res) {
        if (vm.topicCommentList == null) {
          vm.topicCommentList = res;
        }
        else {
          if (res.length > 0) {
            vm.topicCommentList = vm.topicCommentList.concat(res);
          }

          //for(var index = 0; index < res.length; ++index) {
          //  vm.topicCommentList.push(res[index]);
          //}
        }

        if (res.length < vm.pageSize) {
          vm.canLoadMoreData = false;
        }
        else {
          vm.canLoadMoreData = true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }, function (err) {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    }


    vm.moreDataCanBeLoaded = function () {
      return vm.canLoadMoreData;
    }
  }

  ownTopicListControllerFn.$inject = ['$scope', '$state', '$log', '$timeout', '$ionicActionSheet', '$q',
    'topicService', 'PlaygroundNetService', 'userUtils', 'favouriteTopicService'];
  function ownTopicListControllerFn($scope, $state, $log, $timeout, $ionicActionSheet, $q,
                                    topicService, PlaygroundNetService, userUtils, favouriteTopicService) {
    var vm = $scope.vm = {};
    vm.pageSize = 20;
    vm.canLoadMoreData = false;
    $scope.$on("$ionicView.beforeEnter", function () {
      vm.topicList = null;
      vm.loadMoreTopicList();
    });

    vm.cb_gotoUser = function (userId, event) {
      if (event != null) {
        event.stopPropagation();
      }
      userUtils.gotoUser(userId, 'topic-group');
    }

    vm.loadMoreTopicList = function () {
      var pageNum = (vm.topicList != null) ? Math.ceil(vm.topicList.length / vm.pageSize) + 1 : 1;

      topicService.getOwnTopicListByUser(0, pageNum, vm.pageSize).then(function (res) {
        if (vm.topicList == null) {
          vm.topicList = res;
        }
        else {
          if (res.length > 0) {
            vm.topicList = vm.topicList.concat(res);
          }
        }

        if (res.length < vm.pageSize) {
          vm.canLoadMoreData = false;
        }
        else {
          vm.canLoadMoreData = true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }, function (err) {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    }


    vm.moreDataCanBeLoaded = function () {
      return vm.canLoadMoreData;
    }

    vm.go2TopicDetail = function (topic) {
      topicService.setCurrentDetailTopic(topic);
      $state.go('main.topic-group_topic-detail', {'topicId': topic.id});
    }

    vm.showImgs = function (imgList, event) {
      if (event != null) {
        event.stopPropagation();
      }

      var modalScope = $scope.$new();
      var imgItemList = new Array();
      for (var index = 0; index < imgList.length; ++index) {
        var item = {imgSrc: imgList[index]};
        imgItemList.push(item);
      }
      modalScope.imgList = imgItemList;
      $ionicModal.fromTemplateUrl('modules/main/playground/templates/show-imgs.html', {
        scope: modalScope,
        animation: "slide-in-up"
      }).then(function (modal) {
        modalScope.modal = modal;
        modal.show();
      });
    }

    vm.shareTopic = function (topic, event) {
      if (event != null) {
        event.stopPropagation();
      }
      topicService.shareTopic(topic);
    }

    vm.favouriteToggle = function (topic, event) {
      if (event != null) {
        event.stopPropagation();
      }

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

  }

  collectionTopicListControllerFn.$inject = ['$ionicModal', '$scope', '$state', '$log', '$timeout', '$ionicActionSheet', '$q',
    'topicService', 'PlaygroundNetService', 'userUtils', 'favouriteTopicService', 'filterTopicService', 'topicBlacklistService',
    'collectionTopicService'];
  function collectionTopicListControllerFn($ionicModal, $scope, $state, $log, $timeout, $ionicActionSheet, $q,
                                           topicService, PlaygroundNetService, userUtils, favouriteTopicService,
                                           filterTopicService, topicBlacklistService, collectionTopicService) {
    var vm = $scope.vm = {};
    vm.pageSize = 20;
    vm.canLoadMoreData = false;
    $scope.$on("$ionicView.beforeEnter", function () {
      vm.topicList = null;
      vm.loadMoreTopicList();
    });

    vm.cb_gotoUser = function (userId, event) {
      if (event != null) {
        event.stopPropagation();
      }

      userUtils.gotoUser(userId, 'topic-group');
    }

    vm.loadMoreTopicList = function () {
      var pageNum = (vm.topicList != null) ? Math.ceil(vm.topicList.length / vm.pageSize) + 1 : 1;

      topicService.getCollectionTopicListByUser(pageNum, vm.pageSize).then(function (res) {
        if (vm.topicList == null) {
          vm.topicList = res;
        }
        else {
          if (res.length > 0) {
            vm.topicList = vm.topicList.concat(res);
          }
        }

        if (res.length < vm.pageSize) {
          vm.canLoadMoreData = false;
        }
        else {
          vm.canLoadMoreData = true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }, function (err) {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    }


    vm.moreDataCanBeLoaded = function () {
      return vm.canLoadMoreData;
    }

    vm.go2TopicDetail = function (topic) {
      topicService.setCurrentDetailTopic(topic);
      $state.go('main.topic-group_topic-detail', {'topicId': topic.id});
    }

    vm.showImgs = function (imgList, event) {
      if (event != null) {
        event.stopPropagation();
      }

      var modalScope = $scope.$new();
      var imgItemList = new Array();
      for (var index = 0; index < imgList.length; ++index) {
        var item = {imgSrc: imgList[index]};
        imgItemList.push(item);
      }
      modalScope.imgList = imgItemList;
      $ionicModal.fromTemplateUrl('modules/main/playground/templates/show-imgs.html', {
        scope: modalScope,
        animation: "slide-in-up"
      }).then(function (modal) {
        modalScope.modal = modal;
        modal.show();
      });
    }

    vm.shareTopic = function (topic, event) {
      if (event != null) {
        event.stopPropagation();
      }
      topicService.shareTopic(topic);
    }

    vm.favouriteToggle = function (topic, event) {
      if (event != null) {
        event.stopPropagation();
      }

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

    vm.filterTopic = function (topic) {
      filterTopicService.addFilterTopic(topic.id, topic.groupId, topic.created).then(function (topicId) {
        topic.isShow = false;
        collectionTopicService.cancelCollectionTopic(topic.id);
      }, function (exception) {
        $log.error(exception);
      });
      //$log.info("add topic " + topicId + " to filter list");
    }

    vm.addTopic2BlackList = function (topic) {
      //$log.info("add topic " + topicId + " to black list");
      topicBlacklistService.addTopicBlacklist(topic.id).then(function (topicId) {
        topic.isShow = false;
        collectionTopicService.cancelCollectionTopic(topic.id);
      }, function (exception) {
        $log.error(exception);
      });
    }

    vm.moreOpt = function (topic, event) {
      if (event != null) {
        event.stopPropagation();
      }

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
  }

  myCommentListControllerFn.$inject = ['$scope', '$state', '$log', '$timeout', '$ionicActionSheet', '$q',
    'topicService', 'PlaygroundNetService', 'userUtils'];
  function myCommentListControllerFn($scope, $state, $log, $timeout, $ionicActionSheet, $q,
                                     topicService, PlaygroundNetService, userUtils) {
    var vm = $scope.vm = {};
    vm.pageSize = 20;
    vm.canLoadMoreData = false;
    $scope.$on("$ionicView.afterEnter", function () {
      vm.topicCommentList = null;
      vm.loadMoreCommentList();
    });

    vm.cb_gotoUser = function (userId) {
      userUtils.gotoUser(userId, 'topic-group');
    }

    vm.loadMoreCommentList = function () {
      var pageNum = (vm.topicCommentList != null) ? Math.ceil(vm.topicCommentList.length / vm.pageSize) + 1 : 1;

      PlaygroundNetService.getTopicCommentListByUser(pageNum, vm.pageSize).then(function (res) {
        if (vm.topicCommentList == null) {
          vm.topicCommentList = res;
        }
        else {
          if (res.length > 0) {
            vm.topicCommentList = vm.topicCommentList.concat(res);
          }
        }

        if (res.length < vm.pageSize) {
          vm.canLoadMoreData = false;
        }
        else {
          vm.canLoadMoreData = true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }, function (err) {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    }


    vm.moreDataCanBeLoaded = function () {
      return vm.canLoadMoreData;
    }

    vm.go2TopicDetail = function (topic) {
      topicService.setCurrentDetailTopic(topic);
      $state.go('main.topic-group_topic-detail', {'topicId': topic.id});
    }


  }

  myMessageListControllerFn.$inject = ['$scope', '$state', '$log', '$timeout', '$ionicActionSheet', '$q',
    'topicService', 'PlaygroundNetService', 'userUtils'];

  function myMessageListControllerFn($scope, $state, $log, $timeout, $ionicActionSheet, $q,
                                     topicService, PlaygroundNetService, userUtils) {
    var vm = $scope.vm = {};
    vm.pageSize = 20;
    vm.canLoadMoreData = false;
    $scope.$on("$ionicView.afterEnter", function () {
      vm.topicCommentList = null;
      vm.loadMoreCommentList();
    });

    vm.cb_gotoUser = function (userId) {
      userUtils.gotoUser(userId, 'topic-group');
    }

    vm.loadMoreCommentList = function () {
      var pageNum = (vm.topicCommentList != null) ? Math.ceil(vm.topicCommentList.length / vm.pageSize) + 1 : 1;

      PlaygroundNetService.getReplyMessageListByUserId(pageNum, vm.pageSize).then(function (res) {
        if (vm.topicCommentList == null) {
          vm.topicCommentList = res;
        }
        else {
          if (res.length > 0) {
            vm.topicCommentList = vm.topicCommentList.concat(res);
          }
        }

        if (res.length < vm.pageSize) {
          vm.canLoadMoreData = false;
        }
        else {
          vm.canLoadMoreData = true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }, function (err) {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    }


    vm.moreDataCanBeLoaded = function () {
      return vm.canLoadMoreData;
    }

    vm.go2TopicDetail = function (topic) {
      topicService.setCurrentDetailTopic(topic);
      $state.go('main.topic-group_topic-detail', {'topicId': topic.id});
    }
  }

  //////////////////////////////////////////////////
  function TagConnector() {
    var filter = function (data) {
      var ret = '';
      for (var i in data) {
        ret += '#' + data[i].name + '#';
        ret += '  ';
      }
      return ret;
    }

    return filter;
  }
})
();
