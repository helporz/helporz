/**
 * Created by binfeng on 16/3/17.
 */
var appConfig = {
  WECHATAPPID:"wx83baa5a0812afb2c",
  APP_ID:"",
  //API_SVC_URL:"http://api.helporz.com:8080/api",
  //API_SVC_URL:"http://192.168.111.160:8080/api",
  API_SVC_URL:"http://testapi.helporz.com:8080",
  //API_SVC_URL:"http://192.168.0.105:8080/api",
  JPUSH_APPKEY:"eb3ccc662104edc368b17281"
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

var ho = {
  isValid: function(value){
    return typeof value !== 'undefined' && value !== null;
  },

  trace: function(obj) {
    return JSON.stringify(obj);
  }
}





