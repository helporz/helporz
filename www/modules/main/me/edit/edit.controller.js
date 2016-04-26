/**
 * Created by Midstream on 16/4/25 .
 */

(function () {
  'use strict';

  angular.module('main.edit')
    .controller('mainEditCtrl', ['$scope', '$timeout', '$state', '$stateParams', 'taskNetService', 'taskUtils',
      '$ionicHistory', '$ionicActionSheet', '$cordovaCamera', '$cordovaImagePicker', '$window', mainEditCtrl]);

  function mainEditCtrl($scope, $timeout, $state, $stateParams, taskNetService, taskUtils, $ionicHistory,
                        $ionicActionSheet, $cordovaCamera, $cordovaImagePicker, $window) {
    console.log($stateParams);

    var vm = $scope.vm = {};

    $scope.$on("$ionicView.beforeEnter", function () {

    });

    vm.cb_back = function () {
      $ionicHistory.goBack(-1);
    }

    vm.edit = {

      fiveStarsValue: 3.2,
      level: 42,
      hasExp: 292,
      totalExp: 389,
      smallCards: 3,
      bigCards: 265,
      visitors: [
        {
          url: 'http://t3.gstatic.cn/shopping?q=tbn:ANd9GcSCrdZNZUIlGriVTE3ZWMU_W5voV8527Q6PL8RGkMjtCFO1knnY6oIS1soNKN4&usqp=CAI'
        },
        {
          url: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=545887065,3542527475&fm=58'
        },
        {
          url: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=1902539898,1226346465&fm=58'
        }
      ],

      visitorImgWithIndex: function (index) {
        if (angular.isDefined(this.visitors[index])) {
          return this.visitors[index].url;
        } else {
          return '';
        }
      },

      cb_visitorImg: function (index) {
        console.log('click on image [' + index + ']');
        $state.go('main.user-info', {id: 'user-' + index});
      },

      avatarLocalUrl: null,

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
            } else {
              alert('index='+index);
              var options = {
                maximumImagesCount: 10,
                width: 800,
                height: 800,
                quality: 80
              };
              alert('pick1');
              $cordovaImagePicker.getPictures(options).then(function (imgUrl) {
                vm.edit.avatarLocalUrl = imgUrl;
                alert('img:' + imgUrl);
              }, function (err) {
                // error getting photos
                alert('err: pick image, err=' + err);
              });

              $window.imagePicker.getPictures(
                function(results) {
                  for (var i = 0; i < results.length; i++) {
                    console.log('Image URI: ' + results[i]);
                    alert('img:' + results[i]);
                  }
                }, function (error) {
                  console.log('Error: ' + error);
                }
              );

              alert('pick2');
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
        $timeout(function () {
          //	hideSheet();
        }, 2000);

      }

    };


  }
})()
