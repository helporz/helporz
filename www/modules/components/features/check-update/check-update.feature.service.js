/**
 * Created by Midstream on 16/7/11.
 */

(function () {
  'use strict'

  angular.module('app.features.service', [])

    .factory('checkUpdateFeature', ['$rootScope', '$ionicPopup','userNetService', 'deviceService',
      function ($rootScope, $ionicPopup, userNetService, deviceService) {

      return {
        check: check
      };

      function check() //检查版本更新
      {


        userNetService.checkUpdatePackage(appConfig.APP_VERSION, deviceService.getDeviceInfo(),
          function (downloadUrl, version, isMustUpdate) {
            ho.alert('d:' + downloadUrl + ';v:' + version);

            var popupScope = $rootScope.$new();

            popupScope.cb_update = _update;
            popupScope.cb_cancel = _cancel;

            popupScope.ui_2bts = isMustUpdate==true;

            var pp;
            if (isMustUpdate == false) {
              pp = $ionicPopup.show({
                templateUrl: 'modules/components/features/check-update/check-update.html',
                scope: popupScope
              });

            } else {
              pp = $ionicPopup.show({
                templateUrl: 'modules/components/features/check-update/check-update.html',
                scope: popupScope
              });
            }

            function _update(){
              window.open(downloadUrl, '_blank');
            }

            function _cancel() {
              pp.close();
            }

          },
          function (code) {
            ho.alert(code);


          });


      }
    }]);
})();
