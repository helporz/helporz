/**
 * Created by binfeng on 16/4/6.
 */
;
(function () {
  'use strict';

  angular.module('com.helporz.user.netservice', ['com.helporz.utils.service']).factory('userNetService', ['$q', '$log', 'httpBaseService',
    'errorCodeService', 'httpErrorCodeService','uploadService','userLoginInfoService' ,UserNetServiceFactoryFn])

  function UserNetServiceFactoryFn($q, $log, httpBaseService, errorCodeService, httpErrorCodeService,uploadService,
                                   userLoginInfoService) {

    // cache
    var _cache = {
      nearTaskList: [],

      selfInfo: null,

      userInfo: {}
    };

    var _login = function (deviceType, phoneNo, smsCode) {
      var data = {
        type: deviceType,
        userinfo: phoneNo,
        smscode: smsCode
      }
      return httpBaseService.postForPromise("/user/verify_sms", data);
    }

    var _loginByTicket = function (ticket, sign) {
      var data = {ticket: ticket, sign: sign};
      return httpBaseService.postForPromise("/user/login_by_ticket", data);
    }

    var _logout = function (ticket, sign, onSuccessFn, onFailedFn) {
      var data = {ticket: ticket, sign: sign};
      return httpBaseService.postForPromise("/user/logout", data);
    };

    var _checkUpdatePackage = function (packageVersion, terminalInfo, onSuccessFn, onFailedFn) {
      var data = {
        packageVersion: packageVersion,
        terminalInfo: terminalInfo
      };
      httpBaseService.post("/user/check_update_package", data, function (resp, status, headers, config) {
        onSuccessFn(resp.downloadUrl, resp.version, isMustUpdate);
      }, function (code, data, status, headers, config) {
        onFailedFn(code);
      }, function (data, status, headers, config) {

      });

    };

    var _getSelfInfo = function (onSuccessFn, onFailedFn) {
      httpBaseService.get('/user/get_self_info', null, function (resp, status, headers, config) {
        onSuccessFn(resp.data);
      }, function (code, data, status, headers, config) {
        onFailedFn(code);
      }, function (data, status, headers, config) {

      });
    }

    var _getSelfInfoForPromise = function () {
      var getSelfDefer = $q.defer();
      httpBaseService.get('/user/get_self_info', null, function (resp, status, headers, config) {
        getSelfDefer.resolve(resp.data);
        //cache it
        _cache.selfInfo = resp.data;
      }, function (code, data, status, headers, config) {
        getSelfDefer.reject(errorCodeService.getErrorCodeDescription(code));
      }, function (data, status, headers, config) {
        getSelfDefer.reject(httpErrorCodeService.getErrorCodeDescription(status));
      });
      return getSelfDefer.promise;
    };

    var _getUserInfo = function (userId, onSuccessFn, onFailedFn) {
      httpBaseService.get('/user/' + userId + '/get_user_info', null, function (resp, status, headers, config) {
        onSuccessFn(resp.data);
        _cache.userInfo[userId] = resp.data;
      }, function (code, data, status, headers, config) {
        onFailedFn(code);
      }, function (data, status, headers, config) {
      });
    };

    // 1为男，2为女
    var updateGender = function (gender) {
      var param = {
        gender: gender,
      }
      return httpBaseService.postForPromise('/user/self/update_gender', param);
    }

    var updateOrg = function (orgId) {
      var param = {
        orgId:orgId,
      }
      return httpBaseService.postForPromise('/user/self/update_org',param);
    }

    var updateDormitory = function(dormitory) {
      var param = {
        dormitory:dormitory,
      }
      return httpBaseService.postForPromise('/user/self/update_dormitory',param);
    }

    var updateDepartment = function(department) {
      var param = {
        department:department,
      }
      return httpBaseService.postForPromise('/user/self/update_department',param);
    }

    var updateHometown = function(hometown) {
      var param = {
        hometown:hometown,
      }

      return httpBaseService.postForPromise('/user/self/update_hometown',param);
    }

    var updateNickname = function(nickname) {
      var param = {
        nickname:nickname,
      };

      return httpBaseService.postForPromise('/user/self/update_nickname',param);
    }

    var updateAvatar = function(nativeUrl) {
      var headers = {
        Connection: "close",
        'x-login-key': userLoginInfoService.getLoginTicket()
      }
      return uploadService.uploadImgFile(nativeUrl, appConfig.API_SVC_URL +
        '/user/self/upload_avatar', headers);

    }

    var uploadIDCardPhoto = function(nativeUrl) {
      var headers = {
        Connection: "close",
        'x-login-key': userLoginInfoService.getLoginTicket()
      }
      return uploadService.uploadImgFile(nativeUrl, appConfig.API_SVC_URL +
        '/user/self/id_card_photo_ex', headers);
    }

    return {
      login: _login,
      loginByTicket: _loginByTicket,
      logout: _logout,
      checkUpdatePackage: _checkUpdatePackage,
      getSelfInfo: _getSelfInfo,
      getUserInfo: _getUserInfo,
      getSelfInfoForPromise: _getSelfInfoForPromise,
      updateGender: updateGender,
      updateOrg: updateOrg,
      updateDormitory:updateDormitory,
      updateHometown:updateHometown,
      updateNickname:updateNickname,
      uploadAvatar:uploadAvatar,
      uploadIDCardPhoto:uploadIDCardPhoto,
      cache: _cache
    };
  }
})();
