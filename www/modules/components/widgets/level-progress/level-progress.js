/**
 * Created by Midstream on 16/4/22.
 */

(function () {

  'use strict'

  angular.module('components.widgets.levelProgress', [])

    .directive('levelProgress', function () {

      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'modules/components/widgets/level-progress/level-progress.html',
        scope: {
          hasExp: '=',
          totalExp: '=',
          level: '='
        },

        link: function (scope, element, attr) {

          var refresh = function(){
            var percent = parseInt(scope.hasExp / scope.totalExp * 100);
            var txtExp = '' + scope.hasExp + '/' + scope.totalExp;

            var bgEle = angular.element(element.children()[0]);
            var barEle = angular.element(bgEle.children()[0]);
            barEle.css({
              width: '' + percent + '%'
            })

            var levelBadgeCtnEle = angular.element(barEle.children()[0]);
            var levelBadgeEle = angular.element(levelBadgeCtnEle.children()[0]);
            var levelEle = angular.element(levelBadgeEle.children()[0]);
            levelEle.html('' + scope.level);

            var expEle = bgEle.next();
            expEle.html(txtExp);
          }

          scope.$watch('totalExp', function(){
            refresh();
          })

        }
      }
    }
  )


})
()
