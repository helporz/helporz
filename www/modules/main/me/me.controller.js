/**
 * Created by Midstream on 16/3/29.
 */

(function () {
  'use strict';

  angular.module('main.me')
    .controller('mainMeCtrl', ['$state', '$scope','$ionicScrollDelegate', mainMeCtrl])
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

  function mainMeCtrl($state, $scope,$ionicScrollDelegate) {
    var vm = $scope.vm = {};

    vm.meScroll = $ionicScrollDelegate.$getByHandle('meScroll');
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

    vm.onChangeTab = function(href) {
      vm.meScroll.scrollTop();
      $state.go(href);
    }

  }


})()
