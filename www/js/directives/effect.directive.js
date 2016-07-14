/**
 * Created by Midstream on 16/4/17.
 */

(function () {

  'use strict'

  angular.module('app.directives', [])

    //lkj:
    .directive('scaleTopBg', ['$timeout', '$document', function ($timeout, $document) {

      return function (scope, element, attr) {
        element.css({
          position: 'fixed',
          transformOrigin: 'top',
          webkitTransformOrigin: 'top'
        });

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
  ])

    //lkj:
    //用于ionTab内部不关联ion-nav-view的情况.
    //ionTab在不绑定*-view时,计算出的class和css不匹配,所以这里加了个后处理directive,来修正
    //note: 由于ionTab的标准用法关联ion-nav-view,使用ui-view替换也有不确定的地方,所以建议使用页内div,不进行路由跳转
    .directive('tabSimple', function ($parse) {
      return {
        priority: 100,
        link: function (scope, $element, $attrs) {
          scope.$on('changeTab', function (ev, data) {
            //ionTab在编译时动态增加兄弟节点,兄弟节点负责ui展示,这里找到兄弟节点,修改其class
            var itemEl = $element.next().next();
            if (parseInt($attrs.tabIndex) != data) {
              itemEl.removeClass('tab-item-active');
            } else {
              itemEl.addClass('tab-item-active');
            }
          });
        }
      }

    })
})
()
