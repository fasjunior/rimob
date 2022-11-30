angular.module("Rimob")
    .service("usuarioService", ["$http", "$rootScope", "appConfig", function ($http, $rootScope, appConfig) {
        this.alterarSenhaAgenteImobiliario = function (agente, DsNovaSenha) {
            return $http.put(appConfig.apiUrl + 'tributos/' + appConfig.urlService.tributos.agenteimobiliario + '?dsNovaSenha=' + DsNovaSenha, agente);
        };

    }]);