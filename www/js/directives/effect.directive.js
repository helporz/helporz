/**
 * Created by Midstream on 16/4/17.
 */

(function () {

  'use strict'

  angular.module('app.effect.directive', [])

    .directive('scaleTopBg', function ($timeout, $document) {

      return function (scope, element, attr) {
        element.css({
          position: 'fixed',
          transformOrigin: 'top',
          webkitTransformOrigin: 'top'
        });


        //scope.parentTrans = (element.parent())[0]
        //console.log('parent=' + scope.parentTrans.scrollHeight)

        //$timeout(
        //  function () {
        //    scope.$apply(function () {
        //      return scope.parentTrans.style.transform;
        //    })
        //  },
        //  0
        //)

        //var w = element.prop('clientWidth');
        var h = element.prop('clientHeight');

        ionic.onGesture('scroll', function (data) {
            //console.log('scroll.....' + data.detail.scrollTop);
            if (angular.isDefined(data.detail.scrollTop) && data.detail.scrollTop > 0) {
            } else {
              var rate = 1 + (-data.detail.scrollTop / h);
              element.css({
                transform: 'translate3d(0px,' + data.detail.scrollTop + 'px,0px) scale(' + rate + ')',
                webkitTransform: 'translate3d(0px,' + data.detail.scrollTop + 'px,0px) scale(' + rate + ')'
              })
            }
          }
          ,
          element.parent().parent()[0]
        )
        ;

        //scope.$watch(
        //  function () {
        //    return element.prop('style').width;
        //  }
        //  ,
        //  function () {
        //    console.log('log' + scope.parentTrans.style.transform);
        //  }
        //)
      }
    }
  )
})
()
