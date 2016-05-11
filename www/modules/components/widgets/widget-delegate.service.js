/**
 * Created by Midstream on 16/5/12.
 */

(function () {

  'use strict'

  angular.module('components.widgets', [])

    .factory('widgetDelegate', widgetDelegate)

  function widgetDelegate() {

    var widgetTable = {};

    return {
      register: register,
      unregister: unregister,
      getWidget: getWidget,
      getWidgetStatic: getWidgetStatic
    }

    function register(typeName, id, w) {
      var tbl = null;
      if(widgetTable[typeName]){
        tbl = widgetTable[typeName];
      }
      else{
        tbl = widgetTable[typeName]= {};
      }
      if(tbl[id] == undefined){
        tbl[id] = {
          objects: [],
          static: {}    //用来存放不随控件destroy而删除的变量
        }
      }
      tbl[id].objects.push(w);
    }

    //删除object本身,而不是id,因为同一个id在某个页面删除,加载时会出现多个object
    function unregister(typeName, id, w){
      if(widgetTable[typeName] !== undefined){

        var arr = widgetTable[typeName][id].objects;
        for(var i in arr){
          if(arr[i] == w){
            arr.splice(i, 1);
          }
        }
      }
    }

    function getWidget(typeName, id) {
      if(widgetTable[typeName] !== undefined){
        return widgetTable[typeName][id].objects[0];
      }
      return null;
    }

    function getWidgetStatic(typeName, id){
      if(widgetTable[typeName] !== undefined){
        return widgetTable[typeName][id].static;
      }
      return null;
    }

  }
})();
