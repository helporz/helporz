/**
 * Created by Midstream on 16/3/29.
 */

(function(){
  'use strict';

  angular.module('main.near')
    .controller('mainNearCtrl', ['$scope', mainNearCtrl]);

  function mainNearCtrl($scope) {
    var vm = $scope.vm = {};
    vm.items = [];
    for (var i = 0; i < 30; i++) {
      vm.items.push('Item ' + i);
    }
  }
})()
