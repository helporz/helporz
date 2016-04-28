/**
 * Created by binfeng on 16/4/22.
 */

(function () {
  'use strict';
  angular.module('com.helporz.playground')
    .controller('topicGroupController', topicGroupControllerFn)
    .controller('topicDetailController', topicDetailControllerFn)
    .controller('topicAddController', topicAddControllerFn)
    .controller('playgroundListController', playgroundListControllerFn);

  playgroundListControllerFn.$inject = ['$scope', '$state', '$log'];
  function playgroundListControllerFn($scope, $state, $log) {
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
    vm.groupList = [{
      'id': 1,
      'name': '捎带侠论坛',
      'description': '捎带侠们聚集起来',
      'pic': 'img/task/publish/shaodai-logo.png'
    }, {
      'id': 2,
      'name': '情报侠论坛',
      'description': '情报侠们聚集起来',
      'pic': 'img/task/publish/qingbao-logo.png'
    }, {
      'id': 3,
      'name': '借宝侠论坛',
      'description': '借宝侠们聚集起来',
      'pic': 'img/task/publish/jiebao-logo.png'
    }, {
      'id': 1,
      'name': '捎带侠论坛',
      'description': '捎带侠们聚集起来',
      'pic': 'img/task/publish/shaodai-logo.png'
    }, {
      'id': 2,
      'name': '情报侠论坛',
      'description': '情报侠们聚集起来',
      'pic': 'img/task/publish/qingbao-logo.png'
    }, {
      'id': 3,
      'name': '借宝侠论坛',
      'description': '借宝侠们聚集起来',
      'pic': 'img/task/publish/jiebao-logo.png'
    }, {
      'id': 1,
      'name': '捎带侠论坛',
      'description': '捎带侠们聚集起来',
      'pic': 'img/task/publish/shaodai-logo.png'
    }, {
      'id': 2,
      'name': '情报侠论坛',
      'description': '情报侠们聚集起来',
      'pic': 'img/task/publish/qingbao-logo.png'
    }, {
      'id': 3,
      'name': '借宝侠论坛',
      'description': '借宝侠们聚集起来',
      'pic': 'img/task/publish/jiebao-logo.png'
    }];

  }

  topicGroupControllerFn.$inject = ['$scope', '$stateParams', '$state', '$log','$timeout','$ionicActionSheet'];
  function topicGroupControllerFn($scope, $stateParams, $state, $log,$timeout,$ionicActionSheet) {
    var vm = $scope.vm = {};
    vm.groupId = $stateParams.groupId;
    vm.isFavourite = function (topicId) {
      return true;
    }

    vm.shareTopic = function(topicId) {

    }

    vm.favourite = function(topicId) {

    }

    vm.loadMore = function() {
      $timeout(function(){
        var topic = {
          'id':'3',
          'name': '大侠跨快快',
          'commentCount': 1,
          'favouriteCount': 1,
          'description': '大侠半帮帮忙',
          'created':'2016-4-27',
          'imgList': ['img/task/publish/jiebao-logo.png', 'img/task/publish/qingbao-logo.png'],
          'postor': {
            'name': '小泡泡',
            'gender': '2',
            'pic': 'img/task/publish/jiebao-logo.png',
            'org': {
              'name': '华中科技大学'
            }
          }
        };
        vm.userTopicList.push(topic);
        $scope.$broadcast('scroll.infiniteScrollComplete');
      },100);

    }

    vm.doRefresh = function() {
      $scope.$broadcast('scroll.refreshComplete');
    }

    vm.filterTopic = function(topicId) {
      $log.info("add topic " + topicId + " to filter list");
    }

    vm.addTopic2BlackList = function(topicId) {
      $log.info("add topic " + topicId + " to black list");
    }

    vm.moreOpt = function( topicId) {
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
          if( index == 0 ) {
            vm.filterTopic(topicId);
          }
          else if( index == 1) {
            vm.addTopic2BlackList(topicId);
          }
          return true;
        },
        //destructiveButtonClicked: function () {
        //  console.log('DESTRUCT');
        //  return true;
        //}
      });
    }

    vm.go2AddTopic = function() {
        $state.go('topic-add',{'groupId':vm.groupId});
    }

    vm.go2TopicDetail = function(topicId) {
      $state.go('topic-detail',{'topicId':topicId});
    }

    var groupList = [{
      'id': 1,
      'name': '捎带侠论坛',
      'description': '捎带侠们聚集起来',
      'publicNotice': '1.捎带侠们聚集起来<br/> 2.捎带侠们聚集起来 <br/>  3.2.捎带侠们聚集起来 ',
      'pic': 'img/task/publish/shaodai-logo.png'
    }, {
      'id': 2,
      'name': '情报侠论坛',
      'description': '情报侠们聚集起来',
      'publicNotice': '1.捎带侠们聚集起来<br/> 2.捎带侠们聚集起来 <br/>  3.2.捎带侠们聚集起来 ',
      'pic': 'img/task/publish/qingbao-logo.png'
    }, {
      'id': 3,
      'name': '借宝侠论坛',
      'description': '借宝侠们聚集起来',
      'publicNotice': '1.捎带侠们聚集起来<br/> 2.捎带侠们聚集起来 <br/>  3.2.捎带侠们聚集起来 ',
      'pic': 'img/task/publish/jiebao-logo.png'
    }, {
      'id': 1,
      'name': '捎带侠论坛',
      'description': '捎带侠们聚集起来',
      'publicNotice': '1.捎带侠们聚集起来<br/> 2.捎带侠们聚集起来 <br/> 3.2.捎带侠们聚集起来 ',
      'pic': 'img/task/publish/shaodai-logo.png'
    }, {
      'id': 2,
      'name': '情报侠论坛',
      'description': '情报侠们聚集起来',
      'publicNotice': '1.捎带侠们聚集起来<br/> 2.捎带侠们聚集起来 <br/> 3.2.捎带侠们聚集起来 ',
      'pic': 'img/task/publish/qingbao-logo.png'
    }, {
      'id': 3,
      'name': '借宝侠论坛',
      'description': '借宝侠们聚集起来',
      'publicNotice': '捎带侠们聚集起来 捎带侠们聚集起来 ',
      'pic': 'img/task/publish/jiebao-logo.png'
    }, {
      'id': 1,
      'name': '捎带侠论坛',
      'description': '捎带侠们聚集起来',
      'publicNotice': '捎带侠们聚集起来 捎带侠们聚集起来 ',
      'pic': 'img/task/publish/shaodai-logo.png'
    }, {
      'id': 2,
      'name': '情报侠论坛',
      'description': '情报侠们聚集起来',
      'publicNotice': '捎带侠们聚集起来 捎带侠们聚集起来 ',
      'pic': 'img/task/publish/qingbao-logo.png'
    }, {
      'id': 3,
      'name': '借宝侠论坛',
      'description': '借宝侠们聚集起来',
      'publicNotice': '捎带侠们聚集起来 捎带侠们聚集起来 ',
      'pic': 'img/task/publish/jiebao-logo.png'
    }];

    vm.topicGroup = groupList[vm.groupId];



    vm.sysTopicList = [{
      'id':'1',
      'name': '大侠半帮帮忙',
      'commentCount': 0,
      'favouriteCount': 1,
      'description': '大侠半帮帮忙',
      'created':'2016-4-27',
      'imgList': ['img/task/publish/shaodai-logo.png', 'img/task/publish/jiebao-logo.png'],
      'postor': {
        'name': '系统管理员',
        'gender': '1',
        'pic': 'img/task/publish/jiebao-logo.png',
        'org': {
          'name': '华中科技大学'
        }
      }
    },
      {
        'id':'2',
        'name': '大侠半帮帮忙',
        'commentCount': 0,
        'favouriteCount': 1,
        'description': '大侠半帮帮忙',
        'created':'2016-4-27',
        'imgList': ['img/task/publish/shaodai-logo.png', 'img/task/publish/jiebao-logo.png'],
        'postor': {
          'name': '系统管理员',
          'gender': '1',
          'pic': 'img/task/publish/jiebao-logo.png',
          'org': {
            'name': '华中科技大学'
          }
        }
      }
    ];
    vm.userTopicList = [{
      'id':'1',
      'name': '大侠半帮帮忙',
      'commentCount': 0,
      'favouriteCount': 1,
      'description': '大侠半帮帮忙',
      'created':'2016-4-27',
      'imgList': ['img/task/publish/shaodai-logo.png', 'img/task/publish/jiebao-logo.png'],
      'postor': {
        'name': '小泡泡',
        'gender': '2',
        'pic': 'img/task/publish/jiebao-logo.png',
        'org': {
          'name': '华中科技大学'
        }
      }
    },{
      'id':'2',
      'name': '大侠半帮帮忙1',
      'commentCount': 1,
      'favouriteCount': 1,
      'description': '大侠半帮帮忙',
      'created':'2016-4-27',
      'imgList': ['img/task/publish/shaodai-logo.png', 'img/task/publish/jiebao-logo.png'],
      'postor': {
        'name': '小泡泡',
        'gender': '2',
        'pic': 'img/task/publish/jiebao-logo.png',
        'org': {
          'name': '华中科技大学'
        }
      }
    }];
  }


  topicDetailControllerFn.$inject = ['$scope', '$stateParams', '$state', '$log','$timeout','$ionicActionSheet'];
  function topicDetailControllerFn($scope, $stateParams, $state, $log,$timeout,$ionicActionSheet) {

  }

  topicAddControllerFn.$inject = ['$scope', '$stateParams', '$state', '$log','$timeout','$ionicActionSheet'];
  function topicAddControllerFn($scope, $stateParams, $state, $log,$timeout,$ionicActionSheet) {

  }
})();
