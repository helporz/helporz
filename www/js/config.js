/**
 * Created by binfeng on 16/3/17.
 */
var appConfig = {
  WECHATAPPID: "wx83baa5a0812afb2c",
  APP_ID: "",
  //API_SVC_URL:"http://api.helporz.com:8080/api",
  //API_SVC_URL:"http://192.168.111.160:8080/api",
  API_SVC_URL: "http://testapi.helporz.com:8080",
  //API_SVC_URL:"http://192.168.0.105:8080/api",
  JPUSH_APPKEY:"049e53804cad513c749bbd1c",
  APP_VERSION: "0.1.0"
};


// 测试flag
var enumTestFlag = {
  NONE: 0,
  USER_PROTO: 1,
  NEAR: 2,
  INFO: 3,
  WALL: 4,
};

var g_TestFlag = enumTestFlag.NONE;

//g_TestFlag = enumTestFlag.NONE;
//g_TestFlag = enumTestFlag.USER_PROTO;
//g_TestFlag = enumTestFlag.NEAR;
//g_TestFlag = enumTestFlag.INFO;
//g_TestFlag = enumTestFlag.WALL;

var g_isDebug = true;

var ho = {
  isValid: function (value) {
    return typeof value !== 'undefined' && value !== null;
  },

  trace: function (obj) {
    return JSON.stringify(obj);
  },

  alert: function (v) {
    if (g_isDebug) {
      alert(v);
    }
  },

  alertObject: function (v) {
    if (g_isDebug) {
      alert(JSON.stringify(v));
    }
  },

  clone: function (obj) {

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
      var copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      var copy = [];
      for (var i = 0, len = obj.length;
      i < len;
      ++i
    )
      {
        copy[i] = this.clone(obj[i]);
      }
      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      var copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
      }
      return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");

  },


};

var appConst = {
  strFail: '稍后再试试 ╮(╯▽╰)╭'
}





