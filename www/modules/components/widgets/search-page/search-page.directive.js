!function(){"use strict";angular.module("components.widgets.searchPage",[]).directive("searchPage",function(){return{restrict:"E",replace:!0,templateUrl:"modules/components/widgets/search-page/search-page.html",scope:{items:"="},link:function(e,i,t){e.ui_items=[],e.$watch("input",function(i){if("undefined"==typeof i||""==i)e.ui_items=e.items;else{e.ui_items=[];for(var t in e.items)e.items[t].name.indexOf(i)!=-1&&e.ui_items.push(e.items[t])}})}}})}();