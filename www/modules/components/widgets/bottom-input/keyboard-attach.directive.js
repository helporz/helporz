
(function () {

  'use strict'

  angular.module('components.widgets.hoBottomInput')
    .directive('hoKeyboardAttach', ['$timeout', function ($timeout) {
      return function (scope, element) {
        ionic.on('native.keyboardshow', onShow, window);
        ionic.on('native.keyboardhide', onHide, window);

        //deprecated
        ionic.on('native.showkeyboard', onShow, window);
        ionic.on('native.hidek  eyboard', onHide, window);


        var scrollCtrl;

        //lkj keyboard: make defualt transition css
        var css = {};
        css[ionic.CSS.TRANSITION_DURATION] = '500ms';
        css['-webkit-transition-timing-function'] = 'cubic-bezier(0.36, 0.66, 0.04, 1)';
        css['transition-timing-function'] = 'cubic-bezier(0.36, 0.66, 0.04, 1)';

        //lkj fix: ios 8+中UIKeyboardWillShowNotification触发多次
        var time = 0;

        function onShow(e) {
          console.log('ios trigger keyboardshow');

          // time++;
          // if(time == 1 || time > 2) {
          //   return;
          // }
          // //短时间多次触发时，屏蔽之
          // if(time == 2) {
          //   $timeout(function(){
          //     time = 0;
          //   },500);
          // }

          console.log('actually trigger keyboardshow');


          $timeout(function () {
            if (ionic.Platform.isAndroid() && !ionic.Platform.isFullScreen) {
              return;
            }

            //for testing
            var keyboardHeight = e.keyboardHeight || (e.detail && e.detail.keyboardHeight);


            //lkj test
            // keyboardHeight = 310;
            // element.css('bottom', keyboardHeight + "px");


            ////////////
            var dest = '-' + keyboardHeight + 'px';
            css[ionic.CSS.TRANSFORM] = 'translate3d(0, ' + dest + ', 0)';
            ionic.DomUtil.cachedStyles(element, css);
            ////////////

            scrollCtrl = element.controller('$ionicScroll');
            if (scrollCtrl) {
              // scrollCtrl.scrollView.__container.style.bottom = keyboardHeight + keyboardAttachGetClientHeight(element[0]) + "px";


              // var dest = "-" + (keyboardAttachGetClientHeight(element[0])+ 210) + "px";
              var dest = "-" + keyboardHeight + "px";
              css[ionic.CSS.TRANSFORM] = 'translate3d(0, ' + dest + ', 0)';
              ionic.DomUtil.cachedStyles(scrollCtrl.scrollView.__container, css);

            }
          }, 40);

        }

        function onHide() {
          if (ionic.Platform.isAndroid() && !ionic.Platform.isFullScreen) {
            return;
          }

          // element.css('bottom', '');

          ////////////
          css[ionic.CSS.TRANSFORM] = 'translate3d(0, 0, 0)';
          ionic.DomUtil.cachedStyles(element, css);


          ////////////

          if (scrollCtrl) {
            scrollCtrl.scrollView.__container.style.bottom = '';
            // scrollCtrl.resize();  //lkj keyboard: add this to fix ionic bug


            css[ionic.CSS.TRANSFORM] = 'translate3d(0, 0, 0)';
            ionic.DomUtil.cachedStyles(scrollCtrl.scrollView.__container, css);
          }
        }

        scope.$on('$destroy', function () {
          ionic.off('native.keyboardshow', onShow, window);
          ionic.off('native.keyboardhide', onHide, window);

          //deprecated
          ionic.off('native.showkeyboard', onShow, window);
          ionic.off('native.hidekeyboard', onHide, window);
        });

        scope.$on('elastic:adjust', function() {
          console.log('keyboard on adjust')
        })
      };
    }]);
})();
