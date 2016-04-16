/**
 * Created by Midstream on 16/4/15.
 */

(
  function() {
    'use strict'

    angular.module('app.task.utils.service', [])

      //////////////////////////////////////////////////
      // taskDesc: 任务类型描述
      .constant('taskDesc', [
        {
          'name': '捎带侠',
          'subtype':[
            {
                'name': '捎带餐饮',
                'holder': '路过食堂/快餐店/饮品店的大侠请帮我..',
                'icon': 'qiu-daican-n'
            },
            {
                'name': '超市捎带',
                'holder': '路过超市/小卖铺/便利店的大侠请帮我..',
                'icon': 'qiu-daigou-n'
            },
            {
                'name': '捎带水果',
                'holder': '路过水果摊/水果店的大侠请帮我..',
                'icon': 'qiu-shuiguo-n'
            }
          ]
        },
        {
          'name': '情报侠',
          'subtype':[
            {
              'name': '打听某人',
              'holder': '打听社团成员/心仪的童鞋/偶遇的身影..',
              'icon': 'qiu-dating-n'
            },
            {
              'name': '打听事情',
              'holder': '打听校园事件/生活信息/机构流程等',
              'icon': 'qiu-wenshi-n'
            },
            {
              'name': '寻物启事',
              'holder': '打听丢失的物品、宠物、男女朋友等',
              'icon': 'qiu-xunwu-n'
            },
            {
              'name': '帮忙看看',
              'holder': '询问自习室/球馆等场所空位/赛事等状况',
              'icon': 'qiu-yan-n'
            }
          ]
        },
        {
          'name': '借宝侠',
          'subtype':[
            {
              'name': '借资料书籍',
              'holder': '借书籍课本/笔记资料/借阅证等',
              'icon': 'qiu-shuji-n'
            },
            {
              'name': '借运动用品',
              'holder': '借球类用品/自行车/健身用具等',
              'icon': 'qiu-yundong-n'
            },
            {
              'name': '借生活工具',
              'holder': '借手电起子/医药/生活电器/户外用品等',
              'icon': 'qiu-shenghuo-n'
            },
            {
              'name': '借娱乐物件',
              'holder': '借棋牌桌游/电玩/乐器/聚会道具等',
              'icon': 'qiu-yule-n'
            }
          ]
        }]
      )

      //////////////////////////////////////////////////
      // taskUtils
      .factory('taskUtils', ['taskDesc', function(taskDesc){

        return {
          typeValue: typeValue,
          mainByTypeValue: mainByTypeValue,
          subByTypeValue: subByTypeValue,

          // 获取任务icon路径
          iconByTypeValue: iconByTypeValue,
          // 获取任务类型名称
          nameByTypeValue: nameByTypeValue
        }

        // 类别值=主类值*100 + 分类值
        // 比如 任务值103的主类是1,分类是3
        function typeValue(main, sub){
          return main * 100 + sub;
        }

        function mainByTypeValue(v) {
          return parseInt(v / 100);
        }

        function subByTypeValue(v){
          return parseInt(v % 100);
        }

        // get attr
        function _attrsByTypeValue(v) {
          if(angular.isNumber(v)){
            var main = taskDesc[mainByTypeValue(v)];
            if(main == undefined){
              console.error("task main type invalid typeValue="+v);
              return null;
            }
            var sub = main.subtype[subByTypeValue(v)];
            if(sub == undefined){
              console.error("task sub type invalid typeValue="+v);
            }
            return sub;
          }
        }

        function iconByTypeValue(v) {
          var attrs = _attrsByTypeValue(v);
          if (attrs == null) {
            return '';
          }
          var icon = 'img/task/icon/' + attrs.icon + '@2x.png';
          return icon;
        }

        function nameByTypeValue(v) {
          var attrs = _attrsByTypeValue(v);
          if (attrs == null){
            return '';
          }
          return attrs.name;
        }
      }]);
  }
)()
