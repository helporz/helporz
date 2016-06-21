/**
 * Created by Midstream on 16/4/22.
 */

(function () {

  'use strict'

  angular.module('components.widgets.hoBottomInput', [
    'monospaced.elastic'
  ])

    .directive('hoBottomInput', function () {

      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'modules/components/widgets/bottom-input/bottom-input.html',
        scope: {
          input: '=',
          placeholder: '@',
          send: '&'
        },

        link: function (scope, element, attr) {

          var barE = element;
          //var inputRegionE = angular.element(barE.children()[0]);
          var barE_style = getComputedStyle(barE[0]);
          var originHeight = parseInt(barE_style.getPropertyValue('height'));
          //var inputRegionE_style = getComputedStyle(inputRegionE[0]);


          ionic.on('elastic:resize', function(event){

            var mirrorHeight = event.detail.mirrorHeight;
            var tagHeight = event.detail.tagHeight;
            if (angular.isNumber(mirrorHeight) && angular.isNumber(tagHeight)){
              var differH = mirrorHeight - tagHeight;

              var old_barE_height = barE_style.getPropertyValue('height');
              if (old_barE_height.substr(old_barE_height.length - 2, 2) === 'px') {
                // update mirror width in case the textarea width has changed
                var h = parseInt(old_barE_height, 10) + differH;
                if(h < originHeight) {
                  h = originHeight;
                }
                //barE[0].style.setAttribute('height', h + 'px');
                ionic.DomUtil.cachedStyles(barE, {
                  height: h + 'px'
                });
              }

              //var old_inputRegionE_height = inputRegionE_style.getPropertyValue('height');
              //if (old_inputRegionE_height.substr(old_inputRegionE_height.length - 2, 2) === 'px') {
              //  // update mirror width in case the textarea width has changed
              //  var h = parseInt(old_inputRegionE_height, 10) + differH;
              //  inputRegionE[0].setAttribute('height', h + 'px');
              //  //barE_style.style.height = h + 'px';
              //}
            }
          })
        }
      }
    }
  )

})
()
