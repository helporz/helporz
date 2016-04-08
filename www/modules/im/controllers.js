/**
 * Created by binfeng on 16/3/27.
 */
;(
  function() {
    'use strict';
    angular.module('com.helporz.im',['com.helporz.im.controllers',
      'com.helporz.im.services',
      'monospaced.elastic']);

    angular.module('com.helporz.im.controllers', ['com.helporz.im.services'])
      .controller('imMessageListController', function($scope,
                                                      $state,
                                                      $ionicLoading,
                                                      $timeout,
                                                      $ionicPopup,
                                                      localStorageService,
                                                      messageService,
                                                      jimService,
                                                      imConversationService) {
        $scope.imMessageList = this;
        this.loading = function() {
            $ionicLoading.show({
              template:"正在加载数据"
            });
        };

        this.hideLoading = function() {
          $ionicLoading.hide();
        }

        function getParamType(param) {
          var _t;
          return ((_t = typeof (param)) == "object" ? Object.prototype.toString.call(param).slice(8, -1) : _t).toLowerCase();
        }

        //add for test by binfeng 2016-3-31
        //imConversationService.clearConversation4Local();

        this.imConversations = imConversationService.getLocalConversation();
        console.log('imConversations type:' + getParamType(this.imConversations));
        console.log('array type:' + getParamType(new Array));

        if( this.imConversations == null || this.imConversations.length == 0 ) {
          var dadaConversation = {
            isTop:false,
            pic:'',
            showHints:true,
            noReadMessages:5,
            lastMessage:{
              timeFrome1970:'2016-3-31',
              time:'2016-3-31',
              content:'test'
            },
            name:'dada'
          };
          if( $scope.imMessageList.imConversations == null ) {
            $scope.imMessageList.imConversations = new Array();
          };

          console.log(JSON.stringify($scope.imMessageList.imConversations));
          for(var index = 0; index < 50; ++index) {
              var dadaConversation = {
                  isTop:false,
                  pic:'',
                  showHints:true,
                  noReadMessages:5,
                  lastMessage:{
                      timeFrome1970:'2016-3-31',
                      time:'2016-3-31',
                      content:'test'
                  },
                  name:'dada'
              };
              $scope.imMessageList.imConversations.push(dadaConversation);
              imConversationService.addConversation2Local(dadaConversation);
          }
        }

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
        this.updateConversationList = function() {
          imConversationService.updateConversationFromImServer(function(newConversationList) {
              $scope.imMessageList.imConversations = newConversationList;
            //for( var nc in newConversation)
            //$scope.imMessageList.imConversations.push(nc);
          },
          function(failedInfo) {
            alert("更新会话信息失败");
          });
        };

        //imConversationService.updateConversation(function(data){
        //  $scope.imUsers = data;
        //},function(data) {
        //  alert('updateConversationList failed');
        //});

        $scope.popupConversationOptions = function(message) {
          $scope.popup.index = $scope.imMessageList.imConversations.indexOf(message);
          $scope.popup.optionsPopup = $ionicPopup.show({
            templateUrl: "modules/im/popup.html",
            scope: $scope,
          });
          $scope.popup.isPopup = true;
        };
        $scope.markConversation = function() {
          var index = $scope.popup.index;
          var conversation = $scope.imMessageList.imConversations[index];
          if (conversation.showHints) {
            conversation.showHints = false;
            conversation.noReadMessages = 0;
          } else {
            conversation.showHints = true;
            conversation.noReadMessages = 1;
          }
          $scope.popup.optionsPopup.close();
          $scope.popup.isPopup = false;

          imConversationService.updateConversation2Local(conversation);
        };
        $scope.deleteConversation = function() {
          var index = $scope.popup.index;
          var conversation = $scope.imMessageList.imConversations[index];
          $scope.imMessageList.imConversations.splice(index, 1);
          $scope.popup.optionsPopup.close();
          $scope.popup.isPopup = false;
          imConversationService.deleteConversation4Local(conversation);
          //messageService.deleteMessageId(message.id);
          //messageService.clearMessage(message);
        };
        $scope.topConversation = function() {
          var index = $scope.popup.index;
          var conversation = $scope.imMessageList.imConversations[index];
          if (conversation.isTop) {
            conversation.isTop = 0;
          } else {
            conversation.isTop = new Date().getTime();
          }
          $scope.popup.optionsPopup.close();
          $scope.popup.isPopup = false;
          imConversationService.updateConversation2Local(conversation);
          //messageService.updateMessage(message);
        };
        $scope.conversationDetails = function(conversation) {
          $state.go("im-message-detail", {
            "messageId": conversation.toUsername
          });
        };
        $scope.$on("$ionicView.beforeEnter", function(){
          // console.log($scope.messages);
          $scope.imMessageList.imConversations = imConversationService.getLocalConversation();//messageService.getAllMessages();
          $scope.popup = {
            isPopup: false,
            index: 0
          };
        });

      })
      .controller('imMessageDetailController', ['$scope', '$stateParams',
        'messageService', '$ionicScrollDelegate', '$timeout','imMessageService','jimService',
        function($scope, $stateParams, messageService, $ionicScrollDelegate, $timeout,imMessageService,jimService) {
          var viewScroll = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');
          // console.log("enter");
          $scope.doRefresh = function() {
            // console.log("ok");
            $scope.messageNum += 5;
            $timeout(function() {
              $scope.messageDetils = messageService.getAmountMessageById($scope.messageNum,
                $stateParams.messageId);
              $scope.$broadcast('scroll.refreshComplete');
            }, 200);
          };

          $scope.$on("$ionicView.beforeEnter", function() {
            //获取跳转后的状态数据，包括username和toUsrname
            var username = 'xixi';
            var toUsername = 'dada';
            $scope.user = {
              username:username,
              pic:'img/' + username + '.png'
            };

            $scope.toUser = {
              username:toUsername,
              pic:'img/' + toUsername + '.png'
            };

            $scope.messageDetails = imMessageService.getLocalMessageList(username,toUsername);
            if( $scope.messageDetails == null ) {
              $scope.messageDetails = new Array();
            }

            // 获取用户会话信息
            $scope.conversation = {
              toUsername:toUsername
            };
            $scope.conversation.noReadMessages = 0;

            // update conversation

            $timeout(function() {
              viewScroll.scrollBottom();
            }, 0);
            //$scope.message = messageService.getMessageById($stateParams.messageId);
            //$scope.message.noReadMessages = 0;
            //$scope.message.showHints = false;
            //messageService.updateMessage($scope.message);
            //$scope.messageNum = 10;
            //$scope.messageDetils = messageService.getAmountMessageById($scope.messageNum,
            //  $stateParams.messageId);

          });

          $scope.sendMessage = function(event) {
            var messageDetail = {
              username:$scope.user.username,
              toUsername:$scope.toUser.username,
              type:'text',
              //pic:'img/ionic.png',
              content:$scope.sendContent,
              time: new Date().toLocaleString(),
              isFromMe:true,
              sendState:0
            };

            imMessageService.sendMessage(messageDetail.username,messageDetail.toUsername,'text',$scope.sendContent,function(msgDtl,response) {
                msgDtl.sendState=1;
                alert("send message success");
                imMessageService.updateMessage(msgDtl.username,msgDtl.toUsername,msgDtl);
                //$scope.messageDetails = imMessageService.getLocalMessageList(msgDtl.username,msgDtl.toUsername);
                for(var index = 0; index < $scope.messageDetails.length; ++index ) {
                  var m = $scope.messageDetails[index];
                  console.log('message content:' + msgDtl.content + ' time:' + msgDtl.time);
                  console.log('m content:' + m.content + ' time:' + m.time);
                  if( m.content === msgDtl.content && m.time === msgDtl.time ) {
                    //m.sendState = msgDtl.sendState;
                    console.log('更新scope messageDetail');

                    $scope.$apply(function() {
                      $scope.messageDetails.splice(index,1,msgDtl);
                      viewScroll.scrollBottom();
                    });
                  }
                }
              },function(msgDtl,response) {
                alert('send message failed');
                msgDtl.sendState=-1;
                imMessageService.updateMessage(msgDtl.username,msgDtl.toUsername,msgDtl);
                $scope.messageDetails = imMessageService.getLocalMessageList(msgDtl.username,msgDtl.toUsername);
                for(var index = 0; index < $scope.messageDetails.length; ++index ) {
                  var m = $scope.messageDetails[index];
                  console.log('message content:' + msgDtl.content + ' time:' + msgDtl.time);
                  console.log('m content:' + m.content + ' time:' + m.time);
                  if( m.content === msgDtl.content && m.time === msgDtl.time ) {
                    //m.sendState = msgDtl.sendState;
                    console.log('更新scope messageDetail');

                    $scope.$apply(function() {
                      $scope.messageDetails.splice(index,1,msgDtl);
                      viewScroll.scrollBottom();
                    });
                  }
                }
              },messageDetail);
            imMessageService.addMessage(messageDetail.username,messageDetail.toUsername,messageDetail);

            $scope.messageDetails.push(messageDetail);
            $scope.sendContent = '';
          };
          window.addEventListener("native.keyboardshow", function(e){
            viewScroll.scrollBottom();
          });

          var onSingleReceiveMessage = function (data) {
            console.log("receive im message");
            if( typeof(data.msg_type) === 'undefined') {
              console.log('receive invalid message:'+ writeObj(data));
            }
            else {
              console.log('receive message:'+ data.msg_body.text + " username:" +data.target_id + " toUserName:" + data.from_id);

              var messageDetail = {
                username:jimService.getUsername(), //由于data.target_id 与 data.from_id相等，因此用当前登录的用户名
                toUsername:data.from_id,
                type:'text',
                content:data.msg_body.text,
                time: data.create_time,
                isFromMe:false,
                sendState:1
              };

              $scope.$apply(function() {
                imMessageService.addMessage(messageDetail.username,messageDetail.toUsername,messageDetail);
                $scope.messageDetails.push(messageDetail);
                viewScroll.scrollBottom();
              });
            }
          };

          var config = {
            onSingleReceiveMessage:onSingleReceiveMessage
          };

          jimService.updateMessageNotifyCB(config);
        }
      ]);



    angular.module('im.directives', [])
      .directive('rjHoldActive', ['$ionicGesture', '$timeout', '$ionicBackdrop',
        function($ionicGesture, $timeout, $ionicBackdrop) {
          return {
            scope: false,
            restrict: 'A',
            replace: false,
            link: function(scope, iElm, iAttrs, controller) {
              $ionicGesture.on("hold", function() {
                iElm.addClass('active');
                $timeout(function() {
                  iElm.removeClass('active');
                }, 300);
              }, iElm);
            }
          };
        }
      ])
      .directive('rjCloseBackDrop', [function() {
        return {
          scope: false,
          restrict: 'A',
          replace: false,
          link: function(scope, iElm, iAttrs, controller) {
            var htmlEl = angular.element(document.querySelector('html'));
            htmlEl.on("click", function(event) {
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
      .directive('resizeFootBar', ['$ionicScrollDelegate', function($ionicScrollDelegate){
        // Runs during compile
        return {
          replace: false,
          link: function(scope, iElm, iAttrs, controller) {
            scope.$on("taResize", function(e, ta) {
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
      .directive('rjPositionMiddle', ['$window', function($window){
        return{
          replace: false,
          link: function(scope, iElm, iAttrs, controller){
            var height = $window.innerHeight - 44 - 49 - iElm[0].offsetHeight;
            if (height >= 0) {
              iElm[0].style.top = (height / 2 + 44) + 'px';
            }else{
              iElm[0].style.top = 44 + 'px';
            }
          }
        }
      }])
  }




)();


