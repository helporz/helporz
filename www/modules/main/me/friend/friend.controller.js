/**
 * Created by Midstream on 16/4/19.
 */

(function(){
  'use strict';

  angular.module('main.me.friend')
    .controller('mainMeFriendCtrl', ['$scope', mainMeFriendCtrl]);

  function mainMeFriendCtrl($scope){
    //$scope.onDrag = function(ev){
    //  console.log('drag' + ':' + ev);
    //}
    //
    console.log('mainMeFriendCtrl');
    //
    //$scope.$broadcast('scroll.infiniteScrollComplete');
    //
    //var resize = function() {
    //  console.log('resize');
    //}
    //angular.element(window).on('resize', resize);
    //
    //$scope.$on("$ionicView.beforeEnter", function() {
    //  console.log('friend enter');
    //
    //});
    //
    //$scope.$broadcast('scroll.refreshComplete');
  }

})()
