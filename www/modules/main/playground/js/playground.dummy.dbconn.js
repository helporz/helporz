/**
 * Created by binfeng on 16/5/8.
 */
;
(function () {
    'use strict';
    angular.module('com.helporz.playground')
      .factory('dummyDBConnService', dummyDBConnServiceFn)
      .factory('playgroundTestConfigService', playgroundTestConfigServiceFn);

    dummyDBConnServiceFn.$inject = ['$timeout'];
    function dummyDBConnServiceFn($timeout) {
      var _this = {};
      _this.sqlBatch = function (sqlList, onSuccess, onFailed) {
        var res = {};
        $timeout(function () {
          onSuccess(res);
        }, 100);
      }

      _this.transaction = function (onSuccess, onFailed) {
        $timeout(function () {
          onSuccess(_this);
        }, 100);
      }

      _this.executeSql = function (sq, param, onSuccess, onFailed) {
        var res = {
          rows: {
            length: 0,
            item: []
          }
        };
        $timeout(function () {
            onSuccess(res);
          }, 100
        )
      };

      return _this;
    };

    playgroundTestConfigServiceFn.$inject = ['dummyDBConnService', 'dbService'];
    function playgroundTestConfigServiceFn(dummyDBConnService, dbService) {
      var _config = function () {
        dbService.setDBConn(dummyDBConnService);
      };

      return {
        initConfig: _config,
      }

    }
  })();
