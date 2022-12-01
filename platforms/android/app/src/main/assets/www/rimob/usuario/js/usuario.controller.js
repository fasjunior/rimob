angular.module("Rimob").controller("usuarioCtrl", ["$scope", "$mdDialog", "$rootScope", "$location", "parametroService", "usuarioService", "authService", "areaagenteService", function ($scope, $mdDialog, $rootScope, $location, parametroService, usuarioService, authService, areaagenteService) {

    let accessAuth = {};
    $scope.usuario = {};
    $scope.loadingSenha = false;
    $scope.exibeOpcaoFiltro = false;
    $scope.obterUsuario = function () {
        parametroService.obterParametro().then(function (result) {
            if (result && result.length > 0) {
                $scope.parametro = result[0];
            }
            else {
                $scope.parametro = {};
            }
        });
    };

    areaagenteService.obterAreasAgente().then(function (result) {
        let areas = (result && result.length > 0) ? result : null;
        $scope.exibeOpcaoFiltro = areas[0].SqSetor && areas[0].SqSetor > 0;
    });

    $scope.alterarSenha = function (usuario) {
        $scope.loadingSenha = true;
        if (usuario.novaSenha === usuario.novaSenhaConf) {
            authService.obterToken()
            .then(function (response) {
                let auth = angular.fromJson(response.data);
                accessAuth = auth.token_type + ' ' + auth.access_token;
                return authService.obterSituacaoEmpresa($rootScope.parametroAgente.NuCnpj);
            })
            .then(function (response) {
                let situacaoEmpresa = angular.fromJson(response.data[0]);
                let msg = '';

                if (situacaoEmpresa.FlSistemabloqueado) {
                    msg = 'Unidade Gestora inválida. Não é possível realizar a alteração da senha. Contate o suporte.';
                }
                if (!situacaoEmpresa.FlPossuiacessoaosistema) {
                    msg = 'A Unidade Gestora não possui acesso ao Rimob.';
                }
                if (msg != '') {
                    $scope.loadingSenha = false;
                    $mdDialog.show(
                          $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Aviso')
                            .textContent(msg)
                            .ariaLabel('Aviso Situação Empresa')
                            .ok('Ok')
                    );
                    return;
                }
                let agente = {
                    NuCnpj: $rootScope.parametroAgente.NuCnpj,
                    NuCpf: $rootScope.parametroAgente.NuCpf,
                    DsSenha: usuario.senhaAtual
                };
                usuarioService.alterarSenhaAgenteImobiliario(agente, usuario.novaSenha).then(function (result) {
                    $scope.senhaForm.$setUntouched();
                    $scope.usuario = {};
                    $scope.loadingSenha = false;
                    $mdDialog.show(
                          $mdDialog.alert()
                         .clickOutsideToClose(true)
                         .title('Aviso')
                         .textContent('Senha alterada com sucesso!')
                         .ariaLabel('Aviso senha')
                         .ok('Ok')
                    ).then(function (answer) {
                        $location.path('/');
                    });
                }, function (error) {
                    $scope.loadingSenha = false;
                });
            });
            
        }
        else {
            $scope.loadingSenha = false;
            $scope.usuario.novaSenha = null;
            $scope.usuario.novaSenhaConf = null;
            $scope.senhaForm.$setUntouched();
            $mdDialog.show(
                  $mdDialog.alert()
                 .clickOutsideToClose(true)
                 .title('Atenção')
                 .textContent('Nova senha não confere com a confirmada! Por favor, digite-as novamente.')
                 .ariaLabel('Aviso senha')
                 .ok('Ok')
            );
        }
    };
   
}]);