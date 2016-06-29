/**
 * Created by Midstream on 16/4/26 .
 */

(function(){
  'use strict';

  angular.module('main.editSheet')

    .factory('mainEditSheetService', function(){
      return {
        title: 'err: no title',
        isInputOrTextarea: true,
        placeholder: '',
        className: ''
      }
    })

    .controller('mainEditSheetCtrl', ['$scope', 'mainEditSheetService', 'taskNetService', 'taskUtils',
      '$ionicHistory', mainEditSheetCtrl]);

  function mainEditSheetCtrl($scope, mainEditSheetService, taskNetService, taskUtils, $ionicHistory) {

    var vm = $scope.vm = {};

    vm.title = mainEditSheetService.title;
    vm.placeholder = mainEditSheetService.placeholder;
    vm.isInputOrTextarea = mainEditSheetService.isInputOrTextarea;
    vm.className = mainEditSheetService.className;
    vm.cb = mainEditSheetService.cb;

    $scope.$on("$ionicView.beforeEnter", function() {
      vm.mod_text = '';
    });

    vm.cb_back = function() {
      $ionicHistory.goBack(-1);
    }

    vm.cb_ok = function() {
      if(vm.cb) {
        vm.cb(vm.mod_text);
      }
    }





  }
})()
