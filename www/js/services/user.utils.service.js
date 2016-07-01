/**
 * Created by Midstream on 16/7/1.
 */

(function () {
    'use strict'

    angular.module('app.user.utils.service', [])

      //////////////////////////////////////////////////
      // taskUtils
      .factory('userUtils', [ function () {
//

        return {
          uiProcessFollow: uiProcessFollow,
          uiProcessFollowed: uiProcessFollowed
        };

        function uiProcessFollow(friend) {
          friend.ui_showFollow = false;
          friend.ui_showNeedHelp = friend.recentTaskIdArray.length>0;
          friend.ui_showHasFollow = friend.isMutualAttention==false?1:2;
        }
        function uiProcessFollowed(friend) {
          friend.ui_showFollow = friend.isMutualAttention==false;
          friend.ui_showNeedHelp = false;
          friend.ui_showHasFollow = friend.isMutualAttention==false?0:1;
        }

      }]);
  })()
