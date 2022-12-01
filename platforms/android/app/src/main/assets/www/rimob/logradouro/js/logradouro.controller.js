angular.module("Rimob")
    .controller("logradouroCtrl", ["$scope", "$routeParams", "bairroService", "areaagenteService", "logradouroService", "imovelService", function ($scope, $routeParams, bairroService, areaagenteService, logradouroService, imovelService) {
        $scope.logradouros = [];
        $scope.bairro = {};
        $scope.obterLogradouros = function (dsBusca) {
            return logradouroService.obterLogradouroPorBairroDoAgenteQtImoveis(dsBusca, $routeParams.SqBairro);
        };

        bairroService.obterBairro($routeParams.SqBairro).then(function (result) {
            $scope.bairro = result[0];
        });
    }]);