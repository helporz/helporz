/**
 * Created by Midstream on 16/4/15.
 */

(function () {
    'use strict'

    angular.module('app.task.utils.service', [])

      //////////////////////////////////////////////////
      // taskDesc: 任务类型描述
      .constant('taskDesc', [
        {
          'name': '捎带侠',
          'subtype': [
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
          'subtype': [
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
          'subtype': [
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
      .factory('taskUtils', ['taskDesc', function (taskDesc) {
//
        //ui 表示任务状态的图标
        var enumTagState_1 = {
          DONE: 0,
          FAILED: 1,
          GOING: 2,
          SUCCESS: 3
        };
        var enumTagState_2 = {
          NONE: -1,
          DONE: 0,
          FAILED: 1,
          GOING: 2,
          SUCCESS: 3
        };
        var enumTagState_3 = {
          NONE: -1,
          DONE: 0,
          FAILED: 1,
          GOING: 2,
          SUCCESS: 3
        };

        return {
          typeValue: typeValue,
          mainByTypeValue: mainByTypeValue,
          subByTypeValue: subByTypeValue,

          // 获取任务icon路径
          iconByTypeValue: iconByTypeValue,
          // 获取任务类型名称
          nameByTypeValue: nameByTypeValue,
          // 根据任务状态,获得ui相关显示信息
          taskStateToUiState: taskStateToUiState
        }

        // 类别值=主类值*100 + 分类值
        // 比如 任务值103的主类是1,分类是3
        function typeValue(main, sub) {
          return main * 100 + sub;
        }

        function mainByTypeValue(v) {
          return parseInt(v / 100);
        }

        function subByTypeValue(v) {
          return parseInt(v % 100);
        }

        // get attr
        function _attrsByTypeValue(v) {
          if (angular.isNumber(v)) {
            var main = taskDesc[mainByTypeValue(v)];
            if (main == undefined) {
              console.error("task main type invalid typeValue=" + v);
              return null;
            }
            var sub = main.subtype[subByTypeValue(v)];
            if (sub == undefined) {
              console.error("task sub type invalid typeValue=" + v);
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
          if (attrs == null) {
            return '';
          }
          return attrs.name;
        }

        function taskStateToUiState(taskItem, state, isPosterOrAccepter) {
          taskItem.ui_stateDesc = "";
          taskItem.ui_textOptPassive = "";
          taskItem.ui_textOptActive = "";

          if (state == 0) { //waiting
            taskItem.ui_tagState1 = enumTagState_1.GOING;
            taskItem.ui_tagState2 = enumTagState_2.NONE;
            taskItem.ui_tagState3 = enumTagState_3.NONE;
            taskItem.ui_tagText1 = "等待援手";
            taskItem.ui_tagText2 = "进行中";
            taskItem.ui_tagText3 = "搞定";
            taskItem.ui_stateDesc = "";
            taskItem.ui_showOptPassive = true;
            taskItem.ui_textOptPassive = "取消求助";
            taskItem.ui_showOptActive = true;
            taskItem.ui_textOptActive = "查看留言";

          } else if (state == 2) { //waiting over time
            taskItem.ui_tagState1 = enumTagState_1.FAILED;
            taskItem.ui_tagState2 = enumTagState_2.NONE;
            taskItem.ui_tagState3 = enumTagState_3.NONE;
            taskItem.ui_tagText1 = "无人接手";
            taskItem.ui_tagText2 = "进行中";
            taskItem.ui_tagText3 = "搞定";
            taskItem.ui_stateDesc = "大侠召唤术失灵了";
            taskItem.ui_showOptPassive = false;
            taskItem.ui_showOptActive = true;
            taskItem.ui_textOptActive = "学习召唤术";
          } else if (state == 4) { //going on
            taskItem.ui_tagState1 = enumTagState_1.DONE;
            taskItem.ui_tagState2 = enumTagState_2.GOING;
            taskItem.ui_tagState3 = enumTagState_3.NONE;
            taskItem.ui_tagText1 = "已接手";
            taskItem.ui_tagText2 = "进行中";
            taskItem.ui_tagText3 = "搞定";
            if(isPosterOrAccepter == true){
              taskItem.ui_stateDesc = "等待对方完成援助";
              taskItem.ui_showOptPassive = false;
              taskItem.ui_showOptActive = false;
            }else {
              taskItem.ui_stateDesc = "";
              taskItem.ui_showOptPassive = true;
              taskItem.ui_textOptPassive = "放弃援助";
              taskItem.ui_showOptActive = true;
              taskItem.ui_textOptActive = "我已完成援助";
            }
          } else if (state == 8) { //going on overtime
            taskItem.ui_tagState1 = enumTagState_1.DONE;
            taskItem.ui_tagState2 = enumTagState_2.FAILED;
            taskItem.ui_tagState3 = enumTagState_3.NONE;
            taskItem.ui_tagText1 = "已接手";
            taskItem.ui_tagText2 = "援助超时";
            taskItem.ui_tagText3 = "已搞定";
            if(isPosterOrAccepter == true){
              taskItem.ui_stateDesc = "这句话低保真没有";
              taskItem.ui_showOptPassive = false;
              taskItem.ui_showOptActive = true;
              taskItem.ui_textOptActive = "这里也没有";
            }else{
              taskItem.ui_stateDesc = "挫折常有,不忘初心";
              taskItem.ui_showOptPassive = false;
              taskItem.ui_showOptActive = true;
              taskItem.ui_textOptActive = "评价留言";
            }
          }
          else if (state == 16) {  //poster cancel

            taskItem.ui_tagState1 = enumTagState_1.SUCCESS;
            taskItem.ui_tagState2 = enumTagState_2.FAILED;
            taskItem.ui_tagState3 = enumTagState_3.NONE;
            taskItem.ui_tagText1 = "已接受";
            taskItem.ui_tagText2 = "任务取消";
            taskItem.ui_tagText3 = "已搞定";
            taskItem.ui_stateDesc = "我取消了";
          }
          else if (state == 32) {  //accepter cancel
            taskItem.ui_tagState1 = enumTagState_1.DONE;
            taskItem.ui_tagState2 = enumTagState_2.FAILED;
            taskItem.ui_tagState3 = enumTagState_3.NONE;
            taskItem.ui_tagText1 = "已接手";
            taskItem.ui_tagText2 = isPosterOrAccepter==true?"对方放弃援助":"放弃援助";
            taskItem.ui_tagText3 = "已搞定";
            if(isPosterOrAccepter == true) {

              taskItem.ui_stateDesc = "某些日子,大侠也失控";
              taskItem.ui_showOptPassive = false;
              taskItem.ui_showOptActive = true;
              taskItem.ui_textOptActive = "评价留言"
            }else{
              taskItem.ui_stateDesc = "勿辜负一份期待";
              taskItem.ui_showOptPassive = false;
              taskItem.ui_showOptActive = true;
              taskItem.ui_textOptActive = "查看评价";
            }
          } else if (state == 64) {  //accepter confirm success
            taskItem.ui_tagState1 = enumTagState_1.DONE;
            taskItem.ui_tagState2 = enumTagState_2.DONE;
            taskItem.ui_tagState3 = enumTagState_3.GOING;
            taskItem.ui_tagText1 = "已接手";
            taskItem.ui_tagText2 = "进行中";
            taskItem.ui_tagText3 = "等待确认";
            if(isPosterOrAccepter == true){
              taskItem.ui_showOptPassive = true;
              taskItem.ui_textOptPassive = "未完成援助";
              taskItem.ui_showOptActive = true;
              taskItem.ui_textOptActive = "确认对方已完成援助";
            }else{
              taskItem.ui_stateDesc = "等待对方确认援助完成";
              taskItem.ui_showOptPassive = false;
              taskItem.ui_showOptActive = false;
            }
          } else if (state == 128) { //poster confirm success
            taskItem.ui_tagState1 = enumTagState_1.DONE;
            taskItem.ui_tagState2 = enumTagState_2.DONE;
            taskItem.ui_tagState3 = enumTagState_3.SUCCESS;
            taskItem.ui_tagText1 = "已接手";
            taskItem.ui_tagText2 = "进行中";
            taskItem.ui_tagText3 = "搞定";
            if(isPosterOrAccepter==true){
              taskItem.ui_stateDesc = "记得按承诺好好感谢对方哦";
              taskItem.ui_showOptPassive = false;
              taskItem.ui_showOptActive = true;
              taskItem.ui_textOptActive = "评价留言";
            }else{
              taskItem.ui_stateDesc = "接受对方的膜拜与致谢";
              taskItem.ui_showOptPassive = false;
              taskItem.ui_showOptActive = true;
              taskItem.ui_textOptActive = "评价留言";

            }
          } else if (state == 256) { //poster confirm failed
            taskItem.ui_tagState1 = enumTagState_1.DONE;
            taskItem.ui_tagState2 = enumTagState_2.DONE;
            taskItem.ui_tagState3 = enumTagState_3.FAILED;
            taskItem.ui_tagText1 = "已接手";
            taskItem.ui_tagText2 = "进行中";
            taskItem.ui_tagText3 = "援助未成功";
            if(isPosterOrAccepter==true){
              taskItem.ui_stateDesc = "常怀感恩,如沐春风";
              taskItem.ui_showOptPassive = false;
              taskItem.ui_showOptActive = true;
              taskItem.ui_textOptActive = "评价留言";
            }else{
              taskItem.ui_stateDesc = "挫折常有,不忘初心";
              taskItem.ui_showOptPassive = false;
              taskItem.ui_showOptActive = true;
              taskItem.ui_textOptActive = "评价留言";
            }
          }
        }
      }]);
  })()
