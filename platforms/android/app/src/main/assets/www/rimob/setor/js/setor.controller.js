angular.module("Rimob").controller("setorCtrl", ["$scope", "setorService", function ($scope, setorService) {
    $scope.setores = [];
    $scope.obterSetores = function (dsBusca) {
        return setorService.obterSetoresDoAgenteQtImoveis(dsBusca);
    };
}]);