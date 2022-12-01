(function () {
    var tauro = angular.module('Tauro');

    tauro.directive('taBack', ['$window', function ($window) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.bind('click', function () {
                    $window.history.back();
                });
            }
        };
    }]);

})();