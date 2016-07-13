/**
 * Created by Midstream on 16/4/28.
 */

(function () {

  'use strict'

  angular.module('components.widgets.hoTabSet')

    .controller('hoTabCtrl', ['$scope', hoTabCtrl]);

  function hoTabCtrl($scope) {
    this.$scope = $scope;
  };

})
()
