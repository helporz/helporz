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
    .controller('imMessageListController', function ($log, $scope,
                                                     $state,
                                                     $ionicLoading,
                                                     $timeout,
                                                     $ionicPopup,
                                                     jimService,
                                                     imConversationService, imMessageStorageService,imMessageService,userNetService) {
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
      //function getParamType(param) {
      //  var _t;
      //  return ((_t = typeof (param)) == "object" ? Object.prototype.toString.call(param).slice(8, -1) : _t).toLowerCase();
      //}

      //add for test by binfeng 2016-3-31
      //imConversationService.clearConversation4Local();

      //vm.imConversations = imConversationService.getLocalConversation();
      //console.log('imConversations type:' + getParamType(vm.imConversations));
      //console.log('array type:' + getParamType(new Array));

      //if (vm.imConversations == null || vm.imConversations.length == 0) {
      //  var dadaConversation = {
      //    isTop: false,
      //    pic: '',
      //    showHints: true,
      //    noReadMessages: 5,
      //    lastMessage: {
      //      timeFrome1970: '2016-3-31',
      //      time: '2016-3-31',
      //      content: 'test'
      //    },
      //    name: 'dada'
      //  };
      //  if (vm.imConversations == null) {
      //    vm.imConversations = new Array();
      //  }
      //  ;
      //
      //  console.log(JSON.stringify(vm.imConversations));
      //  for (var index = 0; index < 50; ++index) {
      //    var dadaConversation = {
      //      isTop: false,
      //      pic: '',
      //      showHints: true,
      //      noReadMessages: 5,
      //      lastMessage: {
      //        timeFrome1970: '2016-3-31',
      //        time: '2016-3-31',
      //        content: 'test'
      //      },
      //      name: 'dada'
      //    };
      //    vm.imConversations.push(dadaConversation);
      //  }
      //}

      // end add for test

      //add for test by binfeng 2016-3-31
      //$timeout(function() {
      //  var date = new Date();
      //
      //  var conversation = {
      //    isTop:false,
      //    pic:'',
      //    showHints:true,
      //    noReadMessages:5,
      //    lastMessage:{
      //      timeFrome1970:'2016-3-31',
      //      time:'2016-3-31',
      //      content:'test'
      //    },
      //    name:'测试'+ date.getTime()
      //  };
      //
      //  if( $scope.imMessageList.imConversations == null ) {
      //    $scope.imMessageList.imConversations = new Array();
      //  }
      //  $scope.imMessageList.imConversations.push(conversation);
      //  //$scope.imMessageList.hideLoading();
      //},1000);

      //end add for test

      // console.log($scope.messages);
      //$scope.onSwipeLeft = function() {
      //  $state.go("tab.friends");
      //};

      console.log('im message list controller');
      //this.updateConversationList = function () {
      //  imConversationService.updateConversationFromImServer(function (newConversationList) {
      //      $scope.imMessageList.imConversations = newConversationList;
      //      //for( var nc in newConversation)
      //      //$scope.imMessageList.imConversations.push(nc);
      //    },
      //    function (failedInfo) {
      //      alert("更新会话信息失败");
      //    });
      //};

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
        if (conversation.showHints) {
          conversation.showHints = false;
          conversation.noReadMessages = 0;
        } else {
          conversation.showHints = true;
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
        imConversationService.deleteConversation(conversation).then(function() {
          $log.info('完成删除会话：userId(#userId#) cUserId(#cUserId#)'.replace('#userId#',conversation.userId).replace('#cUserId#',conversation.cUserId));
          return imMessageStorageService.deleteMessageList(conversation.userId,conversation.cUserId);
        }).then(function(){
          $log.info('我那层删除会话中的所有消息：userId(#userId#) cUserId(#cUserId#)'
           .replace('#userId#',conversation.userId).replace('#cUserId#',conversation.cUserId));
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
        $state.go("main.im-detail", {
          "cid": conversation.cUserId,
        });
      };

      $scope.$on("$ionicView.beforeEnter", function () {
        vm.imConversations = imConversationService.getConversationList();
        if (g_isDebug && (vm.imConversations == null || vm.imConversations.length == 0 )) {
          vm.imConversations = new Array();
          var conversation = {
            "id": 6,
            "userId": "62",
            "isTop": 0,
            "showHints": 0,
            "noReadMessages": 0,
            "cUserId": "61",
            "cUserNickname": null,
            "cUserAvatar": "null",
            "created": "2016-07-01 20:32:20",
            "lastMessage": "yfgcfhgguijgij",
            "lastMessageTime": "2016-07-02 15:32:41"
          };
          vm.imConversations.push(conversation);

          conversation = {
            "id": 7,
            "userId": "62",
            "isTop": 0,
            "showHints": 0,
            "noReadMessages": 0,
            "cUserId": "61",
            "cUserNickname": null,
            "cUserAvatar": "null",
            "created": "2016-07-01 20:32:20",
            "lastMessage": "yfgcfhgguijgij",
            "lastMessageTime": "2016-07-02 15:32:41"
          };
          vm.imConversations.push(conversation);
        }

        $log.info('conversation list:' + JSON.stringify(vm.imConversations));
        vm.popup = {
          isPopup: false,
          index: 0
        };
      });

      var conversationObserver =  {
        onAddConversation :function(conversation) {
          if( conversation.userId == $scope.user.userId) {
            vm.imConversations.push(conversation);
            if (!$scope.$$phase) {
              $scope.$apply();
            }
          }
        }
      }


      imMessageService.registerConversationObserver('imMessageListController',conversationObserver);

      $scope.$on('$ionicView.beforeLeave',function() {
        imMessageService.unregisterConversationObserver('imMessageListController');
      })

    })
    .controller('imMessageDetailController', ['$log', '$q', '$scope', '$stateParams',
      '$ionicScrollDelegate', '$timeout', 'imMessageService', 'jimService', 'imMessageStorageService',
      'userNetService', 'imConversationService', 'UtilsService',
      function ($log, $q, $scope, $stateParams, $ionicScrollDelegate, $timeout, imMessageService, jimService,
                imMessageStorageService, userNetService, imConversationService, UtilsService) {

        var viewScroll = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');


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
          if ($scope.messageDetails != null && $scope.messageDetails.length > 0) {
            var lastMessage = $scope.messageDetails[$scope.messageDetails.length - 1];
            $scope.conversation.lastMessage = lastMessage.message;
            $scope.conversation.lastMessageTime = lastMessage.time;
            imConversationService.updateConversation($scope.conversation);
          }

          imMessageService.unregisterMsgObserver('imMessageDetailController');
        });

        $scope.$on("$ionicView.afterEnter", function () {
          $scope.messageDetails = new Array();
          imMessageStorageService.getMaxIdForMessage().then(function (maxMessageId) {
            imMessageStorageService.getMessageList($scope.user.userId, $scope.cUser.userId, maxMessageId, 20).then(function (msgList) {
              $log.error('getMessageList success,message length:' + msgList.length);
              $scope.messageDetails = [];
              for (var index = 0; index < msgList.length; ++index) {
                $scope.messageDetails.unshift(msgList[index]);
              }

              // for test
              if (g_isDebug && ($scope.messageDetails == null || $scope.messageDetails.length == 0)) {
                for (var index = 0; index < 10; ++index) {
                  var uMessage = imMessageStorageService.newMessage();
                  var cMessage = imMessageStorageService.newMessage();
                  uMessage.userId = $scope.user.userId;
                  uMessage.cUserId = $scope.cUser.userId;
                  uMessage.isFromMe = true;
                  uMessage.id = index * 2;
                  uMessage.message = 'test';
                  uMessage.sendState = 1;
                  uMessage.time = UtilsService.currentDate2String();
                  cMessage.userId = $scope.user.userId;
                  cMessage.cUserId = $scope.cUser.userId;
                  cMessage.isFromMe = false;
                  cMessage.id = index * 2 + 1;
                  cMessage.message = 'test';
                  cMessage.time = UtilsService.currentDate2String();

                  $scope.messageDetails.push(uMessage);
                  $scope.messageDetails.push(cMessage);
                }
              }
              //end for test

            }, function (error) {
              $log.error(JSON.stringify(error));
            });
          }, function (error) {
            $log.error(error);
          })
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
            conversation.cUserAvatar = $scope.cUser.avatar;
            imConversationService.addConversation(conversation);
            $scope.conversation = conversation;
          }
          else if ($scope.cUser == null && $scope.conversation != null) {
            $scope.cUser = {};
            $scope.cUser.userId = $scope.conversation.cUserId;
            $scope.cUser.nickname =  $scope.conversation.cUserNickname;
            $scope.cUser.avatar =  $scope.conversation.cUserAvatar;
          }
          else if( $scope.cUser == null && $scope.conversation == null ){
            if( g_isDebug) {
              alert('im 模块无法获取联系人用户信息');
            }
          }

          $log.info('cUser info:' + JSON.stringify($scope.cUser));

          viewScroll.scrollBottom();
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
              viewScroll.scrollBottom();
              if (!$scope.$$phase) {
                $scope.$apply();
              }
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
          //{
          //  userId:$scope.user.username,
          //  cUserId:$scope.toUser.username,
          //  type:'text',
          //  //pic:'img/ionic.png',
          //  message:$scope.sendContent,
          //  time: new Date().toLocaleString(),
          //  isFromMe:true,
          //  sendState:0
          //};

          $scope.sendContent = '';
          imMessageStorageService.addMessage(messageDetail).then(function (msgId) {
            messageDetail.id = msgId;
            $scope.messageDetails.push(messageDetail);
            imMessageService.sendMessage($scope.cUser,messageDetail).then(function () {
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

          //imMessageService.sendMessage(messageDetail.username, messageDetail.toUsername, 'text', $scope.sendContent, function (msgDtl, response) {
          //  msgDtl.sendState = 1;
          //  alert("send message success");
          //  imMessageService.updateMessage(msgDtl.username, msgDtl.toUsername, msgDtl);
          //  //$scope.messageDetails = imMessageService.getLocalMessageList(msgDtl.username,msgDtl.toUsername);
          //  for (var index = 0; index < $scope.messageDetails.length; ++index) {
          //    var m = $scope.messageDetails[index];
          //    console.log('message content:' + msgDtl.content + ' time:' + msgDtl.time);
          //    console.log('m content:' + m.content + ' time:' + m.time);
          //    if (m.content === msgDtl.content && m.time === msgDtl.time) {
          //      //m.sendState = msgDtl.sendState;
          //      console.log('更新scope messageDetail');
          //
          //      $scope.$apply(function () {
          //        $scope.messageDetails.splice(index, 1, msgDtl);
          //        viewScroll.scrollBottom();
          //      });
          //    }
          //  }
          //}, function (msgDtl, response) {
          //  //alert('send message failed');
          //  msgDtl.sendState = -1;
          //  imMessageService.updateMessage(msgDtl.username, msgDtl.toUsername, msgDtl);
          //  $scope.messageDetails = imMessageService.getLocalMessageList(msgDtl.username, msgDtl.toUsername);
          //  for (var index = 0; index < $scope.messageDetails.length; ++index) {
          //    var m = $scope.messageDetails[index];
          //    console.log('message content:' + msgDtl.content + ' time:' + msgDtl.time);
          //    console.log('m content:' + m.content + ' time:' + m.time);
          //    if (m.content === msgDtl.content && m.time === msgDtl.time) {
          //      //m.sendState = msgDtl.sendState;
          //      console.log('更新scope messageDetail');
          //
          //      $scope.$apply(function () {
          //        $scope.messageDetails.splice(index, 1, msgDtl);
          //        viewScroll.scrollBottom();
          //      });
          //    }
          //  }
          //}, messageDetail);
          //imMessageService.addMessage(messageDetail.username,messageDetail.toUsername,messageDetail);


        };

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

        //var onSingleReceiveMessage = function (data) {
        //  console.log("receive im message");
        //  if (typeof(data.msg_type) === 'undefined') {
        //    console.log('receive invalid message:' + writeObj(data));
        //  }
        //  else {
        //    console.log('receive message:' + data.msg_body.text + " username:" + data.target_id + " toUserName:" + data.from_id);
        //
        //    var messageDetail = {
        //      userId: jimService.getUsername(), //由于data.target_id 与 data.from_id相等，因此用当前登录的用户名
        //      cUserId: data.from_id,
        //      type: 'text',
        //      message: data.msg_body.text,
        //      time: data.create_time,
        //      isFromMe: false,
        //      sendState: 1
        //    };
        //
        //    $scope.$apply(function () {
        //      imMessageStorageService.addMessage(messageDetail).then(function (insertId) {
        //        messageDetail.id = insertId;
        //        $scope.messageDetails.push(messageDetail);
        //        viewScroll.scrollBottom();
        //      }, function (error) {
        //        $log.error(error);
        //      });
        //
        //    });
        //  }
        //};


        //var config = {
        //  onSingleReceiveMessage: onSingleReceiveMessage
        //};
        //
        //jimService.updateMessageNotifyCB(config);

        var messageObserver = {
          onReceiveMessage : function(message) {
            if( message.userId == $scope.user.userId && message.cUserId == $scope.cUser.userId) {
              $scope.messageDetails.push(message);
              if (!$scope.$$phase) {
                $scope.$apply();
              }
              viewScroll.scrollBottom();
            }
          }
        };

        imMessageService.registerMsgObserver('imMessageDetailController',messageObserver);
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
})();


