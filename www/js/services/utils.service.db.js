/**
 * Created by binfeng on 16/4/24.
 */
(
  function() {
    'use strict';
    angular.module('com.helporz.utils.service').service('dbService',dbServiceFactoryFn);


    dbServiceFactoryFn.$inject = ['$q','$log','debugHelpService'];
    function dbServiceFactoryFn($q,$log,debugHelpService) {
      var dbconn = {};

      var _setDBConn = function (conn){
        dbconn = conn;
      };

      var _executeSqlList = function(sqlList) {
        var _innerDefer = $q.defer();
        dbconn.sqlBatch(sqlList,function(){
          _innerDefer.resolve();
        },function(tx,error){
          $log.error('Populate table error: ' + error.message);
          _innerDefer.reject(error);
        });
        return _innerDefer.promise;
      };

      var _createRow =  function (table, record,pattern) {
          var key;
          record = record || {};
          //var pattern = patterns[table];
          var row = {};
          for (key in pattern) {
            row[key] = record[key] || pattern[key];
          }
          return row;
        };
      return {
        executeSqlList:_executeSqlList,
        setDBConn: _setDBConn,
        createRow: _createRow,
        saveRecords: function (table, records,pattern) {
          var key = '';
          var i = '';
          if( angular.isArray(records)) {
            if (!records || !records.length) {
              return;
            }
          }
          else {
            var temp = new Array();
            temp.push(records);
            records = temp;
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
            }, function (tx,e) {
              console.log("ERROR: " + e.message);
              _dbDefer.reject(e);
            });
          });
          //console.log(sql);
          return _dbDefer.promise;
        },
        findRecords: function (table, where) {
          var _dbDefer = $q.defer();
          var sql = "SELECT * FROM `#table#` where #where#;".replace('#table#', table).replace('#where#', where || '');
          dbconn && dbconn.transaction(function (tx) {
            tx.executeSql(sql, [], function (tx, res) {
              //callback && callback(res);
              _dbDefer.resolve(res);
            }, function (tx,e) {
              console.log("ERROR: " + e.message);
              console.log("ERROR: " + debugHelpService.writeObj(e));
              _dbDefer.reject(e);
            });
          });
          console.log(sql);
          return _dbDefer.promise;
        },
        findRecordsEx: function (table, where,pattern) {
          var _dbDefer = $q.defer();
          var sql = "SELECT * FROM `#table#` where #where#;".replace('#table#', table).replace('#where#', where || '');
          dbconn && dbconn.transaction(function (tx) {
            tx.executeSql(sql, [], function (tx, res) {
              //callback && callback(res);
              if (typeof res == 'undefined' || res === null) {
                _dbDefer.resolve(new Array());
              }
              else {
                var records = new Array();
                if (res.rows.length) {
                  for (var index = 0; index < res.rows.length; ++index) {
                    var record = _createRow(table, res.rows.item(index),pattern);
                    if (record != null) {
                      records.push(record);
                    }
                  }
                }
                _dbDefer.resolve(records);
              }

            }, function (tx,e) {
              console.log("ERROR: " + e.message);
              _dbDefer.reject(e);
            });
          });
          console.log(sql);
          return _dbDefer.promise;
        },
        dropRecords: function (table, where) {
          var _dbDefer = $q.defer();
          var sql = "DELETE   FROM `#table#` where #where#;".replace('#table#', table).replace('#where#', where || '');
          dbconn && dbconn.transaction(function (tx) {
            tx.executeSql(sql, [], function (tx, res) {
              //callback && callback(res);
              _dbDefer.resolve(res);
            }, function (tx,e) {
              console.log("ERROR: " + e.message);
              _dbDefer.reject(e);
            });
          });
          console.log(sql);
          return _dbDefer.promise;
        },
        getSaveRecordSql:function(table,records,pattern) {
          var key = '';
          var i = '';
          if( angular.isArray(records)) {
            if (!records || !records.length) {
              return;
            }
          }
          else {
            var temp = new Array();
            temp.push(records);
            records = temp;
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
          return sql;
        },
        sqlBath:function(sqlList) {
          var _dbDefer = $q.defer();
          dbconn && dbconn.transaction(function (tx) {
            tx.sqlBath(sqlList,  function (tx, res) {
              _dbDefer.resolve(res);
              //callback && callback(res);
            }, function (tx,e) {
              console.log("ERROR: " + e.message);
              _dbDefer.reject(e);
            });
          });
          //console.log(sql);
          return _dbDefer.promise;
        }
      };
    }
  }
)();
