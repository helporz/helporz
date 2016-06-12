/**
 * Created by Midstream on 16/6/11.
 */

(function () {

  'use strict'

  angular.module('components.misc.clamp', [])

    .directive('clamp', [ function () {

      return {

        restrict: 'A',
        link: function(scope, element, attrs) {


          var applyNewContent = function(content) {
            if (ho.isValid(content)) {
              element[0].innerText = content;

              if(content.length > 30) {
                //$clamp(element[0], {clamp: 2});
                element.css({
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  webkitBoxOrient: 'vertical',
                  display: '-webkit-box',
                  webkitLineClamp: 2
                })
              }else {
                element.css({
                  display: 'flex'
                });
                element.css({
                  display: '-webkit-flex',
                  webkitBoxOrient: 'horizontal'});
              }

              // 这种方法在手机上太卡了
              //$( "p.summary" ).dotdotdot();
            }
          }

          attrs.$observe('clamp', applyNewContent);
        }
      };
    }]
  )


})
()
