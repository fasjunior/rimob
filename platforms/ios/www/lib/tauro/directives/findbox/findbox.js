angular.module('Tauro').directive('taFindbox', ["$interval", "$cacheFactory", function ($interval, $cacheFactory) {
    return {
        restrict: 'E',
        templateUrl: "lib/tauro/directives/findbox/templates/findbox.html",
        scope: {
            placeholder: '@placeholder',
            promisefunction: '&',
            targetobject: '='
        },
        controller: function ($scope, $element, $attrs)
        {
            if (!$attrs.placeholder)
            {
                $attrs.placeholder = 'Pesquisar';
            }

            $scope.timer = null;
            $scope.cache = $cacheFactory.get('cacheFindBoxId') || $cacheFactory('cacheFindBoxId');

            $scope.$watch('txtAutoComplete', function () {

            if (angular.isDefined($scope.timer)) {
                $interval.cancel($scope.timer);
            }

            $scope.timer = $interval(function () { $interval.cancel($scope.timer); $scope.getFunction(); }, 400);
            });

            $scope.getFunction = function () {

                let key = angular.isDefined($scope.txtAutoComplete) ? $scope.txtAutoComplete : null;

                //Se o valor for Undefined, implica dizer que ainda não está no cache
                //Sendo assim irá efetuar a consulta no serviço
                //if (!$scope.cache.get(key)) {
                    $scope.promisefunction({ dsBusca: key }).then(function (response) {
                        $scope.targetobject = Array.isArray(response) ? response : response.data;
                        $scope.cache.put(key, $scope.targetobject);
                    });
               // }
              //  else {
              //      $scope.targetobject = $scope.cache.get(key);
              //  }
            };
        }
    };
}]);