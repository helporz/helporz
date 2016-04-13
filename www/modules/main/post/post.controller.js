/**
 * Created by Midstream on 16/4/12.
 */

(function(){
  'use strict';

  angular.module('main.post')
    .controller('mainPostCtrl', ['$scope', '$ionicModal', '$timeout', mainPostCtrl]);

  function mainPostCtrl($scope, $ionicModal, $timeout) {
    $ionicModal.fromTemplateUrl('modules/main/post/postmodal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      console.log("then");
      //$scope.openModal();
    });
    $scope.openModal = function() {
      $scope.modal.show();
      console.log("show");

      $timeout(function() {
        $scope.closeModal();
      }, 1000);
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
      console.log("close");
    };
    //当我们用到模型时，清除它！
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // 当隐藏的模型时执行动作
    $scope.$on('modal.hide', function() {
      // 执行动作
    });
    // 当移动模型时执行动作
    $scope.$on('modal.removed', function() {
      // 执行动作
    });
  }
})()
