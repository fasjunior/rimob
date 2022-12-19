angular.module("Rimob").controller("bairroCtrl", ["$scope", "areaagenteService", "bairroService", function ($scope, areaagenteService, bairroService) {
    $scope.bairros = [];
    $scope.obterBairros = function (dsBusca) {
        return bairroService.obterBairrosDoAgenteQtImoveis(dsBusca);
    };

    $scope.obterBairrosInit = function () {
        $scope.obterBairros('').then(function (result) {
            $scope.bairros = result;
        });
    };
    
}]);