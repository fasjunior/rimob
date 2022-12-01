angular.module('Rimob').controller("showBackEndImportCtrl", ["$scope", "$rootScope", "$mdDialog", "$location", "imovelService", "contribuinteService", "exportacaoService", "defaultService",
                                                    function ($scope, $rootScope, $mdDialog, $location, imovelService, contribuinteService, exportacaoService, defaultService) {

    $scope.progressImoveis = 0;
    $scope.totalImoveis = 0;
    $scope.totalContribuintes = 0;
    $rootScope.novosContribuintes = 0;
    $rootScope.imoveisFinalizados = [];
    $rootScope.imoveisFinalizadosNaoExportados = [];
    imovelService.obterTodosImoveis().then(function (result) {
        if (result && result.length > 0) {
            $scope.imoveis = result;
            $scope.totalImoveis = $scope.imoveis.length;
            $rootScope.imoveisFinalizados = $scope.imoveis.filter(function (imovel) {
                if (imovel.FlModificado) {
                    if (!imovel.FlExportado) {
                        $rootScope.imoveisFinalizadosNaoExportados.push(imovel);
                    }
                    return true;
                }
                else {
                    return false;   
                }
            });
            $scope.progressImoveis = Math.round(($rootScope.imoveisFinalizados.length / $scope.totalImoveis) * 100);
        }
        else {
            $scope.totalImoveis = 0;
            $scope.progressImoveis = 0;
        }
        $scope.progressImoveis = $scope.progressImoveis + "%";
        $(".progress-bar").css("width", $scope.progressImoveis);
    });

    contribuinteService.obterQtContribuintes().then(function (result) {
        $scope.totalContribuintes = (result && result[0]) ? result[0].qtContribuintes : 0;
    });

    contribuinteService.obterQtNovosContribuintes().then(function (result) {
        $rootScope.novosContribuintes = (result && result[0]) ? result[0].qtContribuintes : 0;
    });

    $scope.showBackEndImport = function () {
        if ($rootScope.parametroAgente && !$rootScope.unidadesGestora) {
            let msg = 'O Rimob irá atualizar os dados do seu dispositivo.';
            if ($rootScope.imoveisFinalizadosNaoExportados.length > 0 || $rootScope.novosContribuintes > 0) {
                msg = 'ATENÇÃO! Foram encontradas alterações feitas pelo agente, estas alterações serão perdidas após a importação, caso queira armazená-las envie os dados antes da importação.';
            }
            let confirm = $mdDialog.confirm()
              .title('Deseja iniciar a importação dos dados?')
              .textContent(msg)
              .ariaLabel('Lucky day')
              //.targetEvent(ev)
              .ok('Sim, iniciar agora!')
              .cancel('Não');

            $mdDialog.show(confirm).then(function () {

                $mdDialog.show({
                    controller: dialogImportarDados,
                    templateUrl: 'rimob/global/views/dialog-backend-import.html',
                    parent: angular.element(document.window),
                    //targetEvent: ev,
                    clickOutsideToClose: false
                });
            });
        }

    };

    $scope.showBackEndExport = function () {
        if ($rootScope.parametroAgente) {
            exportacaoService.obterExportacoesNaoRealizadas().then(function (result) {
                if (result.length > 0 || $rootScope.imoveisFinalizadosNaoExportados.length > 0 || $rootScope.novosContribuintes > 0) {
                    let confirm = $mdDialog.confirm()
                     .title('Deseja iniciar a exportação dos dados?')
                     .textContent('O Rimob irá enviar todas as alterações feitas.')
                     .ariaLabel('Aviso Importação')
                     //.targetEvent(ev)
                     .ok('Sim, iniciar agora!')
                     .cancel('Não');

                    $mdDialog.show(confirm).then(function () {

                        $mdDialog.show({
                            controller: dialogImportarDados,
                            templateUrl: 'rimob/global/views/dialog-backend-export.html',
                            parent: angular.element(document.window),
                            //targetEvent: ev,
                            clickOutsideToClose: false
                        });
                    });
                }
                else {
                    $mdDialog.show(
                      $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('Aviso')
                        .textContent('Não existem alterações!')
                        .ariaLabel('Aviso Exportação')
                        .ok('Ok')
                      //  .targetEvent(ev)
                    );
                }
            });
        }
    };

    function dialogImportarDados($scope, $mdDialog, $route) {
        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
            $route.reload();
            //$location.path('/').replace();
        };

        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };
    }
}]);

