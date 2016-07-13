/**
 * Created by binfeng on 16/4/6.
 */
;(
  function() {
    'use strict';
    angular.module('com.helporz.utils.service').service('fileService',['$log',function($log) {
      var fileSystem;
      var fileSystemRootPath;
      var errorHandler = function (fileName,onFailed, e) {
        var msg = '';
        switch (e.code) {
          case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'Storage quota exceeded';
            break;
          case FileError.NOT_FOUND_ERR:
            msg = 'File not found';
            break;
          case FileError.SECURITY_ERR:
            msg = 'Security error';
            break;
          case FileError.INVALID_MODIFICATION_ERR:
            msg = 'Invalid modification';
            break;
          case FileError.INVALID_STATE_ERR:
            msg = 'Invalid state';
            break;
          default:
            msg = 'Unknown error';
            break;
        };
        console.log('Error (' + fileName + '): ' + msg);
      }

      //1 初始化
      this.init = function(onSuccess,onFailed) {
        window.requestFileSystem(window.PERSISTENT,0,function(fs){
          $log.info('Opened file system: ' + fs.name);
          fileSystem = fs;
          fileSystemRootPath = cordova.file.dataDirectory + 'files/';
          onSuccess();
        },function(e) {
          var msg = '';
          switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
              msg = 'QUOTA_EXCEEDED_ERR';
              break;
            case FileError.NOT_FOUND_ERR:
              msg = 'NOT_FOUND_ERR';
              break;
            case FileError.SECURITY_ERR:
              msg = 'SECURITY_ERR';
              break;
            case FileError.INVALID_MODIFICATION_ERR:
              msg = 'INVALID_MODIFICATION_ERR';
              break;
            case FileError.INVALID_STATE_ERR:
              msg = 'INVALID_STATE_ERR';
              break;
            default:
              msg = 'Unknown Error';
              break;
          };

          $log.error('Error: ' + msg);
          onFailed();
        });
      };

      //2 写文件
      this.writeToFile = function(dirName,fileName, data,onSuccess,onFailed) {
        $log.debug('write to file dir:' + fileSystemRootPath+  dirName);
        window.resolveLocalFileSystemURL(fileSystemRootPath + dirName, function (directoryEntry) {
          directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
            fileEntry.createWriter(function (fileWriter) {
              fileWriter.onwriteend = function (e) {
                // for real-world usage, you might consider passing a success callback
                console.log('Write of file "' + fileName + '"" completed.');
              };
              fileWriter.onerror = function (e) {
                // you could hook this up with our global error handler, or pass in an error callback
                console.log('Write failed: ' + e.toString());
              };
              //var blob = new Blob([data], { type: 'text/plain' });
              //fileWriter.write(blob);
              fileWriter.write(data);
            }, errorHandler.bind(null, fileName,onFailed));
          }, errorHandler.bind(null, fileName,onFailed));
        }, errorHandler.bind(null, fileName,onFailed));
      };
      //3 读取文件
      this.readFromFile = function(dirName,fileName,onSuccess,onFailed) {
        var pathToFile = fileSystemRootPath + dirName + fileName;
        window.resolveLocalFileSystemURL(pathToFile, function (fileEntry) {
          fileEntry.file(function (file) {
            var reader = new FileReader();
            reader.onloadend = function (e) {
              $log.info("reader onload end,result:" + this.result);
              onSuccess(this.result);
              return this.result;
            };
            //reader.readAsArrayBuffer(file);
            reader.readAsText(file);
          }, errorHandler.bind(null, fileName,onFailed));
        }, errorHandler.bind(null, fileName,onFailed));
      };

      this.readFileFromFullPath = function(fileFullName,onSuccess,onFailed) {
        window.resolveLocalFileSystemURL(fileFullName, function (fileEntry) {
          fileEntry.file(function (file) {
            var reader = new FileReader();
            reader.onloadend = function (e) {
              //$log.info("reader onload end,result:" + this.result);
              onSuccess(this.result);
              return this.result;
            };
            //reader.readAsArrayBuffer(file);
            reader.readAsBinaryString(file);
          }, errorHandler.bind(null, fileFullName,onFailed));
        }, errorHandler.bind(null, fileFullName,onFailed));
      };

      var createDirImp = function(rootDirEntry, folders,onSuccess,onFailed) {
        // Throw out './' or '/' and move on to prevent something like '/foo/.//bar'.
        if (folders[0] == '.' || folders[0] == '') {
          folders = folders.slice(1);
        }

        if( folders == null || folders.length == 0 ) {
          $log.info('completed create dir');
          onSuccess();
          return;
        }
        $log.info('folder name:' + folders[0]);
        rootDirEntry.getDirectory(folders[0], {create: true,exclusive : false  }, function(dirEntry) {
          // Recursively add the new subfolder (if we still have another to create).
          if (folders.length) {
            createDirImp(dirEntry, folders.slice(1),onSuccess,onFailed);
          }
        }, onFailed);
      };

      //4 创建目录
      this.createDir = function(dirPath,onSuccess,onFailed) {
          var fs = fileSystem;
        $log.info(fs.root.baseURI + ":" + fs.root.toURL() + ":" + fs.root.toInternalURL());
        createDirImp(fs.root,dirPath.split('/'),onSuccess,onFailed);
      }

      //5 获取文件的cdvfile url
      this.getCDVFileUrl = function(fileName) {
        if( fileName.charAt(0) == '/') {
          return "cdvfile://localhost/" + fileSystem.name + fileName;
        }
        else {
          return "cdvfile://localhost/" + fileSystem.name + '/' + fileName;
        }
      }

    }]).service('imFileService',['fileService',function(fileService) {
      this.saveAudioFile = function(username,chatUsername,chatSerialno,audioFile) {
        var pathToFile = '/im/'+ username +'/' +chatUsername+'/'+ chatSerialno+'.mp3';
        fileService.writeToFile(pathToFile,audioFile,onSuccess,onFailed);
      }

      this.saveImgFile = function(username,chatUsername,chatSerialno,imgData) {
        var pathToFile = '/im/'+ username +'/' +chatUsername+'/'+ chatSerialno+'.png';
        fileService.writeToFile(pathToFile,imgData,onSuccess,onFailed);
      }

      this.getAudioFileUrl = function(username,chatUsername,chatSerialno) {
        return fileService.getCDVFileUrl('/im/'+ username +'/' +chatUsername+'/'+ chatSerialno+'.mp3');
      }

      this.getImgFileUrl = function(username,chatUsername,chatSerialno) {
        return  fileService.getCDVFileUrl('/im/'+ username +'/' +chatUsername+'/'+ chatSerialno+'.png');
      }

    }]).service('userImgFileService',['fileService',function(fileService) {
       this.getUserImgUrl = function(username) {
         return  fileService.getCDVFileUrl('/user/'+ username + '.png');
       };

      this.saveUserImg = function(username,imgData,onSuccess,onFailed) {
        var fileName= username + '.png';
        fileService.createDir('user/',function() {
          fileService.writeToFile('user/' , fileName ,imgData,onSuccess,onFailed);
        },function(e) {
          var msg = '';
          switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
              msg = 'Storage quota exceeded';
              break;
            case FileError.NOT_FOUND_ERR:
              msg = 'File not found';
              break;
            case FileError.SECURITY_ERR:
              msg = 'Security error';
              break;
            case FileError.INVALID_MODIFICATION_ERR:
              msg = 'Invalid modification';
              break;
            case FileError.INVALID_STATE_ERR:
              msg = 'Invalid state';
              break;
            default:
              msg = 'Unknown error';
              break;
          };
          console.log('Error: createDir errCode ' + e.code + ' msg' + msg);
            onFailed();
        });
      };

    }]);

  }
)();
