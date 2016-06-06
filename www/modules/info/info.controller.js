/**
 * Created by Midstream on 16/3/29.
 */

(function () {
  'use strict';

  angular.module('info')
    .controller('infoCtrl', ['$state', '$scope', '$ionicHistory', '$ionicLoading', '$ionicPopup', '$ionicScrollDelegate', '$ionicActionSheet',
      '$cordovaCamera', '$cordovaImagePicker', '$timeout', '$interval', 'userNetService',
      'errorCodeService', 'schoolSelectService', infoCtrl])
    .factory('schoolSelectService', schoolSelectService)

  function infoCtrl($state, $scope, $ionicHistory, $ionicLoading, $ionicPopup, $ionicScrollDelegate, $ionicActionSheet,
                  $cordovaCamera, $cordovaImagePicker, $timeout, $interval, userNetService, errorCodeService, schoolSelectService) {
    var vm = $scope.vm = {};

    vm.info = {
      avatar: "",
      schoolName: '',
      gender: 0
    }

    vm.info.cb_gender = function () {
      $state.go('main.edit');
    }
    vm.info.cb_school = function () {
      $state.go('searchSchool');
    }

    vm.info.cb_avatar = function () {
      console.log('click on image');

      //Show the action sheet
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
              vm.info.avatar = imgUrl;
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
              vm.selectedPics.push({
                src: imgUrl
              })
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
    }

    vm.info.onChangeTab = function (index) {

    }


    $scope.$on("$ionicView.enter", function () {

      vm.info.schoolName = schoolSelectService.selectedSchool.name

    });


    //////////////////////////////////////////////////
    // tab logic
    //vm.meScroll = $ionicScrollDelegate.$getByHandle('meScroll');
    vm.activeTab = 0;


    vm.info.cb_ok = function() {
      $state.go('main.near');
      $ionicHistory.clearHistory();
    }

  }

  function schoolSelectService(){
    var selectedSchool = {
      name: '来自哪所高校',
      id: -1
    };

    return {
      selectedSchool: selectedSchool
    }
  }


})()
