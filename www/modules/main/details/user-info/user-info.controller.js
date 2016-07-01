/**
 * Created by Midstream on 16/4/25 .
 */

(function () {
  'use strict';

  angular.module('main.userInfo')
    .controller('mainUserInfoCtrl', ['$scope', '$timeout', '$state', '$stateParams', '$ionicLoading', 'taskNetService', 'userNetService', 'taskUtils',
      '$ionicHistory', '$ionicActionSheet', 'impressUtils', mainUserInfoCtrl]);

  function mainUserInfoCtrl($scope, $timeout, $state, $stateParams, $ionicLoading, taskNetService, userNetService,
                            taskUtils, $ionicHistory, $ionicActionSheet, impressUtils) {
    console.log($stateParams);

    var vm = $scope.vm = {};

    vm.userInfo = {};

    $scope.$on("$ionicView.beforeEnter", function () {
      vm.userInfo.remoteData = userNetService.cache.userInfo[$stateParams.id];

      var impressUI = impressUtils.impressUI();
      vm.userInfo.ui_tags = vm.userInfo.remoteData.tags.concat();
      vm.userInfo.ui_tags = [impressUI[0], impressUI[2], impressUI[3]];

      // 是否已关注
      vm.userInfo.isFollowed = false;
      var followList = userNetService.cache.selfInfo.attentionList;
      for(var i in followList) {
        if(followList[i].userId == vm.userInfo.remoteData.userId) {
          vm.userInfo.isFollowed = true;
          break;
        }
      }
    });

    vm.userInfo.accessUserAvatar = function (index) {
      if (ho.isValid(vm.userInfo.remoteData)) {
        var size = vm.userInfo.remoteData.accessUserList.length;
        if (index < size) {
          return vm.userInfo.remoteData.accessUserList[index].avatar;
        } else {
          return '';
        }
      } else {
        return '';
      }
    }

    vm.cb_back = function () {
      $ionicHistory.goBack(-1);
    }


    vm.userInfo.cb_visitorImg = function (index) {
      console.log('click on image [' + index + ']');

      var user = vm.userInfo.remoteData.accessUserList[index];

      if (userNetService.cache.userInfo[user.userId]) {
        $state.go('main.user-info', {id: user.userId});
      }
      else {
        $ionicLoading.show();
        userNetService.getUserInfo(user.userId,
          function (data) {
            console.log(data);
            $state.go('main.user-info', {id: user.userId});
          },
          function (data, status) {
            $ionicPopup.alert({
              title: '错误提示',
              template: data.data.message
            }).then(function (res) {
              console.error(data);
            })
          });
        $ionicLoading.hide();
      }

    }

    vm.userInfo.cb_follow = function() {
      if(!vm.userInfo.isFollowed) {

        $ionicLoading.show();
        userNetService.attention(vm.userInfo.remoteData.userId).then(
          function (data) {
            $ionicLoading.hide();
            $ionicLoading.show({
              duration: 1500,
              templateUrl: 'modules/components/templates/ionic-loading/user-follow-success.html'
            });

            vm.userInfo.isFollowed = true;

            ////检查粉丝列表是否有他
            //var followedList = userNetService.cache.selfInfo.funsList;
            //var isHeFollowMe = false;
            //for(var i in followedList) {
            //  if(followedList[i].userId == vm.userInfo.remoteData.userId) {
            //    isHeFollowMe = true;
            //    break;
            //  }
            //}

            //shift()
            userNetService.cache.selfInfo.attentionList.splice(0, 0, data.data);

          }, function (data) {
            $ionicLoading.hide();
            ho.alertObject(data);
          }).finally(function () {
          });

      }else{


        $ionicActionSheet.show({
          titleText: "真的要取消关注么",
          buttons: [
            {text: "<b>是</b>"},
            {text: "<b>否</b>"}
          ],
          buttonClicked: function (index) {
            if(index == 0) {
              $ionicLoading.show();
              userNetService.unattention(vm.userInfo.remoteData.userId).then(
                function (data) {
                  $ionicLoading.hide();
                  $ionicLoading.show({
                    duration: 1500,
                    templateUrl: 'modules/components/templates/ionic-loading/com-cancel-success.html'
                  });

                  vm.userInfo.isFollowed = false;

                  //从列表删除
                  var followList = userNetService.cache.selfInfo.attentionList;
                  for(var i in followList) {
                    if(followList[i].userId == vm.userInfo.remoteData.userId) {
                      followList.splice(i, 1);
                      break;
                    }
                  }
                }, function (data) {
                  $ionicLoading.hide();
                  ho.alertObject(data);
                }).finally(function () {
                });
            }

            return true;
          },
          cancelText: "取消",
          cancel: function () {
            // add cancel code..
          },
          destructiveButtonClicked: function () {
          }
        })
      }
    }

  };

})()
