/**
 * Created by binfeng on 16/6/17.
 */
(function () {
  'use strict';

  angular.module('com.helporz.utils.service')
    .factory('SharePageService', SharePageServiceFn)
    .factory('SharePageWrapService',SharePageWrapServiceFn);

  SharePageServiceFn.$inject = ['$log','$q', 'httpBaseService'];
  function SharePageServiceFn($log,$q, httpBaseService) {

    var _sharePageCommon = function (url,scene) {
      var _innerDefer = $q.defer();
      httpBaseService.getForPromise(url, null).then(function (res) {
        Wechat.share({
            message: {
              title: res.title,
              description: res.description,
              thumb: 'www/img/com/sharepage-icon.png',
              media: {
                type: Wechat.Type.WEBPAGE,
                webpageUrl: res.link
              }
            },
            scene: scene
          }, function () {
            _innerDefer.resolve();
          },
          function (error) {
            $log.error("微信分享接口调用失败"+error);
            _innerDefer.reject();
          });
      }, function (res) {
        $log.error("获取分享信息失败"+res);
        _innerDefer.reject();
      });
      return _innerDefer.promise;
    }

    var _shareApp = function (scene) {
      var url = '/message/share_page';
      return _sharePageCommon(url,scene);
    }

    var _shareTask = function (taskId,scene) {
      var url = '/task/' + taskId + '/share_page';
      return _sharePageCommon(url,scene);
    }

    var _shareTopic = function (topicId,scene) {
      var url = '/playground/topic/' + topicId + '/share_page';
      return _sharePageCommon(url,scene);
    }

    return {
      shareApp:_shareApp,
      shareTask:_shareTask,
      shareTopic:_shareTopic,
      sharePageCommon:_sharePageCommon,
    }
  }

  SharePageWrapServiceFn.$inject = ['$q','httpBaseService','$ionicActionSheet','SharePageService'];
  function SharePageWrapServiceFn($q,httpBaseService,$ionicActionSheet,SharePageService) {
    var _sharePageCom = function (url) {
      var _innerDefer = $q.defer();
      var sheet = {};
      sheet.titleText = '与朋友们分享';
      sheet.cancelText = '算了';
      sheet.buttonClicked = function(index) {
        SharePageService.sharePageCommon(url,index).then(function() {
          _innerDefer.resolve();
        },function() {
          _innerDefer.reject();
        });
        return true;
      };
      sheet.buttons = [{
        text: '<i class="icon ion-at"></i> 分享给微信小伙伴'
      }, {
        text: '<i class="icon ion-chatbubbles"></i> 分享到微信朋友圈'
      }, {
        text: '<i class="icon ion-star"></i> 添加到微信收藏夹'
      }];

      $ionicActionSheet.show(sheet);
      return _innerDefer.promise;
    }

    var _shareApp = function () {
      var url = '/message/share_page';
      return _sharePageCom(url);
    }

    var _shareTask = function (taskId) {
      var url = '/task/' + taskId + '/share_page';
      return _sharePageCom(url);
    }

    var _shareTopic = function (topicId) {
      var url = '/playground/topic/' + topicId + '/share_page';
      return _sharePageCom(url);
    }

    return {
      shareApp:_shareApp,
      shareTask:_shareTask,
      shareTopic:_shareTopic,
    }
  }



})();
