angular.module("Rimob").controller("exportacaoCtrl", ["$scope", "exportacaoService", function ($scope, exportacaoService) {
    //$scope.obterDadosExportacao = function () {
        exportacaoService.obterExportacoes().then(function (result) {
            $scope.tabelasExportacao = result;
        });

        $scope.sort = function (keyname) {
            $scope.sortKey = keyname;
            $scope.reverse = !$scope.reverse;
        }
    //};
}]);