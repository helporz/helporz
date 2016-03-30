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
      .controller('imMessageListController', function($scope, $state, $ionicPopup, localStorageService,
                                                      messageService,jimService,imConversationService) {

        $scope.imConversations = imConversationService.getLocalConversation();

        // console.log($scope.messages);
        //$scope.onSwipeLeft = function() {
        //  $state.go("tab.friends");
        //};

        console.log('im message list controller');
        $scope.updateConversationList = function() {
          imConversationService.updateConversationFromImServer(function(newConversationList) {
              $scop.imConversations = newConversationList;
            //for( var nc in newConversation)
            //$scope.imConversations.push(nc);
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
          $scope.popup.index = $scope.imConversations.indexOf(message);
          $scope.popup.optionsPopup = $ionicPopup.show({
            templateUrl: "modules/im/popup.html",
            scope: $scope,
          });
          $scope.popup.isPopup = true;
        };
        $scope.markConversation = function() {
          var index = $scope.popup.index;
          var conversation = $scope.imConversations[index];
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
          var conversation = $scope.imConversations[index];
          $scope.imConversations.splice(index, 1);
          $scope.popup.optionsPopup.close();
          $scope.popup.isPopup = false;
          imConversationService.deleteConversation4Local(conversation);
          //messageService.deleteMessageId(message.id);
          //messageService.clearMessage(message);
        };
        $scope.topConversation = function() {
          var index = $scope.popup.index;
          var conversation = $scope.imConversations[index];
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
          $scope.imConversations = imConversationService.getLocalConversation();//messageService.getAllMessages();
          $scope.popup = {
            isPopup: false,
            index: 0
          };
        });

      })
      .controller('imMessageDetailController', ['$scope', '$stateParams',
        'messageService', '$ionicScrollDelegate', '$timeout',
        function($scope, $stateParams, messageService, $ionicScrollDelegate, $timeout) {
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
            $scope.message = messageService.getMessageById($stateParams.messageId);
            $scope.message.noReadMessages = 0;
            $scope.message.showHints = false;
            messageService.updateMessage($scope.message);
            $scope.messageNum = 10;
            $scope.messageDetils = messageService.getAmountMessageById($scope.messageNum,
              $stateParams.messageId);
            $timeout(function() {
              viewScroll.scrollBottom();
            }, 0);
          });

          window.addEventListener("native.keyboardshow", function(e){
            viewScroll.scrollBottom();
          });
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


