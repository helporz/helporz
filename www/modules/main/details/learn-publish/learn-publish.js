/**
 * Created by Midstream on 16/7/26 .
 */

(function () {
  'use strict';

  angular.module('main')

    .factory('learnPublishService', ['$rootScope', '$ionicPopover', '$timeout',
      function ($rootScope, $ionicPopover, $timeout) {

        return {
          show: show,
        }

        function show() {
          var _pov;

          function _close() {
            var po = _pov.$el[0].querySelector('#learn-publish-popup');
            po.style.opacity = '0';
            //$timeout(function(){
            _pov.hide();
            //},300);

          }

          var scope = $rootScope.$new();
          scope.close = _close;
          $ionicPopover.fromTemplateUrl('modules/main/details/learn-publish/learn-publish.html', {
            title: null,
            subTitle: null,
            scope: scope
          }).then(function (pov) {
            _pov = pov;
            _pov.show();

            var po = _pov.$el[0].querySelector('#learn-publish-popup');
            $timeout(function () {
              po.style.opacity = '1';
            })
          });
        }
      }]);

})()
