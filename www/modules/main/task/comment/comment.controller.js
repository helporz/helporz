/**
 * Created by Midstream on 16/3/29.
 */

(function () {
    'use strict';

    angular.module('main.comment')
      .controller('mainCommentCtrl', ['$stateParams', '$log', '$ionicLoading', '$ionicPopup',
        '$scope', 'taskNetService', 'taskUtils', mainCommentCtrl]);

    var impressUi = [
      {
        text:'热情',
        className:'impress-1'
      },
      {
        text:'高冷',
        className:'impress-2'
      },
      {
        text:'可爱',
        className:'impress-3'
      },
      {
        text:'有趣',
        className:'impress-4'
      },
      {
        text:'耐心',
        className:'impress-5'
      },
      {
        text:'迅速',
        className:'impress-6'
      },
      {
        text:'细心',
        className:'impress-7'
      },
      {
        text:'爽快',
        className:'impress-8'
      },
      {
        text:'马虎',
        className:'impress-9'
      },
      {
        text:'小气',
        className:'impress-10'
      },
      {
        text:'拖沓',
        className:'impress-11'
      },
      {
        text:'暴躁',
        className:'impress-12'
      },
    ]


    function mainCommentCtrl($stateParams, $log, $ionicLoading, $ionicPopup, $scope, taskNetService, taskUtils) {
      var vm = $scope.vm = {};

      vm.starClick = function(starCount){
        console.log('five star count:' + starCount);
      }

      //vm.commentLevel = 0;
      //$scope.$watch(vm.commentLevel, function(newVal){
      //  console.log('five star count:' + newVal);
      //})

      vm.starScore = 0;
      $scope.$on('fiveStarChanged', function(evt, score){
        console.log(score);
        vm.starScore = score;
      })

      vm.commentText = '';


      vm.impress = [];
      vm.impressIndices = [];

      vm.cb_impressSelect = function(index) {
        if(vm.impress.length <3){
          vm.impress.push(impressUi[index-1]);
          vm.impressIndices.push(index-1);
        }
      };

      vm.cb_impressDiselect = function(index) {
        vm.impress.splice(index, 1);
        vm.impressIndices.splice(index, 1);
      }

      $scope.$on("$ionicView.beforeEnter", function() {
        var params = $stateParams.desc.split('-');
        vm.isAccepter = true;
        if(params[0] == 'accepter'){
          vm.isAccepter = true;
        }else if(params[0]=='poster'){
          vm.isAccepter = false;
        }else{
          console.error('err: not accepter or poster, wrong stateParam')
        }

        vm.taskId = params[1];

        vm.task = taskNetService.cache.acceptTaskList[params[1]];
      });

      vm.submit = function(){
        $ionicLoading.show();

        //is acceptor
        if(vm.isAccepter){
          //ask:xiaolang, fourth param 'tagList' is array?
          taskNetService.commentByAcceptor(vm.taskId, vm.starScore, vm.commentText, vm.impressIndices).then(
            function (data, status) {
              console.log(data);
              if (status == 200) {
              } else {
              }
            }, function (data, status) {
              $ionicPopup.alert({
                title: '错误提示',
                template: data
              }).then(function (res) {
                console.error(data);
              })
            }).finally(function () {
              $ionicLoading.hide();
            });
        }
        // is poster
        else{
          taskNetService.commentByPoster(task.id, vm.starScore, vm.commentText, vm.impressIndices).then(
            function (data, status) {
              console.log(data);
              if (status == 200) {
              } else {
              }
            }, function (data, status) {
              $ionicPopup.alert({
                title: '错误提示',
                template: data
              }).then(function (res) {
                console.error(data);
              })
            }).finally(function () {
              $ionicLoading.hide();
            });
        }



      }
    }
  })
()
