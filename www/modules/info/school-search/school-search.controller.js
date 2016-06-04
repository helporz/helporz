/**
 * Created by Midstream on 16/3/29.
 */

(function () {
  'use strict';

  angular.module('info.schoolSearch')
    .controller('schoolSearchCtrl', ['$state', '$scope', '$ionicLoading', '$ionicPopup', '$ionicScrollDelegate', '$ionicActionSheet',
      '$timeout', '$interval', 'userNetService',
      'errorCodeService', schoolSearchCtrl])

  function schoolSearchCtrl($state, $scope, $ionicLoading, $ionicPopup, $ionicScrollDelegate, $ionicActionSheet,
                      $timeout, $interval, userNetService, errorCodeService) {
    var vm = $scope.vm = {};

  }


})()
