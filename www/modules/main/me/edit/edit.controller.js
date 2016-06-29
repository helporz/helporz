/**
 * Created by Midstream on 16/4/25 .
 */

(function () {
  'use strict';

  angular.module('main.edit')
    .controller('mainEditCtrl', ['$scope', '$timeout', '$state', '$stateParams', 'taskNetService', 'taskUtils',
      '$ionicHistory', '$ionicActionSheet', '$ionicLoading', '$cordovaCamera', '$cordovaImagePicker', '$window',
      'mainEditSheetService', 'userNetService',
      mainEditCtrl]);

  function mainEditCtrl($scope, $timeout, $state, $stateParams, taskNetService, taskUtils, $ionicHistory,
                        $ionicActionSheet, $ionicLoading, $cordovaCamera, $cordovaImagePicker, $window,
                        mainEditSheetService, userNetService) {
    var vm = $scope.vm = {};

    $scope.$on("$ionicView.beforeEnter", function () {

    });

    vm.cb_back = function () {
      $ionicHistory.goBack(-1);
    }

    $scope.$on("$ionicView.enter", function () {
      var selfInfo = userNetService.cache.selfInfo;
      vm.edit.nickname = selfInfo.nickname;
      vm.edit.org = selfInfo.orgList[0];
      vm.edit.department = selfInfo.department;
      vm.edit.dormitory = selfInfo.dormitory;
      vm.edit.gender = selfInfo.gender == 1 ? "男": "女";
      vm.edit.hometown = selfInfo.hometown;
      vm.edit.sign = selfInfo.sign;
    }

    vm.edit = {

      avatarLocalUrl: null,
      nickname: 'my name is Jim',

      cb_avatar: function () {
        console.log('click on imag');
        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
          titleText: "请选择图片来源",
          buttons: [
            //{ text: "<b>分享</b>文章" },
            {text: "照相机"},
            {text: "本地相薄"}
          ],
          buttonClicked: function (index) {

            // 打开照相机
            if (index == 0) {
              var options = {
                //这些参数可能要配合着使用，比如选择了sourcetype是0，destinationtype要相应的设置
                quality: 100,                                            //相片质量0-100
                destinationType: Camera.DestinationType.FILE_URI,        //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
                sourceType: Camera.PictureSourceType.CAMERA,             //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
                allowEdit: false,                                        //在选择之前允许修改截图
                encodingType: Camera.EncodingType.JPEG,                   //保存的图片格式： JPEG = 0, PNG = 1
                targetWidth: 200,                                        //照片宽度
                targetHeight: 200,                                       //照片高度
                mediaType: 0,                                             //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
                cameraDirection: 0,                                       //枪后摄像头类型：Back= 0,Front-facing = 1
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true                                   //保存进手机相册
              };

              $cordovaCamera.getPicture(options).then(function (imgUrl) {
                vm.edit.avatarLocalUrl = imgUrl;
                alert('img:' + imgUrl);
              }, function (err) {
                alert('err: camera get picture err=' + err);
              });
            }
            // 打开 ImagePicker
            else {
              var options = {
                maximumImagesCount: 10,
                width: 800,
                height: 800,
                quality: 80
              };
              alert('before $cordovaImagePicker.getPictures');
              $cordovaImagePicker.getPictures(options).then(function (imgUrl) {
                vm.edit.avatarLocalUrl = imgUrl;
                alert('img:' + imgUrl);
              }, function (err) {
                // error getting photos
                alert('err: pick image, err=' + err);
              });
              alert('before $window.imagePicker.getPictures');
              $window.imagePicker.getPictures(
                function (results) {
                  for (var i = 0; i < results.length; i++) {
                    console.log('Image URI: ' + results[i]);
                    alert('img:' + results[i]);
                  }
                }, function (error) {
                  console.log('Error: ' + error);
                }
              );

            }


            return true;
          },
          cancelText: "取消",
          cancel: function () {
            // add cancel code..
          },
          //destructiveText: "删除",
          destructiveButtonClicked: function () {
          }
        });

        // For example's sake, hide the sheet after two seconds
        //$timeout(function () {
        //  //	hideSheet();
        //}, 2000);

      },

      cb_nickname: function () {
        mainEditSheetService.title = '修改昵称';
        mainEditSheetService.isInputOrTextarea = true;
        mainEditSheetService.placeholder = '起个好听的名字吧';
        mainEditSheetService.className = '';
        mainEditSheetService.cb = function(txt) {
          $ionicLoading.show();
          userNetService.updateNickname(txt).then(
            function (data) {
              $ionicLoading.show({
                duration: 1500,
                templateUrl: 'modules/components/templates/ionic-loading/com-submit-success.html'
              });
              userNetService.cache.selfInfo.nickname = txt;
              $timeout(function() {
                $ionicHistory.goBack(-1);
              }, 1500);

            }, function (data) {
              $ionicPopup.alert({
                title: '错误提示',
                template: data
              }).then(function (res) {
                console.error(data);
              })
            }).finally(function () {
            });
        }
        $state.go('main.edit-sheet');
      },

      cb_org: function () {
        mainEditSheetService.title = '修改组织';
        mainEditSheetService.isInputOrTextarea = true;
        mainEditSheetService.placeholder = '你是哪个大学的';
        mainEditSheetService.className = '';
        mainEditSheetService.cb = function(txt) {
          $ionicLoading.show();
          userNetService.updateOrg(txt).then(
            function (data) {
              $ionicLoading.show({
                duration: 1500,
                templateUrl: 'modules/components/templates/ionic-loading/com-submit-success.html'
              });
              userNetService.cache.selfInfo.orgList[0] = txt;
              $timeout(function() {
                $ionicHistory.goBack(-1);
              }, 1500);

            }, function (data) {
              $ionicPopup.alert({
                title: '错误提示',
                template: data
              }).then(function (res) {
                console.error(data);
              })
            }).finally(function () {
            });
        }
        $state.go('main.edit-sheet');
      },
      cb_department: function () {
        mainEditSheetService.title = '修改院系';
        mainEditSheetService.isInputOrTextarea = true;
        mainEditSheetService.placeholder = '你是哪个系的';
        mainEditSheetService.className = '';
        mainEditSheetService.cb = function(txt) {
          $ionicLoading.show();
          userNetService.updateOrg(txt).then(
            function (data) {
              $ionicLoading.show({
                duration: 1500,
                templateUrl: 'modules/components/templates/ionic-loading/com-submit-success.html'
              });
              userNetService.cache.selfInfo.department = txt;
              $timeout(function() {
                $ionicHistory.goBack(-1);
              }, 1500);

            }, function (data) {
              $ionicPopup.alert({
                title: '错误提示',
                template: data
              }).then(function (res) {
                console.error(data);
              })
            }).finally(function () {
            });
        }
        $state.go('main.edit-sheet');
      },
      cb_dormitory: function () {
        mainEditSheetService.title = '修改寝室楼栋';
        mainEditSheetService.isInputOrTextarea = true;
        mainEditSheetService.placeholder = '你是哪个寝室哪个楼的';
        mainEditSheetService.className = '';
        mainEditSheetService.cb = function(txt) {
          $ionicLoading.show();
          userNetService.updateDormitory(txt).then(
            function (data) {
              $ionicLoading.show({
                duration: 1500,
                templateUrl: 'modules/components/templates/ionic-loading/com-submit-success.html'
              });
              userNetService.cache.selfInfo.dormitory = txt;
              $timeout(function() {
                $ionicHistory.goBack(-1);
              }, 1500);

            }, function (data) {
              $ionicPopup.alert({
                title: '错误提示',
                template: data
              }).then(function (res) {
                console.error(data);
              })
            }).finally(function () {
            });
        }
        $state.go('main.edit-sheet');
      },

      cb_gender: function () {
        $ionicActionSheet.show({
          titleText: "请选择性别",
          buttons: [
            //{ text: "<b>分享</b>文章" },
            {text: "<b>男</b>"},
            {text: "<b>女</b>"}
          ],
          buttonClicked: function (index) {

            // 打开照相机
            if (index == 0) {

            }
            // 打开 ImagePicker
            else {


            }

            $ionicLoading.show();
            userNetService.updateGender(index+1).then(
              function (data) {
                $ionicLoading.show({
                  duration: 1500,
                  templateUrl: 'modules/components/templates/ionic-loading/com-submit-success.html'
                });
                userNetService.cache.selfInfo.gender = index+1;
                vm.edit.gender = userNetService.cache.selfInfo.gender == 1 ? "男": "女";
              }, function (data) {
                $ionicPopup.alert({
                  title: '错误提示',
                  template: data
                }).then(function (res) {
                  console.error(data);
                })
              }).finally(function () {
              });

          },
          cancelText: "取消",
          cancel: function () {
            // add cancel code..
          },
          destructiveButtonClicked: function () {
          }
        })
      },

      cb_hometown: function () {
        mainEditSheetService.title = '修改家乡';
        mainEditSheetService.isInputOrTextarea = true;
        mainEditSheetService.placeholder = '老家是哪里的';
        mainEditSheetService.className = '';
        mainEditSheetService.cb = function(txt) {
          $ionicLoading.show();
          userNetService.updateHometown(txt).then(
            function (data) {
              $ionicLoading.show({
                duration: 1500,
                templateUrl: 'modules/components/templates/ionic-loading/com-submit-success.html'
              });
              userNetService.cache.selfInfo.hometown = txt;
              $timeout(function() {
                $ionicHistory.goBack(-1);
              }, 1500);

            }, function (data) {
              $ionicPopup.alert({
                title: '错误提示',
                template: data
              }).then(function (res) {
                console.error(data);
              })
            }).finally(function () {
            });
        }
        $state.go('main.edit-sheet');
      },

      cb_sign: function () {
        mainEditSheetService.title = '修改个人签名';
        mainEditSheetService.isInputOrTextarea = true;
        mainEditSheetService.placeholder = '...';
        mainEditSheetService.className = '';
        mainEditSheetService.cb = function(txt) {
          $ionicLoading.show();
          userNetService.updateHometown(txt).then(
            function (data) {
              $ionicLoading.show({
                duration: 1500,
                templateUrl: 'modules/components/templates/ionic-loading/com-submit-success.html'
              });
              userNetService.cache.selfInfo.hometown = txt;
              $timeout(function() {
                $ionicHistory.goBack(-1);
              }, 1500);

            }, function (data) {
              $ionicPopup.alert({
                title: '错误提示',
                template: data
              }).then(function (res) {
                console.error(data);
              })
            }).finally(function () {
            });
        }
        $state.go('main.edit-sheet');
      }
    };


  }
})()
