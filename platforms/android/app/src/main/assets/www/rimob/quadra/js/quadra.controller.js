angular.module("Rimob")
    .controller("quadraCtrl", ["$scope", "$routeParams", "setorService", "quadraService", function ($scope, $routeParams, setorService, quadraService) {
        $scope.quadras = [];
        $scope.setor = {};
        $scope.obterQuadras = function (dsBusca) {
            return quadraService.obterQuadrasPorSetorDoAgenteQtImoveis(dsBusca, $routeParams.SqSetor);
        };

        setorService.obterSetor($routeParams.SqSetor).then(function (result) {
            $scope.setor = result[0];
        });
    }]);