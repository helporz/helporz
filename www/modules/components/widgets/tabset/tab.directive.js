/**
 * Created by Midstream on 16/4/28.
 */

(function () {

  'use strict'

  angular.module('components.widgets.hoTabSet')

    .directive('hoTab', hoTab);

  function hoTab() {

    return {
      restrict: 'E',
      require: ['^hoTabSet', 'hoTab'],
      controller: 'hoTabCtrl',
      scope: {
        onSelect: '&'
      },

      compile: function (element, attr) {


        return function link(scope, element, attr, ctrls) {
          var tabSetCtrl = ctrls[0],
            tabCtrl = ctrls[1];

          tabSetCtrl.add(scope);
          scope.$on('$destroy', function () {
              //if (!scope.$tabsDestroy) {
              //  // if the containing ionTabs directive is being destroyed
              //  // then don't bother going through the controllers remove
              //  // method, since remove will reset the active tab as each tab
              //  // is being destroyed, causing unnecessary view loads and transitions
              //  tabSetCtrl.remove(scope);
            }
          );

          scope.$tabSelected = false;

          scope.selectTab = function (e) {
            e.preventDefault();
            tabSetCtrl.select(tabCtrl.$scope, true);
          };

          //if (!attr.ngClick) {
            element.on('click', function (event) {
              scope.$apply(function () {
                scope.selectTab(event);
              });
            });
          //}

          function styleTab() {
            if (tabSetCtrl.selectedTab() === tabCtrl.$scope) {
              element.addClass('tab-item-active');
            }
            else {
              element.removeClass('tab-item-active');
            }
          }

          scope.$on("tabSelected", styleTab);

          styleTab();
        }
      }


    }
  }

})
()
