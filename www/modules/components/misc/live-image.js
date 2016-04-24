/**
 * Created by Midstream on 16/4/23.
 */

(function () {

  'use strict'

  // 自动检测src并替换图片
  angular.module('components.misc.liveImage', [])

    .directive('liveImage', function () {

      return {

        restrict: 'A',
        link: function(scope, element, attrs) {
          var applyNewSrc = function(src) {
            if(angular.isDefined(src) && src !== ''){
              var newImg = element.clone(true);
              newImg.attr('src', src);
              element.replaceWith(newImg);
              element = newImg;
            }
          };

          //attrs.$observe('src', applyNewSrc);
          attrs.$observe('ngSrc', applyNewSrc);
        }
      };
    }
  )


})
()
