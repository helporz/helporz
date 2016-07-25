/**
 * Created by binfeng on 16/3/27.
 */
;
(function () {
  'use strict';
  angular.module('com.helporz.im', ['com.helporz.im.controllers',
    'com.helporz.im.services',
    //'monospaced.elastic'
    'components.widgets.hoBottomInput'
  ]);

  angular.module('com.helporz.im.controllers', ['com.helporz.im.services'])
    .controller('imMessageListController', imMessageListControllerFn)
    .controller('imMessageDetailController', ['$ionicLoading','$log', '$q', '$scope', '$stateParams',
      '$ionicScrollDelegate', '$timeout', '$ionicPopup', 'imMessageService', 'jimService', 'imMessageStorageService',
      'userNetService', 'imConversationService', 'UtilsService', 'userUtils','IMInterfaceService','promptService',
      function ($ionicLoading,$log, $q, $scope, $stateParams, $ionicScrollDelegate, $timeout, $ionicPopup, imMessageService, jimService,
                imMessageStorageService, userNetService, imConversationService, UtilsService, userUtils,IMInterfaceService,promptService) {

        //var popupScope = $scope.$new();
        //
        //popupScope.cancel = function() {
        //  confirmPopup.close();
        //};
        //
        //popupScope.ok = function() {
        //  confirmPopup.close();
        //};
        //
        //var confirmPopup = $ionicPopup.show({
        //  templateUrl: 'modules/im/resend-confirm-popup.html',
        //  title: null,
        //  subTitle: null,
        //  scope: popupScope,
        //});

        var viewScroll = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');

        $scope.userUtils = userUtils;

        // console.log("enter");
        $scope.doRefresh = function () {
          // console.log("ok");
          //$scope.messageNum += 5;
          var miniMessageId = 0;
          if ($scope.messageDetails !== null && $scope.messageDetails.length > 0) {
            miniMessageId = $scope.messageDetails[0].id - 1;
          }

          if (miniMessageId > 0) {
            imMessageStorageService.getMessageList($scope.user.id, $scope.cUser.id, miniMessageId, 5).then(function (msgList) {
              for (var index = 0; index < msgList.length; ++index) {
                $scope.messageDetails.unshift(msgList[index]);
              }
              $scope.messageNum = $scope.messageDetails.length;
              $scope.$broadcast('scroll.refreshComplete');
            }, function (error) {
              $log.error(error);
              $scope.$broadcast('scroll.refreshComplete');
            })
          }

          //$timeout(function () {
          //  var currentMinMsgId =
          //    $scope.messageDetils = messageService.getAmountMessageById($scope.messageNum,
          //      $stateParams.messageId);
          //
          //  $scope.$broadcast('scroll.refreshComplete');
          //}, 200);
        };

        $scope.$on("$ionicView.beforeLeave", function () {
          imMessageService.exitConversation($scope.cUser);
          if ($scope.messageDetails != null && $scope.messageDetails.length > 0) {
            var lastMessage = $scope.messageDetails[$scope.messageDetails.length - 1];
            $scope.conversation.lastMessage = lastMessage.message;
            $scope.conversation.lastMessageTime = lastMessage.time;
            $scope.conversation.noReadMessages = 0;
            imConversationService.updateConversation($scope.conversation);
          }

          imMessageService.unregisterMsgObserver('imMessageDetailController');
        });

        $scope.$on("$ionicView.afterEnter", function () {

          if (typeof $scope.messageDetails === 'undefined' || $scope.messageDetails == null || $scope.messageDetails.length == 0) {
            $ionicLoading.show();
            $scope.messageDetails = new Array();
            imMessageStorageService.getMaxIdForMessage().then(function (maxMessageId) {
              imMessageStorageService.getMessageList($scope.user.userId, $scope.cUser.userId, maxMessageId, 20).then(function (msgList) {
                $log.error('getMessageList success,message length:' + msgList.length);
                $scope.messageDetails = [];
                for (var index = 0; index < msgList.length; ++index) {
                  $scope.messageDetails.unshift(msgList[index]);
                }
                $timeout(function() {
                  $ionicLoading.hide();
                  viewScroll.scrollBottom();
                });
                //// for test
                //if (g_isDebug && ($scope.messageDetails == null || $scope.messageDetails.length == 0)) {
                //  for (var index = 0; index < 10; ++index) {
                //    var uMessage = imMessageStorageService.newMessage();
                //    var cMessage = imMessageStorageService.newMessage();
                //    uMessage.userId = $scope.user.userId;
                //    uMessage.cUserId = $scope.cUser.userId;
                //    uMessage.isFromMe = true;
                //    uMessage.id = index * 2;
                //    uMessage.message = 'test';
                //    //uMessage.sendState = 1;
                //    uMessage.time = UtilsService.currentDate2String();
                //    if (index % 2 == 0) {
                //      uMessage.sendState = -1;
                //    }
                //    else {
                //      uMessage.sendState = 0;
                //    }
                //
                //    cMessage.userId = $scope.user.userId;
                //    cMessage.cUserId = $scope.cUser.userId;
                //    cMessage.isFromMe = false;
                //    cMessage.id = index * 2 + 1;
                //    cMessage.message = 'test';
                //    cMessage.time = UtilsService.currentDate2String();
                //    cMessage.sendState = -1;
                //
                //    $scope.messageDetails.push(uMessage);
                //    $scope.messageDetails.push(cMessage);
                //  }
                //}
                ////end for test

              }, function (error) {
                $log.error(JSON.stringify(error));
                $ionicLoading.hide();
              });
            }, function (error) {
              $log.error(error);
              $ionicLoading.hide();
            })
          }

        });

        $scope.$on("$ionicView.beforeEnter", function () {
          $scope.user = userNetService.cache.selfInfo;
          $log.info('currentUser info:' + JSON.stringify($scope.user));
          $log.info('userinfo cache:' + JSON.stringify(userNetService.cache.userInfo));
          $scope.cUser = userNetService.cache.userInfo[$stateParams.cid];
          $scope.conversation = imConversationService.getConversation($scope.user.userId, $stateParams.cid);

          if ($scope.conversation == null && $scope.cUser != null) {
            var conversation = imMessageStorageService.newConversation();
            conversation.userId = $scope.user.userId;
            conversation.cUserId = $scope.cUser.userId;
            conversation.cUserNickname = $scope.cUser.nickname;
            conversation.cUserLoginName = $scope.cUser.loginName;
            conversation.cUserAvatar = $scope.cUser.avatar;
            imConversationService.addConversation(conversation);
            $scope.conversation = conversation;
          }
          else if ($scope.cUser == null && $scope.conversation != null) {
            $scope.cUser = {};
            $scope.cUser.userId = $scope.conversation.cUserId;
            $scope.cUser.nickname = $scope.conversation.cUserNickname;
            $scope.cUser.loginName = $scope.conversation.cUserLoginName;
            $scope.cUser.avatar = $scope.conversation.cUserAvatar;
          }
          else if ($scope.cUser == null && $scope.conversation == null) {
            ho.alert('无法获取联系人用户信息');
          }

          $log.info('cUser info:' + JSON.stringify($scope.cUser));
          imMessageService.enterConversation($scope.cUser);

          //// for test
          //
          //jimService.getMessageHistory($scope.cUser.loginName + '_' + $scope.cUser.userId,0,50,function() {},function() {});
          //// end teste

        });

        function updateMessageDetailList(msg) {
          //由于有时会出现消息状态无法刷新，因此重新构造一个新的message，然后插入消息列表并替换原message
          var messageDetail = imMessageStorageService.newMessage();
          messageDetail.userId = msg.userId;
          messageDetail.cUserId = msg.userId;
          messageDetail.time = msg.time
          messageDetail.isFromMe = msg.isFromMe;
          messageDetail.type = msg.type;
          messageDetail.message = msg.message;
          messageDetail.id = msg.id;
          messageDetail.sendState = msg.sendState;

          for (var index = $scope.messageDetails.length - 1; index >= 0; --index) {
            var m = $scope.messageDetails[index];
            $log.info('message:' + msg.message + ' time:' + messageDetail.time);
            $log.info('m content:' + m.msg + ' time:' + m.time);
            if (m.id === messageDetail.id) {
              console.log('更新scope messageDetail');
              $scope.messageDetails.splice(index, 1, messageDetail);

              if (!$scope.$$phase) {
                $scope.$apply(function() {
                  viewScroll.scrollBottom();
                });
              }
              else {
                viewScroll.scrollBottom();
              }
              break;
            }
          }
        }

        function deleteMessageFromDetailList(msg) {
          for (var index = $scope.messageDetails.length - 1; index >= 0; --index) {
            var m = $scope.messageDetails[index];
            $log.info('message:' + msg.message + ' time:' + msg.time);
            $log.info('m content:' + m.msg + ' time:' + m.time);
            if (m.id === msg.id) {
              $scope.messageDetails.splice(index, 1);
              break;
            }
          }
        }

        $scope.sendMessage = function (event) {
          $log.info('send message:' + $scope.sendContent);
          var messageDetail = imMessageStorageService.newMessage();
          messageDetail.userId = $scope.user.userId;
          messageDetail.cUserId = $scope.cUser.userId;
          messageDetail.time = UtilsService.currentDate2String();
          messageDetail.isFromMe = true;
          messageDetail.type = 'text';
          messageDetail.message = $scope.sendContent;
          messageDetail.sentState = 0;

          $scope.sendContent = '';
          $log.info('sendMessage:addMessage to db:' + JSON.stringify(messageDetail));
          imMessageStorageService.addMessage(messageDetail).then(function (msgId) {
            messageDetail.id = msgId;
            $scope.messageDetails.push(messageDetail);
            $timeout(function() {
              if (!$scope.$$phase) {
                $scope.$apply(function() {
                  viewScroll.scrollBottom();
                });
              }
              else {
                viewScroll.scrollBottom();
              }
            });

            imMessageService.sendMessage($scope.cUser, messageDetail).then(function () {
              $log.info("发烧消息成功:" + messageDetail.message);
              imMessageStorageService.updateMessageState(messageDetail, 1);
              messageDetail.sendState = 1;
              updateMessageDetailList(messageDetail);
            }, function (error) {
              $log.info("发烧消息失败:" + messageDetail.message);
              imMessageStorageService.updateMessageState(messageDetail, -1);
              messageDetail.sendState = -1;
              updateMessageDetailList(messageDetail);
            });
          }, function (error) {
            $log.error(error);
          });

        };

        $scope.reSendPrompt = function (message) {
          var popupScope = $scope.$new();

          popupScope.cancel = function () {
            confirmPopup.close();
          };

          popupScope.ok = function () {
            $scope.reSend(message);
            confirmPopup.close();
          }

          var confirmPopup = $ionicPopup.show({
            templateUrl: 'modules/im/resend-confirm-popup.html',
            title: null,
            subTitle: null,
            scope: popupScope,
          });
        }

        $scope.reSend = function (message) {
          deleteMessageFromDetailList(message);
          imMessageStorageService.deleteMessage(message);
          var messageDetail = imMessageStorageService.newMessage();
          messageDetail.userId = $scope.user.userId;
          messageDetail.cUserId = $scope.cUser.userId;
          messageDetail.time = UtilsService.currentDate2String();
          messageDetail.isFromMe = true;
          messageDetail.type = 'text';
          messageDetail.message = message.message;

          //$scope.sendContent = '';
          imMessageStorageService.addMessage(messageDetail).then(function (msgId) {
            messageDetail.id = msgId;
            $scope.messageDetails.push(messageDetail);
            imMessageService.sendMessage($scope.cUser, messageDetail).then(function () {
              imMessageStorageService.updateMessageState(messageDetail, 1);
              messageDetail.sendState = 1;
              updateMessageDetailList(messageDetail);
            }, function (error) {
              imMessageStorageService.updateMessageState(messageDetail, -1);
              messageDetail.sendState = -1;
              updateMessageDetailList(messageDetail);
            });
          }, function (error) {
            $log.error(error);
          });
        }

        window.addEventListener("native.keyboardshow", function (e) {
          if (!$scope.$$phase) {
            $scope.$apply(function () {
              viewScroll.scrollBottom();
            });
          }
        });

        window.addEventListener("native.keyboardhide", function (e) {

          if (!$scope.$$phase) {
            $scope.$apply(function () {
              viewScroll.scrollBottom();
            });
          }
        });

        var messageObserver = {
          onReceiveMessage: function (message) {
            $log.debug('messageObserver receive message:' + JSON.stringify(message));
            if (message.userId == $scope.user.userId && message.cUserId == $scope.cUser.userId) {
              $log.debug('push message to message detail list');
              $scope.messageDetails.push(message);
              $timeout(function() {
                if (!$scope.$$phase) {
                  $scope.$apply(function() {
                    viewScroll.scrollBottom();
                  });
                }
                else {
                  viewScroll.scrollBottom();
                }
              })


            }
          }
        };

        imMessageService.registerMsgObserver('imMessageDetailController', messageObserver);
      }
    ]);


  angular.module('im.directives', [])
    .directive('rjHoldActive', ['$ionicGesture', '$timeout', '$ionicBackdrop',
      function ($ionicGesture, $timeout, $ionicBackdrop) {
        return {
          scope: false,
          restrict: 'A',
          replace: false,
          link: function (scope, iElm, iAttrs, controller) {
            $ionicGesture.on("hold", function () {
              iElm.addClass('active');
              $timeout(function () {
                iElm.removeClass('active');
              }, 300);
            }, iElm);
          }
        };
      }
    ])
    .directive('rjCloseBackDrop', [function () {
      return {
        scope: false,
        restrict: 'A',
        replace: false,
        link: function (scope, iElm, iAttrs, controller) {
          var htmlEl = angular.element(document.querySelector('html'));
          htmlEl.on("click", function (event) {
            if (event.target.nodeName === "HTML" &&
              scope.popup.optionsPopup &&
              scope.popup.isPopup) {
              scope.popup.optionsPopup.close();
              scope.popup.isPopup = false;
            }
          });
        }
      };
    }])
    .directive('resizeFootBar', ['$ionicScrollDelegate', function ($ionicScrollDelegate) {
      // Runs during compile
      return {
        replace: false,
        link: function (scope, iElm, iAttrs, controller) {
          scope.$on("taResize", function (e, ta) {
            if (!ta) return;
            var scroll = document.body.querySelector("#message-detail-content");
            var scrollBar = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');
            // console.log(scroll);
            var taHeight = ta[0].offsetHeight;
            var newFooterHeight = taHeight + 10;
            newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;

            iElm[0].style.height = newFooterHeight + 'px';
            scroll.style.bottom = newFooterHeight + 'px';
            scrollBar.scrollBottom();
          });
        }
      };
    }])
    .directive('rjPositionMiddle', ['$window', function ($window) {
      return {
        replace: false,
        link: function (scope, iElm, iAttrs, controller) {
          var height = $window.innerHeight - 44 - 49 - iElm[0].offsetHeight;
          if (height >= 0) {
            iElm[0].style.top = (height / 2 + 44) + 'px';
          } else {
            iElm[0].style.top = 44 + 'px';
          }
        }
      }
    }])


  imMessageListControllerFn.$inject = [
    '$log',
    '$scope',
    '$state',
    '$ionicLoading',
    '$timeout',
    '$ionicPopup',
    'jimService',
    'imConversationService',
    'imMessageStorageService',
    'imMessageService',
    'userNetService',
    'userUtils',
  ];
  function imMessageListControllerFn($log, $scope,
                                     $state,
                                     $ionicLoading,
                                     $timeout,
                                     $ionicPopup,
                                     jimService,
                                     imConversationService,
                                     imMessageStorageService, imMessageService, userNetService, userUtils) {
    var vm = $scope.vm = {};
    vm.loading = function () {
      $ionicLoading.show({
        template: "正在加载数据"
      });
    };

    vm.hideLoading = function () {
      $ionicLoading.hide();
    }

    $scope.user = userNetService.cache.selfInfo;

    console.log('im message list controller');

    vm.popupConversationOptions = function (message) {
      vm.popup.index = vm.imConversations.indexOf(message);
      vm.popup.optionsPopup = $ionicPopup.show({
        templateUrl: "modules/im/popup.html",
        scope: $scope,
      });
      vm.popup.isPopup = true;
    };

    vm.markConversation = function () {
      var index = vm.popup.index;
      var conversation = vm.imConversations[index];
      if (conversation.noReadMessages > 0) {
        //conversation.showHints = false;
        conversation.noReadMessages = 0;
      } else {
        //conversation.showHints = true;
        conversation.noReadMessages = 1;
      }

      vm.imConversations[index] = conversation;
      vm.popup.optionsPopup.close();
      vm.popup.isPopup = false;

      imConversationService.updateConversation(conversation);
    };

    vm.deleteConversation = function () {
      var index = vm.popup.index;
      var conversation = vm.imConversations[index];
      vm.imConversations.splice(index, 1);
      vm.popup.optionsPopup.close();
      vm.popup.isPopup = false;
      imConversationService.deleteConversation(conversation).then(function () {
        $log.info('完成删除会话：userId(#userId#) cUserId(#cUserId#)'.replace('#userId#', conversation.userId).replace('#cUserId#', conversation.cUserId));
        return imMessageStorageService.deleteMessageList(conversation.userId, conversation.cUserId);
      }).then(function () {
        $log.info('完成删除会话中的所有消息：userId(#userId#) cUserId(#cUserId#)'
          .replace('#userId#', conversation.userId).replace('#cUserId#', conversation.cUserId));
      });
    };

    vm.topConversation = function () {
      var index = vm.popup.index;
      var conversation = vm.imConversations[index];
      if (conversation.isTop) {
        conversation.isTop = 0;
      } else {
        conversation.isTop = new Date().getTime();
      }
      vm.popup.optionsPopup.close();
      vm.popup.isPopup = false;
      imConversationService.updateConversation(conversation);
    };

    vm.conversationDetails = function (conversation) {
      userUtils.gotoIM(conversation.cUserId);
      //$state.go("main.im-detail", {
      //  "cid": conversation.cUserId,
      //});
    };

    $scope.$on("$ionicView.beforeEnter", function () {
      vm.imConversations = imConversationService.getConversationList();
      //if (g_isDebug && (vm.imConversations == null || vm.imConversations.length == 0 )) {
      //  vm.imConversations = new Array();
      //  var conversation = {
      //    "id": 6,
      //    "userId": "62",
      //    "isTop": 0,
      //    "showHints": 0,
      //    "noReadMessages": 0,
      //    "cUserId": "61",
      //    "cUserNickname": null,
      //    "cUserAvatar": "null",
      //    "created": "2016-07-01 20:32:20",
      //    "lastMessage": "yfgcfhgguijgij",
      //    "lastMessageTime": "2016-07-02 15:32:41"
      //  };
      //  vm.imConversations.push(conversation);
      //
      //  conversation = {
      //    "id": 7,
      //    "userId": "62",
      //    "isTop": 0,
      //    "showHints": 0,
      //    "noReadMessages": 0,
      //    "cUserId": "61",
      //    "cUserNickname": null,
      //    "cUserAvatar": "null",
      //    "created": "2016-07-01 20:32:20",
      //    "lastMessage": "yfgcfhgguijgij",
      //    "lastMessageTime": "2016-07-02 15:32:41"
      //  };
      //  vm.imConversations.push(conversation);
      //}

      $log.info('conversation list:' + JSON.stringify(vm.imConversations));
      vm.popup = {
        isPopup: false,
        index: 0
      };
    });

    var conversationObserver = {
      onAddConversation: function (conversation) {
        if (conversation.userId == $scope.user.userId) {
          vm.imConversations.push(conversation);
          if (!$scope.$$phase) {
            $scope.$apply();
          }
        }
      }
    }


    imMessageService.registerConversationObserver('imMessageListController', conversationObserver);

    $scope.$on('$ionicView.beforeLeave', function () {
      imMessageService.unregisterConversationObserver('imMessageListController');
    })

  }
})();


