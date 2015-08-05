/*!
 * ht-fb-select
 * https://github.com/hightest/angular-fb-select
 * Version: 0.0.1 - 2015-08-05T13:52:34.568Z
 * License: 
 */


(function() {
    function Directive() {
        return {
            restrict: 'E',
            require: {
                ngModel: '?'
            },
            scope: {
                groups: '=',
                items: '=',
                selected: '=ngModel'
            },
            templateUrl: 'ht-fb-select/fb-select.html',
            controller: Controller,
            controllerAs: 'select'
        };
    }

    function Controller($scope) {
        var self = this;
        var items = angular.copy($scope.items);
        self.selectedElements = $scope.selected;

        self.groups = $scope.groups;
        self.selectedGroup = null;

        self.toggleElement = toggleElement;
        self.removeElement = removeElement;
        self.selectGroup = selectGroup;
        self.getElements = getElements;
        self.preventCheck = preventCheck;
        self.selectAll = selectAll;

        function init() {
            angular.forEach(self.selectedElements, function(element) {
                element.selected = true;
            });
        }

        function getElements() {
            if (null !== self.selectedGroup) {
                var result = [];

                angular.forEach(items, function(item) {
                    for (var i = 0; i < item.groups.length; i++) {
                        if (self.selectedGroup.id == item.groups[i]) {
                            this.push(item);
                            break;
                        }
                    }
                }, result);

                return result;
            }

            return items;
        }

        function preventCheck(element) {
            element.selected = !element.selected;
        }

        function selectGroup(group) {
            self.selectedGroup = group;
            refreshSelected();
        }

        function toggleElement(element) {
            element.selected = !element.selected;
            refreshSelected();
        }

        function removeElement(element) {
            element.selected = false;
            refreshSelected();
        }

        function refreshSelected() {
            var elements = [];

            angular.forEach(items, function (item) {
                if (item.selected) {
                    elements.push(item);
                }
            });

            self.selectedElements = elements;
        }

        function selectAll() {
            var elements = getElements();

            var countElements = elements.length;
            var countSelected = 0;
            var state = true;

            for (var i = 0; i < countElements; i++) {
                if (elements[i].selected) ++countSelected;
            }

            if (countSelected >= countElements) state = false;

            angular.forEach(elements, function(item) {
                item.selected = state;
            });

            refreshSelected();
        }

        init();
    }

    angular.module('ht.fbSelect', ['ngMaterial']).directive('htFbSelect', Directive);
})();
angular.module("ht.fbSelect").run(["$templateCache", function($templateCache) {$templateCache.put("ht-fb-select/fb-select.html","<div id=\"user-select\"><div layout=\"row\" style=\"\"><div flex=\"20\" class=\"user-select-left\"><md-list><md-list-item><div ng-class=\"{active: select.selectedGroup == null}\" ng-click=\"select.selectGroup(null)\">Wszyscy</div></md-list-item><md-list-item ng-repeat=\"group in select.groups\"><div ng-class=\"{active: group == select.selectedGroup}\" ng-click=\"select.selectGroup(group)\">{{ group.name }}</div></md-list-item></md-list></div><div flex=\"\" layout=\"column\" class=\"user-select-center\"><div layout=\"row\" layout-align=\"space-between end\"><md-input-container><label>Szukaj</label> <input type=\"text\" ng-model=\"select.search.$\"></md-input-container><div><a href=\"\" ng-click=\"select.selectAll()\">Wybierz wszystkich</a></div></div><md-content style=\"max-height:400px\"><md-list><md-list-item ng-repeat=\"item in select.getElements() | filter:select.search\" ng-click=\"select.toggleElement(item)\"><p>{{ item.name }}</p><md-checkbox aria-label=\"select user\" ng-model=\"item.selected\" ng-change=\"select.preventCheck(item)\"></md-checkbox></md-list-item></md-list></md-content></div><div flex=\"20\" class=\"user-select-right\"><span>Wybrano: {{ select.selectedElements.length }}</span><md-list><md-list-item ng-repeat=\"item in select.selectedElements\" ng-click=\"select.removeElement(item)\"><h5>{{ item.name }} {{ item.surname }}</h5></md-list-item></md-list></div></div></div>");}]);