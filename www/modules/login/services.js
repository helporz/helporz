/**
 * Created by binfeng on 16/3/4.
 */
angular.module('user').service('userInfo',function() {
  var _db;
  function dateFix (result) {
    var data = [];
    result.forEach(function (each) {
      data.push(each.doc);
    });
    return data
  };

  return {
    initDB: function () {
      _db = new PouchDB('userInfo', {adapter: 'websql'});
    },
    get: function (callback) {
      _db.allDocs({include_docs: true}).then(function (result) {
        callback(dateFix(result.rows));
      })
    },
    add: function (userInfo) {
      _db.post(userInfo);
    },
    remove: function (userInfo) {
      _db.remove(userInfo);
    }
  }
});
