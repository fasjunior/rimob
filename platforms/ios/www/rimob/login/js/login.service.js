angular.module("Rimob")
    .service("loginService", ["$http", "appConfig", function ($http, appConfig) {
        this.obterAgenteImobiliario = function (NuCnpj, NuCpf, DsSenha) {
            return $http.get(appConfig.apiUrl + 'tributos/' + appConfig.urlService.tributos.agenteimobiliario,
                { params: { nuCnpj: NuCnpj, nuCpf: NuCpf, dsSenha: DsSenha }});
        };

    }]);