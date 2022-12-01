angular.module("Rimob").controller("importacaoCtrl", ["$scope", "importacaoService", function ($scope, importacaoService) {
    //$scope.obterDadosExportacao = function () {
    importacaoService.obterImportacoes().then(function (result) {
        $scope.tabelasImportacao = result;
    });

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   
        $scope.reverse = !$scope.reverse; 
    }
    //};
}]);