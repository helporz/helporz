/**
 * Created by Midstream on 16/4/19.
 */

(function(){
  'use strict';

  angular.module('main.me.self')
    .controller('mainMeSelfCtrl', ['$scope', mainMeSelfCtrl]);

  function mainMeSelfCtrl($scope){
    //$scope.onDrag = function(ev){
    //  console.log('drag' + ':' + ev);
    //}
    //
    console.log('mainMeSelfCtrl');
    //
    //$scope.$on("$ionicView.beforeEnter", function() {
    // console.log('self enter');
    //});
    //
    //$scope.$broadcast('scroll.refreshComplete');
  }

})()
