/**
 * Created by binfeng on 16/6/17.
 */
(function () {
  'use strict';

  angular.module('com.helporz.utils.service')
    .factory('SharePageService', SharePageServiceFn)
    .factory('SharePageWrapService',SharePageWrapServiceFn);

  var uiGlob = {
    app: {
      title: '和小伙伴们一起玩',
      bt1: '邀请微信好友',
      bt2: '在朋友圈邀请'
    },
    task: {
      title:  '转发求助',
      bt1: '转发微信好友',
      bt2: '转发到朋友圈'
    },
    topic: {
      title:  '分享帖子',
      bt1: '分享微信好友',
      bt2: '分享到朋友圈'
    }
  };

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
    var _sharePageCom = function (url, uiDesc) {
      var _innerDefer = $q.defer();
      var sheet = {};
      sheet.titleText = uiDesc.title;
      sheet.cancelText = '取消';
      sheet.buttonClicked = function(index) {
        SharePageService.sharePageCommon(url,index).then(function() {
          _innerDefer.resolve();
        },function() {
          _innerDefer.reject();
        });
        return true;
      };
      sheet.buttons = [{
        text: '<i class="icon ho-wechat-at"></i> ' + uiDesc.bt1
      }, {
        text: '<i class="icon ho-wechat-friend"></i> ' + uiDesc.bt2
      }];

      $ionicActionSheet.show(sheet);
      return _innerDefer.promise;
    }

    var _shareApp = function () {
      var url = '/message/share_page';
      return _sharePageCom(url, uiGlob.app);
    }

    var _shareTask = function (taskId) {
      var url = '/task/' + taskId + '/share_page';
      return _sharePageCom(url, uiGlob.task);
    }

    var _shareTopic = function (topicId) {
      var url = '/playground/topic/' + topicId + '/share_page';
      return _sharePageCom(url, uiGlob.topic);
    }

    return {
      shareApp:_shareApp,
      shareTask:_shareTask,
      shareTopic:_shareTopic,
    }
  }



})();
