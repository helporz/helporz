/**
 * Created by binfeng on 16/4/6.
 */
;(
  function() {
    'use strict';

    angular.module('com.helporz.user.netservice',['com.helporz.utils.service']).factory('userNetService',['$q','$log','httpBaseService',
      'errorCodeService','httpErrorCodeService',UserNetServiceFactoryFn])

    function UserNetServiceFactoryFn($q,$log,httpBaseService,errorCodeService,httpErrorCodeService) {

      // cache
      var _cache = {
        nearTaskList : [],

        selfInfo: null,

        userInfo: {}
      };

        var _loginByTicket=function(ticket,sign,onSuccessFn,onFailedFn) {
          var data = { ticket:ticket,sign:sign};
          httpBaseService.post("/user/login_by_ticket",data,function(resp,status,headers,config) {
            onSuccessFn(resp.data.ticket,resp.data.isNewUser);
          },function(code,data,status,headers,config) {
            onFailedFn(resp.code);
          },function(data,status,headers,config){

          });
        }

      var _logout = function(ticket,sign,onSuccessFn,onFailedFn)
      {
        var data = { ticket:ticket,sign:sign};
        httpBaseService.post("/user/logout",data,function(resp,status,headers,config) {
          onSuccessFn();
        },function(code,data,status,headers,config) {
          onFailedFn(code);
        },function(data,status,headers,config){

        });
      };

      var _checkUpdatePackage = function(packageVersion,terminalInfo,onSuccessFn,onFailedFn)
      {
        var data = {
          packageVersion:packageVersion,
          terminalInfo:terminalInfo
        };
        httpBaseService.post("/user/check_update_package",data,function(resp,status,headers,config) {
          onSuccessFn(resp.downloadUrl,resp.version,isMustUpdate);
        },function(code,data,status,headers,config) {
          onFailedFn(code);
        },function(data,status,headers,config){

        });

      };

      var _getSelfInfo = function(onSuccessFn,onFailedFn) {
        httpBaseService.get('/user/get_self_info',null,function(resp,status,headers,config) {
          onSuccessFn(resp.data);
        },function(code,data,status,headers,config) {
          onFailedFn(code);
        },function(data,status,headers,config){

        });
      }

      var _getSelfInfoForPromise = function() {
        var getSelfDefer = $q.defer();
        httpBaseService.get('/user/get_self_info',null,function(resp,status,headers,config) {
          getSelfDefer.resolve(resp.data);
          //cache it
          _cache.selfInfo = resp.data;
        },function(code,data,status,headers,config) {
          getSelfDefer.reject(errorCodeService.getErrorCodeDescription(code));
        },function(data,status,headers,config){
          getSelfDefer.reject(httpErrorCodeService.getErrorCodeDescription(status));
        });
        return getSelfDefer.promise;
      };

      var _getUserInfo = function(userId,onSuccessFn,onFailedFn) {
        httpBaseService.get('/user/' + userId + '/get_user_info',null,function(resp,status,headers,config) {
          onSuccessFn(resp.data);
          _cache.userInfo[userId] = resp.data;
        },function(code,data,status,headers,config) {
          onFailedFn(code);
        },function(data,status,headers,config){
        });
      };

      return {
        loginByTicket:_loginByTicket,
        logout:_logout,
        checkUpdatePackage:_checkUpdatePackage,
        getSelfInfo:_getSelfInfo,
        getUserInfo:_getUserInfo,
        getSelfInfoForPromise:_getSelfInfoForPromise,

        cache: _cache
      };
    }
  }
)();
