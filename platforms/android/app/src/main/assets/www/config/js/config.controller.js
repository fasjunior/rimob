angular.module("Rimob").controller("configCtrl", [
  "$rootScope",
  "$scope",
  "$mdSidenav",
  "$dbOff",
  "$timeout",
  function ($rootScope, $scope, $mdSidenav, $dbOff, $timeout) {
    $timeout(function () {
      $scope.openSideNav = function () {
        $mdSidenav("right").toggle();
      };

      $scope.close = function () {
        $mdSidenav("right").close();
      };

      $scope.atualizaRelImoveis = function () {
        $dbOff.update(
          "Parametro",
          (options = {
            set: "RelImoveis = ?",
            parametersSet: [$rootScope.parametroAgente.RelImoveis],
          })
        );
      };
    });
  },
]);
