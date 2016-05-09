/**
 * Created by Midstream on 16/4/28.
 */

(function () {

  'use strict'

  angular.module('components.widgets.hoTabSet', [])

    .controller('hoTabSetCtrl', ['$scope', hoTabSetCtrl]);

  function hoTabSetCtrl($scope) {
    var self = this;
    var selectedTab = null;
    var previousSelectedTab = null;
    var selectedTabIndex;
    //var isVisible = true;

    self.tabs = [];

    self.selectedIndex = function () {
      return self.tabs.indexOf(selectedTab);
    };
    self.selectedTab = function () {
      return selectedTab;
    };
    self.add = function (tab) {
      self.tabs.push(tab);
    };

    self.deselect = function (tab) {
      if (tab.$tabSelected) {
        previousSelectedTab = selectedTab;
        selectedTab = selectedTabIndex = null;
        tab.$tabSelected = false;
        (tab.onDeselect || angular.noop)();
        //tab.$broadcast && tab.$broadcast('$ionicHistory.deselect');
      }
    };

    self.select = function (tab, shouldEmitEvent) {
      var tabIndex;
      if (angular.isNumber(tab)) {
        tabIndex = tab;
        if (tabIndex >= self.tabs.length) return;
        tab = self.tabs[tabIndex];
      } else {
        tabIndex = self.tabs.indexOf(tab);
      }

      if (arguments.length === 1) {
        shouldEmitEvent = !!(tab.navViewName || tab.uiSref);
      }

      //if (selectedTab && selectedTab.$historyId == tab.$historyId) {
      //  if (shouldEmitEvent) {
      //    $ionicHistory.goToHistoryRoot(tab.$historyId);
      //  }

      if (selectedTabIndex !== tabIndex) {
        angular.forEach(self.tabs, function (tab) {
          self.deselect(tab);
        });

        selectedTab = tab;
        selectedTabIndex = tabIndex;

        //Use a funny name like $tabSelected so the developer doesn't overwrite the var in a child scope
        tab.$tabSelected = true;
        (tab.onSelect || angular.noop)();

        //if (shouldEmitEvent) {
        //  $scope.$emit('$ionicHistory.change', {
        //    type: 'tab',
        //    tabIndex: tabIndex,
        //    title: tab.title,
        //    url: tab.href,
        //    uiSref: tab.uiSref
        //  });
        //}

        $scope.$broadcast("tabSelected", {selectedTab: tab, selectedTabIndex: tabIndex});
      }
    };
  };

})
()
