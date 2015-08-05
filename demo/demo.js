(function() {
    angular.module('demo', ['ht.fbSelect']).controller('DemoController', function($scope) {
        $scope.groups = [
            {id: 1, name: 'Grupa 1'},
            {id: 2, name: 'Grupa 2'},
            {id: 3, name: 'Grupa 3'}
        ];

        $scope.items = [
            {name: 'Kategoria 1', groups: [1]},
            {name: 'Kategoria 2', groups: [2]},
            {name: 'Kategoria 3', groups: [3]},
            {name: 'Kategoria 4', groups: [1,2]},
            {name: 'Kategoria 5', groups: [1,3]},
            {name: 'Kategoria 6', groups: [2,3]},
            {name: 'Kategoria 7', groups: [1,2,3]},
            {name: 'Kategoria 8', groups: [1,2,3]},
            {name: 'Kategoria 9', groups: [1]},
            {name: 'Kategoria 10', groups: [2]},
            {name: 'Kategoria 11', groups: [3]},
            {name: 'Kategoria 12', groups: [1]},
            {name: 'Kategoria 13', groups: [1]},
            {name: 'Kategoria 14', groups: [3]},
            {name: 'Kategoria 15', groups: [2]},
            {name: 'Kategoria 16', groups: [1]}
        ];
    });
})();