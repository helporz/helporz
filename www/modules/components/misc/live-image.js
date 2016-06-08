/**
 * Created by Midstream on 16/4/23.
 */

(function () {

  'use strict'

  // 自动检测ng-src并替换图片
  // 绑定 e = 'on-click' 到点击图片 (使用ng-click时,element删除时,事件自然接触,所以这里在clone element后
  // 再绑定一次
  // usage: 点击事件用 on-click ,而不是 ng-click
  angular.module('components.misc.liveImage', [])

    .directive('liveImage', ['$ionicNgClick', function ($ionicNgClick) {

      return {

        restrict: 'A',
        link: function(scope, element, attrs) {
          var applyNewSrc = function(src) {
            if(angular.isDefined(src) && src !== ''){
              var newImg = element.clone(true);
              newImg.attr('src', src);
              element.replaceWith(newImg);
              element = newImg;

              $ionicNgClick(scope, element, attrs.onClick);
            }
          };

          $ionicNgClick(scope, element, attrs.onClick);

          attrs.$observe('ngSrc', applyNewSrc);
        }
      };
    }]
  )


})
()
