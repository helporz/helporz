/**
 * Created by Midstream on 16/4/22.
 */

(function () {

  'use strict'

  angular.module('components.ui.fiveStars', [])

    .directive('fiveStars', function () {

      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'modules/components/ui/five-stars/five-stars.html',
        scope: {
          value: '='
        },

        link: function (scope, element, attr) {

          var refreshByValue = function (val) {
            var intVal = Math.floor(val);
            var floatVal = scope.value - intVal;

            var starElements = element.children();
            var jqE = angular.element(starElements[0]);
            for (var index = 0; index < intVal; index++) {
              jqE.removeClass('ion-ios-star-outline');
              jqE.addClass('ion-ios-star');
              jqE = jqE.next()
            }
            if (floatVal.toFixed(2) >= 0.50) {
              jqE.removeClass('ion-ios-star-outline');
              jqE.addClass('ion-ios-star-half');
            }
          };

          refreshByValue(scope.value);

          scope.$watch('value', function (oldVal, newVal) {
            refreshByValue(newVal);
          });
        }
      }
    }
  )


})
()
