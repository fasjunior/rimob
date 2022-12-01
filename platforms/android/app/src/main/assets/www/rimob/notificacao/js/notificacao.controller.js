angular.module("Rimob")
    .controller("notificacaoCtrl", ["$scope", "$rootScope", "notificacaoService", function ($scope, $rootScope, notificacaoService) {

        $scope.atualizaNotificacao = function (tpNotificacao) {
            notificacaoService.atualizarNotificacao(tpNotificacao, 1);
            if(tpNotificacao == 3){
                $rootScope.qtMensagensNaoLidas = null;
            }
            if (tpNotificacao == 1) {
                $rootScope.qtAlertasNaoLidos = null;
            }
        };

}]);