/**
 * Created by binfeng on 16/4/6.
 */
;
(function () {
  'use strict';

  angular.module('com.helporz.user.netservice', ['com.helporz.utils.service']).factory('userNetService', ['$q', '$log', 'httpBaseService',
    'errorCodeService', 'httpErrorCodeService', 'uploadService', 'userLoginInfoService', UserNetServiceFactoryFn])

  function UserNetServiceFactoryFn($q, $log, httpBaseService, errorCodeService, httpErrorCodeService, uploadService,
                                   userLoginInfoService) {

    // cache
    var _cache = {
      nearTaskList: [],

      selfInfo: null,


      userInfo: {}
    };

    var _login = function (deviceType, phoneNo, smsCode, terminalInfo) {
      var data = {
        type: deviceType,
        userinfo: phoneNo,
        smscode: smsCode,
        terminalInfo: terminalInfo,
      }
      $log.info('login:' + JSON.stringify(data));
      return httpBaseService.postForPromise("/user/verify_sms", data);
    }

    var _loginByTicket = function (ticket, sign, terminalInfo) {
      var data = {ticket: ticket, sign: sign, terminalInfo: terminalInfo,};
      $log.info('loginByTicket:' + JSON.stringify(data));
      return httpBaseService.postForPromise("/user/login_by_ticket", data);
    }

    var _logout = function (ticket, sign) {
      var data = {ticket: ticket, sign: sign};
      return httpBaseService.postForPromise("/user/logout", data);
    };

    var _checkUpdatePackage = function (packageVersion, terminalInfo, onSuccessFn, onFailedFn) {
      var data = {
        packageVersion: packageVersion,
        terminalInfo: terminalInfo
      };
      httpBaseService.post("/user/check_update_package", data, function (resp, status, headers, config) {
        onSuccessFn(resp.data.downloadUrl, resp.data.version, resp.data.isMustUpdate);
      }, function (code, data, status, headers, config) {
        onFailedFn(code);
      }, function (data, status, headers, config) {
        onFailedFn(status);
      });

    };

    var _getSelfInfo = function (onSuccessFn, onFailedFn) {
      httpBaseService.get('/user/get_self_info', null, function (resp, status, headers, config) {
        onSuccessFn(resp.data);
      }, function (code, data, status, headers, config) {
        onFailedFn(code);
      }, function (data, status, headers, config) {
        onFailedFn(status);
      });
    }

    var _getSelfInfoForPromise = function () {
      var getSelfDefer = $q.defer();
      httpBaseService.get('/user/get_self_info', null, function (resp, status, headers, config) {
        //cache it
        _cache.selfInfo = resp.data;

        getSelfDefer.resolve(resp.data);
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
        onFailedFn(status);
      });
    };

    var getUserInfoByNickname = function (nickname) {
      var _innerDefer = $q.defer();
      var param = {
        nickname: nickname,
      }
      httpBaseService.getForPromise('/user/get_user_info_by_nickname', param).then(function (res) {
        console.log('get user info by nickname success:' + JSON.stringify(res));
        _cache.userInfo[res.userId] = res;
        _innerDefer.resolve(res);
      }, function (error) {
        _innerDefer.reject(error);
      });
      return _innerDefer.promise;
    }
    // 1为男，2为女
    var updateGender = function (gender) {
      var param = {
        gender: gender,
      }
      return httpBaseService.postForPromise('/user/self/update_gender', param);
    }

    var updateOrg = function (orgId) {
      var param = {
        orgId: orgId,
      }
      return httpBaseService.postForPromise('/user/self/update_org', param);
    }

    var updateDormitory = function (dormitory) {
      var param = {
        dormitory: dormitory,
      }
      return httpBaseService.postForPromise('/user/self/update_dormitory', param);
    }

    var updateDepartment = function (department) {
      var param = {
        department: department,
      }
      return httpBaseService.postForPromise('/user/self/update_department', param);
    }

    var updateHometown = function (hometown) {
      var param = {
        hometown: hometown,
      }

      return httpBaseService.postForPromise('/user/self/update_hometown', param);
    }

    var updateNickname = function (nickname) {
      var param = {
        nickname: nickname,
      };

      return httpBaseService.postForPromise('/user/self/update_nickname', param);
    }

    var uploadAvatar = function (nativeUrl) {
      var headers = {
        Connection: "close",
        'x-login-key': userLoginInfoService.getLoginTicket()
      }
      return uploadService.uploadImgFile(nativeUrl, appConfig.API_SVC_URL +
        '/user/self/upload_avatar', headers);

    }

    var uploadIDCardPhoto = function (nativeUrl) {
      var headers = {
        Connection: "close",
        'x-login-key': userLoginInfoService.getLoginTicket()
      }
      return uploadService.uploadImgFile(nativeUrl, appConfig.API_SVC_URL +
        '/user/self/id_card_photo_ex', headers);
    }

    var updateSign = function (sign) {
      var param = {
        sign: sign,
      };
      return httpBaseService.postForPromise('/user/self/update_sign', param);
    }

    var attention = function (userId, remark) {
      if (typeof remark === 'undefined' || remark == null || remark === '') {
        remark = '未填写'
      }

      var param = {
        remark: remark,
      }
      return httpBaseService.postForPromise('/user/attention/{userId}'.replace('{userId}', userId), param);
    }

    var unattention = function (userId) {
      return httpBaseService.postForPromise('/user/unattention/{userId}'.replace('{userId}', userId), null);
    }

    var getAttentionList = function (pageIndex, pageSize) {
      var param = {
        pageIndex: pageIndex,
        pageSize: pageSize,
      }
      var _innerDefer = $q.defer();
      httpBaseService.getForPromise('/user/attention', param).then(function(attentionList) {
        var retList = new Array();
        if( attentionList != null && attentionList.length > 0 ) {
          _innerDefer.resolve();
          var index = 0;

          //先将最近发帖的关注用户插入列表
          for(index = 0; index < attentionList.length; ++ index) {
            if( attentionList[index].recentTaskIdArray != null && attentionList[index].recentTaskIdArray.length > 0 ) {
              retList.push(attentionList[index]);
              attentionList[index] = null;
            }
          }

          for( index = 0; index < attentionList.length; ++ index) {
            if( attentionList[index] != null ) {
              retList.push(attentionList[index]);
            }
          }
        }
        _innerDefer.resolve(retList);

      },function(error) {
        _innerDefer.reject(error);
      });

      return _innerDefer.promise;
    }

    var isAttention = function (userId) {
      return httpBaseService.getForPromise('/user/attention/{userId}'.replace('{userId}', userId), null);
    }

    var getFunsList = function (pageIndex, pageSize) {
      var param = {
        pageIndex: pageIndex,
        pageSize: pageSize,
      }
      return httpBaseService.getForPromise('/user/funs', param);
    }

    var getFriendList = function (pageIndex, pageSize) {
      var param = {
        pageIndex: pageIndex,
        pageSize: pageSize,
      }
      return httpBaseService.getForPromise('/user/friends', param);
    }

    var getVisitorList = function (pageIndex, pageSize) {
      var param = {
        pageIndex: pageIndex,
        pageSize: pageSize,
      }
      return httpBaseService.getForPromise('/user/visitor', param);
    }

    var getOrgList = function () {
      return httpBaseService.getForPromise('/user/orgs', null);
    }

    var getOrgMemberCount = function (orgId) {
      return httpBaseService.getForPromise('/user/org/{orgId}/memberCount'.replace('{orgId}', orgId), null);
    }

    var getTagList = function () {
      return httpBaseService.getForPromise('/user/tag/list', null);
    }

    var firstUpdateUserInfo = function(orgId,gender) {
      var param = {
        orgId:orgId,
        gender:gender,
      }

      return httpBaseService.postForPromise('/user/firstUpdate',param);
    }

    return {
      login: _login,
      loginByTicket: _loginByTicket,
      logout: _logout,
      checkUpdatePackage: _checkUpdatePackage,
      getSelfInfo: _getSelfInfo,
      getUserInfo: _getUserInfo,
      getUserInfoByNickname: getUserInfoByNickname,
      getSelfInfoForPromise: _getSelfInfoForPromise,
      updateGender: updateGender,
      updateOrg: updateOrg,
      updateDepartment: updateDepartment,
      updateDormitory: updateDormitory,
      updateHometown: updateHometown,
      updateNickname: updateNickname,
      uploadAvatar: uploadAvatar,
      uploadIDCardPhoto: uploadIDCardPhoto,
      updateSign: updateSign,
      attention: attention,
      unattention: unattention,
      getAttentionList: getAttentionList,
      isAttention: isAttention,
      getFunsList: getFunsList,
      getFriendList: getFriendList,
      getVisitorList: getVisitorList,
      getOrgList: getOrgList,
      getOrgMemberCount: getOrgMemberCount,
      getTagList: getTagList,
      firstUpdateUserInfo:firstUpdateUserInfo,
      cache: _cache
    };
  }
})();
