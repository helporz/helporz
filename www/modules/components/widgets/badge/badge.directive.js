/**
 * Created by Midstream on 16/4/22.
 */

(function () {

  'use strict'

  angular.module('components.widgets.hoBadge', [])

    .directive('hoBadge', function () {

      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'modules/components/widgets/badge/badge.html',
        scope: {
          count: '=',
        },

        link: function (scope, element, attr) {

        //  scope.star = function(score){
        //    scope.$emit('fiveStarChanged', score);
        //  }
        //
        //  var refreshByValue = function (val) {
        //    var intVal = Math.floor(val);
        //    var floatVal = scope.value - intVal;
        //
        //    var starElements = element.children();
        //    var jqE = angular.element(starElements[0]);
        //
        //    var index = 0;
        //    for (; index < intVal; index++) {
        //      jqE.removeClass('ion-ios-star-outline');
        //      jqE.addClass('ion-ios-star');
        //      jqE = jqE.next();
        //    }
        //    for(; index < 5; index ++){
        //      jqE.removeClass('ion-ios-star');
        //      jqE.addClass('ion-ios-star-outline');
        //      jqE = jqE.next();
        //    }
        //    if (floatVal.toFixed(2) >= 0.50) {
        //      jqE.removeClass('ion-ios-star-outline');
        //      jqE.addClass('ion-ios-star-half');
        //    }
        //  };
        //
        //  refreshByValue(scope.value);
        //
        //  scope.$watch('value', function (newVal, oldVal) {
        //    refreshByValue(newVal);
        //  });
        }
      }
    }
  )


})
()
