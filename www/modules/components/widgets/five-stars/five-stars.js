/**
 * Created by Midstream on 16/4/22.
 */

(function () {

  'use strict'

  angular.module('components.widgets.fiveStars', [])

    .directive('fiveStars', function () {

      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'modules/components/widgets/five-stars/five-stars.html',
        scope: {
          value: '='
        },

        link: function (scope, element, attr) {

          scope.star = function(score){
            scope.$emit('fiveStarChanged', score);
          }

          var refreshByValue = function (val) {
            var intVal = Math.floor(val);
            var floatVal = scope.value - intVal;

            var starElements = element.children();
            var jqE = angular.element(starElements[0]);

            var index = 0;
            for (; index < intVal; index++) {
              //jqE.removeClass('ion-ios-star-outline');
              //jqE.addClass('ion-ios-star');

              jqE[0].setAttribute('src', 'img/user/star-full.png');

              jqE = jqE.next();
            }
            if (floatVal.toFixed(2) >= 0.50) {
              //jqE.removeClass('ion-ios-star-outline');
              //jqE.addClass('ion-ios-star-half');

              jqE[0].setAttribute('src', 'img/user/star-half.png');
              jqE = jqE.next();
              index++;
            }
            for(; index < 5; index ++){
              //jqE.removeClass('ion-ios-star');
              //jqE.addClass('ion-ios-star-outline');

              jqE[0].setAttribute('src', 'img/user/star-none.png');

              jqE = jqE.next();
            }

          };

          refreshByValue(scope.value);

          scope.$watch('value', function (newVal, oldVal) {
            refreshByValue(newVal);
          });
        }
      }
    }
  )

})
()
