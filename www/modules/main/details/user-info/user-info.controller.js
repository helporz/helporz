/**
 * Created by Midstream on 16/4/25 .
 */

(function(){
  'use strict';

  angular.module('main.userInfo')
    .controller('mainUserInfoCtrl', ['$scope', '$timeout', '$stateParams', 'taskNetService', 'taskUtils', mainUserInfoCtrl]);

  function mainUserInfoCtrl($scope, $timeout, $stateParams, taskNetService, taskUtils) {
    console.log($stateParams);

    var vm = $scope.vm = {};

    $scope.$on("$ionicView.beforeEnter", function() {

    });


  }
})()
