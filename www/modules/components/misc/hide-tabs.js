/**
 * Created by Midstream on 16/4/25.
 */

(function () {

  'use strict'

  // 隐藏导航栏
  angular.module('components.misc.hideTabs', [])
    .factory('hideTabsService', function () {
      //hideTab页面的栈深度,当它==0时,表明此时不再隐藏.
      var stack = 0;
      return {
        stack: stack
      };
    })

    .directive('hideTabs', ['$rootScope', 'hideTabsService', function ($rootScope, hideTabsService) {

      return {
        restrict: 'A',
        link: function (scope) {
          scope.$on('$ionicView.beforeEnter', function () {
            hideTabsService.stack++;
            $rootScope.hideTabs = 'tabs-item-hide';
          });

          scope.$on('$ionicView.beforeLeave', function () {
            hideTabsService.stack--;
            if(hideTabsService.stack < 0){
              console.log('error: hideTabs stack overflow')
            }
            else if (hideTabsService.stack == 0) {
              $rootScope.hideTabs = ' ';
            }
          });
        }
      }
    }]
  )
})
()
