/**
 * Created by binfeng on 16/4/24.
 */
(
  function() {
    'use strict';
    angular.module('com.helporz.utils.service').service('dbService',dbServiceFactoryFn);


    dbServiceFactoryFn.$inject = ['$q','$log'];
    function dbServiceFactoryFn() {
      var dbconn = {};

      var _setDBConn = function (conn){
        dbconn = conn;
      };

      return {
        setDBConn: _setDBConn,
        createRow: function (table, record,pattern) {
          record = record || {};
          //var pattern = patterns[table];
          var row = {};
          for (key in pattern) {
            row[key] = record[key] || pattern[key];
          }
          return row;
        },
        saveRecords: function (table, records,pattern) {
          if (!records || !records.length) {
            return;
          }
          //var pattern = patterns[table];
          var sql = "REPLACE INTO `#table#` (#cols#) VALUES #rows#;".replace('#table#', table);
          var cols = [], rows = [];
          for (key in pattern) {
            cols.push('`' + key + '`');
          }
          for (i in records) {
            var row = [];
            for (key in pattern) {
              var val = (records[i][key] || pattern[key]);
              row.push(val === null ? "null" : "'" + val + "'");
            }
            rows.push("(#row#)".replace("#row#", row.join(',')));
          }
          sql = sql.replace('#cols#', cols.join(',')).replace('#rows#', rows.join(','));

          var _dbDefer = $q.defer();
          dbconn && dbconn.transaction(function (tx) {
            tx.executeSql(sql, [], function (tx, res) {
              _dbDefer.resolve(res);
              //callback && callback(res);
            }, function (e) {
              console.log("ERROR: " + e.message);
              _dbDefer.reject(e);
            });
          });
          //console.log(sql);
          return _dbDefer.promise;
        },
        findRecords: function (table, where) {
          var _dbDefer = $q.defer();
          var sql = "SELECT * FROM `#table#` #where#;".replace('#table#', table).replace('#where#', where || '');
          dbconn && dbconn.transaction(function (tx) {
            tx.executeSql(sql, [], function (tx, res) {
              //callback && callback(res);
              _dbDefer.resolve(res);
            }, function (e) {
              console.log("ERROR: " + e.message);
              _dbDefer.reject(e);
            });
          });
          console.log(sql);
          return _dbDefer.promise;
        },
        dropRecords: function (table, where) {
          var _dbDefer = $q.defer;
          var sql = "DELETE   FROM `#table#` #where#;".replace('#table#', table).replace('#where#', where || '');
          dbconn && dbconn.transaction(function (tx) {
            tx.executeSql(sql, [], function (tx, res) {
              //callback && callback(res);
              _dbDefer.resolve(res);
            }, function (e) {
              console.log("ERROR: " + e.message);
              _dbDefer.reject(e);
            });
          });
          console.log(sql);
          return _dbDefer.promise;
        }
      };
    }
  }
)();
