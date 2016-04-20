/**
 * Created by Midstream on 16/3/29.
 */

(function () {
  'use strict';

  angular.module('main.me')
    .controller('mainMeCtrl', ['$state', '$scope', mainMeCtrl])
    //.directive('tabLogic', function(){
    //  return function(scope, element, attr){
    //    if(attr.navView == 'inactive'){
    //      element.css({
    //        display: 'none'
    //      })
    //    }
    //  }
    //}
    //);

  function mainMeCtrl($state, $scope) {
    var vm = $scope.vm = {};

    vm.edit = function () {
      $state.go('main.me.friend');
    }

    vm.onSelect = function(index) {
      if (index == 0) {
        console.log('onselect' + ':' + ev);
      }
      else{
        console.log('onselect' + ':' + ev);
      }
    }
    $scope.onDrag = function (ev) {
      console.log('drag' + ':' + ev);
    }


  }


})()
