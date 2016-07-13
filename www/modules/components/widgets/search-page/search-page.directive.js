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
        templateUrl: 'modules/components/widgets/search-page/search-page.html',
        scope: {
          items: '='
        },

        link: function (scope, element, attr) {

          var cb_selectItem = function(index){
          }

          scope.ui_items = [];

          scope.$watch('input', function(val){
            if(typeof val == 'undefined' || val==''){

              scope.ui_items = scope.items;
            }
            else{
              scope.ui_items = [];
              for(var i in scope.items) {

                if(scope.items[i].name.indexOf(val) != -1){
                  scope.ui_items.push(scope.items[i])
                }
              }
            }

          });

        }
      }
    }
  )


})
()
