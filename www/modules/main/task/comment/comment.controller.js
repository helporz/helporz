/**
 * Created by Midstream on 16/3/29.
 */

(function () {
  'use strict';

  angular.module('main.comment')
    .controller('mainCommentCtrl', ['$state', '$stateParams', '$timeout', '$log', '$ionicLoading', '$ionicPopup',
      '$ionicActionSheet', '$cordovaCamera', '$cordovaImagePicker',
      '$scope', 'taskNetService', 'taskUtils', 'impressUtils', 'mainTaskService', 'promptService',
      mainCommentCtrl]);

  function mainCommentCtrl($state, $stateParams, $timeout, $log, $ionicLoading, $ionicPopup,
                           $ionicActionSheet, $cordovaCamera, $cordovaImagePicker,
                           $scope, taskNetService, taskUtils, impressUtils, mainTaskService,promptService) {
    var vm = $scope.vm = {};

    //////////////////////////////////////////////////
    vm.selectedPics = [];

    vm.cb_addPic = function (index) {
      console.log('click on imag' + index);

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
              allowEdit: true,                                        //在选择之前允许修改截图
              encodingType: Camera.EncodingType.JPEG,                   //保存的图片格式： JPEG = 0, PNG = 1
              targetWidth: 200,                                        //照片宽度
              targetHeight: 200,                                       //照片高度
              mediaType: 0,                                             //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
              cameraDirection: 0,                                       //枪后摄像头类型：Back= 0,Front-facing = 1
              popoverOptions: CameraPopoverOptions,
              saveToPhotoAlbum: true                                   //保存进手机相册
            };

            $cordovaCamera.getPicture(options).then(function (imgUrl) {
              vm.selectedPics.push(imgUrl);
              alert('selected:' + imgUrl);
            }, function (err) {
              alert('err: camera get picture err=' + err);
            });
          }
          // 打开 ImagePicker
          else {
            var options = {
              maximumImagesCount: 4,
              width: 800,
              height: 800,
              quality: 80
            };
            //$cordovaImagePicker.getPictures(options).then(function (imgUrl) {
            //  vm.selectedPics.push({
            //    src: imgUrl
            //  })
            //  alert('img:' + imgUrl);
            //}, function (err) {
            //  alert('err: pick image, err=' + err);
            //});

            $cordovaImagePicker.getPictures(options).then(function (imgUrls) {
              alert('imgUrls=' + imgUrls + ';imgUrls[0]=' + imgUrls[0]);
              for (var index = 0; index < imgUrls.length; ++index) {
                resolveLocalFileSystemURL(imgUrls[index], function (entry) {
                  $log.info('image cvd file:' + entry.toInternalURL());
                  alert('internal='+ entry.toInternalURL() + 'native=' + entry.toNativeURL());
                  if(vm.selectedPics.length < 4){
                    vm.selectedPics.push(entry.toNativeURL());
                  }
                });
              }
            }, function (err) {
              alert('err: pick image, err=' + err);
            });
            //$window.imagePicker.getPictures(
            //  function (results) {
            //    for (var i = 0; i < results.length; i++) {
            //      console.log('Image URI: ' + results[i]);
            //      alert('img:' + results[i]);
            //    }
            //  }, function (error) {
            //    console.log('Error: ' + error);
            //  }
            //);

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

    vm.cb_deletePic = function (index) {
      vm.selectedPics.splice(index, 1);
    }

    //////////////////////////////////////////////////


    vm.starScore = 0;
    $scope.$on('fiveStarChanged', function (evt, score) {
      console.log(score);
      vm.starScore = score;
    })

    vm.commentText = '';

    //////////////////////////////////////////////////

    //重置选择信息
    vm.impressUi = impressUtils.impressUI();
    vm.impressIndices = [];
    var buildImpressIdList = function(impressIndices) {
      var idListString = (impressIndices[0] + 1 ).toString();
      for(var idx = 1; idx < impressIndices.length; ++idx ) {
        idListString += ',' + (impressIndices[idx] + 1).toString();
      }
      return idListString;
    }

    vm.cb_impressSelect = function (index) {
      console.log("index:" + vm.impressIndices.indexOf(index));
      if (vm.impressIndices.indexOf(index) == -1) {
        if(vm.impressIndices.length < 3){
          vm.impressIndices.push(index);
          vm.impressUi[index].sel = true;
        }
      }
      else{
        var idx = vm.impressIndices.indexOf(index);
        vm.impressIndices.splice(idx, 1);
        vm.impressUi[index].sel = null;
      }
    };

    $scope.$on("$ionicView.beforeEnter", function () {
      var params = $stateParams.desc.split('-');
      vm.isAccepter = true;
      if (params[0] == 'accepter') {
        vm.isAccepter = true;
      } else if (params[0] == 'poster') {
        vm.isAccepter = false;
      } else {
        console.error('err: not accepter or poster, wrong stateParam')
      }

      vm.taskId = params[1];

      vm.task = taskNetService.cache.acceptTaskList[params[1]];
    });

    vm.cb_submit = function () {
      if(vm.starScore == 0) {
        $ionicLoading.show({
          duration: 1500,
          template: '请点亮星星给予评价哦~'
        });
        return;
      }

      $ionicLoading.show();

      //is acceptor
      if (vm.isAccepter) {
        //ask:xiaolang, fourth param 'tagList' is array?
        var imgNativePathList = [];
        var audioNativePathList = [];
        taskNetService.commentByAcceptor(vm.taskId, vm.starScore, vm.commentText, buildImpressIdList(vm.impressIndices),
          vm.selectedPics,
          audioNativePathList).then(
          function (data) {
            $ionicLoading.show({
              duration: 1500,
              templateUrl: 'modules/components/templates/ionic-loading/remark-success.html'
            });
            $timeout(function() {
              taskNetService.cache.isAcceptTaskGoingNeedRefresh = true;
              taskNetService.cache.isAcceptTaskFinishNeedRefresh = true;
              mainTaskService.jump = { tab: 1, subTab: 1 };
              $state.go('main.task');
            }, 1500);

          }, function (error) {
            //$ionicLoading.show({
            //  duration: 1500,
            //  templateUrl: 'modules/components/templates/ionic-loading/com-unknown-error.html'
            //});
            promptService.promptErrorInfo(error, 1500);
          }).finally(function () {
          });
      }
      // is poster
      else {
        var imgNativePathList = [];
        var audioNativePathList = [];
        taskNetService.commentByPoster(vm.taskId, vm.starScore, vm.commentText, buildImpressIdList(vm.impressIndices),
          vm.selectedPics,
          audioNativePathList).then(
          function (data) {
            $ionicLoading.show({
              duration: 1500,
              templateUrl: 'modules/components/templates/ionic-loading/remark-success.html'
            });
            $timeout(function() {
              taskNetService.cache.isPostTaskGoingNeedRefresh = true;
              taskNetService.cache.isPostTaskFinishNeedRefresh = true;
              mainTaskService.jump = { tab: 0, subTab: 1 };
              $state.go('main.task');
            }, 1500);

          }, function (data) {
            //$ionicLoading.show({
            //  duration: 1500,
            //  templateUrl: 'modules/components/templates/ionic-loading/com-unknown-error.html'
            //});
            promptService.promptErrorInfo(data, 1500);
          }).finally(function () {
          });
      }


    }
  }
})
()
