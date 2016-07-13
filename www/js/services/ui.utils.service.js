/**
 * Created by Midstream on 16/7/8.
 */

(function () {
  'use strict'

  angular.module('app.ui.utils.service', [])

    .factory('operationUtils', [function () {

      //fixme:因为点击会穿透,同时触发多个事件,这里先用标记来屏蔽,点击按钮后间隔一段时间才可触发下一次点击回调
      var isClicking = false;
      var canClick = function () {
        if (isClicking == false) {
          setTimeout(function () {
            isClicking = false;
          }, 300);
          isClicking = true;
          return true;
        } else {
          return false;
        }
      };

      return {
        canClick: canClick
      }
    }]);

})();
