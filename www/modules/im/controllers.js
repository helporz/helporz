/**
 * Created by binfeng on 16/3/27.
 */
;(
  function() {
    'use strict';
    angular.module('im.controllers', [])
      .controller('messageController', function($scope, $state, $ionicPopup, localStorageService, messageService) {

        // $scope.messages = messageService.getAllMessages();
        // console.log($scope.messages);
        $scope.onSwipeLeft = function() {
          $state.go("tab.friends");
        };
        $scope.popupMessageOpthins = function(message) {
          $scope.popup.index = $scope.messages.indexOf(message);
          $scope.popup.optionsPopup = $ionicPopup.show({
            templateUrl: "templates/popup.html",
            scope: $scope,
          });
          $scope.popup.isPopup = true;
        };
        $scope.markMessage = function() {
          var index = $scope.popup.index;
          var message = $scope.messages[index];
          if (message.showHints) {
            message.showHints = false;
            message.noReadMessages = 0;
          } else {
            message.showHints = true;
            message.noReadMessages = 1;
          }
          $scope.popup.optionsPopup.close();
          $scope.popup.isPopup = false;
          messageService.updateMessage(message);
        };
        $scope.deleteMessage = function() {
          var index = $scope.popup.index;
          var message = $scope.messages[index];
          $scope.messages.splice(index, 1);
          $scope.popup.optionsPopup.close();
          $scope.popup.isPopup = false;
          messageService.deleteMessageId(message.id);
          messageService.clearMessage(message);
        };
        $scope.topMessage = function() {
          var index = $scope.popup.index;
          var message = $scope.messages[index];
          if (message.isTop) {
            message.isTop = 0;
          } else {
            message.isTop = new Date().getTime();
          }
          $scope.popup.optionsPopup.close();
          $scope.popup.isPopup = false;
          messageService.updateMessage(message);
        };
        $scope.messageDetils = function(message) {
          $state.go("messageDetail", {
            "messageId": message.id
          });
        };
        $scope.$on("$ionicView.beforeEnter", function(){
          // console.log($scope.messages);
          $scope.messages = messageService.getAllMessages();
          $scope.popup = {
            isPopup: false,
            index: 0
          };
        });

      })

      .controller('friendsCtrl', function($scope, $state) {
        $scope.onSwipeLeft = function() {
          $state.go("tab.find");
        };
        $scope.onSwipeRight = function() {
          $state.go("tab.message");
        };
        $scope.contacts_right_bar_swipe = function(e){
          console.log(e);
        };
      })

      .controller('settingCtrl', function($scope, $state) {
        $scope.onSwipeRight = function() {
          $state.go("tab.find");
        };
      })

      .controller('messageDetailController', ['$scope', '$stateParams',
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


