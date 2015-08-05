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