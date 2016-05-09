/**
 * Created by Midstream on 16/4/28.
 */

(function () {

  'use strict'

  angular.module('components.widgets.hoTabSet')

    .directive('hoTabSet', hoTabSet);

  function hoTabSet() {
    return {
      restrict: 'E',
      controller: 'hoTabSetCtrl',
      //scope: {
      //  widgetId: '@'
      //},

      compile: function (element) {
        return {pre: preLink, post: postLink};
        function preLink(scope, element, attr, tabSetCtrl) {

          scope.$on('$destroy', function () {
            // variable to inform child tabs that they're all being blown away
            // used so that while destorying an individual tab, each one
            // doesn't select the next tab as the active one, which causes unnecessary
            // loading of tab views when each will eventually all go away anyway
            scope.$tabsDestroy = true;
            tabSetCtrl.$tabsElement = tabSetCtrl.$element = tabSetCtrl.$scope = null;
          });
        }

        function postLink(scope, element, attr, tabSetCtrl) {
          if (!tabSetCtrl.selectedTab()) {
            tabSetCtrl.select(0);
          }
        }
      }
    }
  };


})
()
