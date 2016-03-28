/**
 * Created by binfeng on 16/3/17.
 */
;(function(window) {
  "use strict";
    var intro = angular.module("service.intro",["ionic"]);
    intro.controller("introCtrl",["$scope","$state",function($scope,$state) {
      $scope.index = 0;
      $scope.onChanged = function(index) {
        if( index == 4){
          $state.go("login");
        }
      };

      $scope.enterApp = function() {
        $state.go("login");
      }
    }]);
  }
)(this);


