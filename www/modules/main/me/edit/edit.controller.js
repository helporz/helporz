/**
 * Created by Midstream on 16/4/25 .
 */

(function(){
  'use strict';

  angular.module('main.edit')
    .controller('mainEditCtrl', ['$scope', '$timeout', '$state', '$stateParams', 'taskNetService', 'taskUtils', '$ionicHistory', mainEditCtrl]);

  function mainEditCtrl($scope, $timeout, $state, $stateParams, taskNetService, taskUtils, $ionicHistory) {
    console.log($stateParams);

    var vm = $scope.vm = {};

    $scope.$on("$ionicView.beforeEnter", function() {

    });

    vm.cb_back = function() {
      $ionicHistory.goBack(-1);
    }

    vm.userInfo = {

      fiveStarsValue: 3.2,
      level: 42,
      hasExp: 292,
      totalExp: 389,
      smallCards: 3,
      bigCards: 265,
      visitors: [
          {
            url: 'http://t3.gstatic.cn/shopping?q=tbn:ANd9GcSCrdZNZUIlGriVTE3ZWMU_W5voV8527Q6PL8RGkMjtCFO1knnY6oIS1soNKN4&usqp=CAI'
          },
          {
            url: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=545887065,3542527475&fm=58'
          },
          {
            url: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=1902539898,1226346465&fm=58'
          }
        ],

      visitorImgWithIndex: function (index) {
        if (angular.isDefined(this.visitors[index])) {
          return this.visitors[index].url;
        } else {
          return '';
        }
      },

      cb_visitorImg: function (index) {
        console.log('click on image [' + index + ']');
        $state.go('main.user-info', {id: 'user-'+index});
      }
    };



  }
})()
