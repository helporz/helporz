!function(){"use strict";angular.module("components.widgets.levelProgress",[]).directive("levelProgress",function(){return{restrict:"E",replace:!0,templateUrl:"modules/components/widgets/level-progress/level-progress.html",scope:{hasExp:"=",totalExp:"=",level:"="},link:function(e,l,t){var n=function(){var t=parseInt(e.hasExp/e.totalExp*100),n=""+e.hasExp+"/"+e.totalExp,r=angular.element(l.children()[0]),a=angular.element(r.children()[0]);a.css({width:""+t+"%"});var s=angular.element(a.children()[0]),o=angular.element(s.children()[0]);o.html(""+e.level);var c=r.next();c.html(n)};e.$watch("totalExp",function(){n()})}}})}();