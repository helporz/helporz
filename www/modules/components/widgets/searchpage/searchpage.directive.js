/**
 * Created by Midstream on 16/4/22.
 */

(function () {

  'use strict'

  angular.module('components.widgets.searchPage', [])

    .directive('searchPage', function () {

      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'modules/components/widgets/searchPage/searchPage.html',
        scope: {
          dataSource: '='
        },

        link: function (scope, element, attr) {

          var cb_selectItem = function(index){
          }

          scope.$watch('input', function(){
            for(var i in scope.dataSource) {
              if(scope.dataSource.indexOf(scope.input)){
                scope.dataSource[i].show = false;
              } else {
                scope.dataSource[i].show = true;
              }
            }
          });

        }
      }
    }
  )


})
()
