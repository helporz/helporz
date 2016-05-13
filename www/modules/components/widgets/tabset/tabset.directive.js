/**
 * Created by Midstream on 16/4/28.
 */

(function () {

  'use strict'

  angular.module('components.widgets.hoTabSet')

    .directive('hoTabSet', hoTabSet);

  hoTabSet.$inject = ['widgetDelegate'];

  function hoTabSet(widgetDelegate) {
    return {
      restrict: 'E',
      controller: 'hoTabSetCtrl',

      //note: 这里如果声明成独立scope,将不能通过$broadcast与子通信了!!!
      //改用attr传递参数
      //
      //scope: {
      //  widgetId: '@',
      //  firstOn: '='
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

            if(attr['widgetId'] !== undefined){
              widgetDelegate.unregister('hoTabSet', attr['widgetId'], tabSetCtrl);
            }
          });

          if(attr['widgetId'] !== undefined){
            widgetDelegate.register('hoTabSet', attr['widgetId'], tabSetCtrl);
          }
        }

        function postLink(scope, element, attr, tabSetCtrl) {
          if (attr['firstOn'] == undefined) {
            if (!tabSetCtrl.selectedTab()) {
              tabSetCtrl.select(0);
            }
          }
          else if(attr['firstOn'] == 'last'){
            var index = widgetDelegate.getWidgetStatic('hoTabSet', attr['widgetId']).last;
            if(ho.isValid(index)){
              tabSetCtrl.select(index)
            }else{
              tabSetCtrl.select(0);
            }
          }
          else{
            tabSetCtrl.select(parseInt(attr['firstOn']));
          }
        }
      }
    }
  }

})
()
