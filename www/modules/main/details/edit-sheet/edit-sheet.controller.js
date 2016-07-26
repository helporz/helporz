/**
 * Created by Midstream on 16/4/26 .
 */

(function(){
  'use strict';

  angular.module('main')

    .factory('mainEditSheetService', function(){
      return {
        title: 'err: no title',
        isInputOrTextarea: true,
        placeholder: '',
        content: '',
        className: '',
        max: -1
      }
    })

    .controller('mainEditSheetCtrl', ['$scope', 'mainEditSheetService', 'taskNetService', 'taskUtils',
      '$ionicHistory', mainEditSheetCtrl]);

  function mainEditSheetCtrl($scope, mainEditSheetService, taskNetService, taskUtils, $ionicHistory) {

    var vm = $scope.vm = {};

    $scope.service = mainEditSheetService;
    vm.title = mainEditSheetService.title;
    vm.placeholder = mainEditSheetService.placeholder;
    vm.mod_text = mainEditSheetService.content;
    mainEditSheetService.content = '';
    vm.isInputOrTextarea = mainEditSheetService.isInputOrTextarea;
    vm.className = mainEditSheetService.className;
    vm.cb = mainEditSheetService.cb;

    $scope.$on("$ionicView.beforeEnter", function() {
    });

    vm.cb_checkText = function() {
      if(vm.mod_text.length > mainEditSheetService.max) {
        vm.mod_text = vm.mod_text.substr(0, mainEditSheetService.max);
      }
    }

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
