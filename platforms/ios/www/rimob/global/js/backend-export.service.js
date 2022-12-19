angular.module('Rimob').service("backendExportService", ["$http", "$rootScope", "appConfig", function ($http, $rootScope, appConfig) {

    this.incluirContribuinte = function (contribuintes) {
        return $http.post(appConfig.apiUrl + 'tributos/' +
                    appConfig.urlService.tributos.contribuinterecadastramento, contribuintes);
    };

    this.incluirContribuinteTemp = function (contribuintes) {
        return $http.post(appConfig.apiUrl + 'tributos/' +
                    appConfig.urlService.tributos.contribuinterecadastramentotemp, contribuintes);
    };

    this.excluirContribuinteTemp = function () {
        return $http.delete(appConfig.apiUrl + 'tributos/' + $rootScope.parametroAgente.NuCnpj + '/' +
                    appConfig.urlService.tributos.contribuinterecadastramentotemp + '/' + $rootScope.parametroAgente.SqAgenteimobiliario);
    };

    this.incluirImovel = function (imoveis) {
        return $http.post(appConfig.apiUrl + 'tributos/' +
                    appConfig.urlService.tributos.imovelrecadastramento, imoveis);
    };

    this.incluirImovelTemp = function (imoveis) {
        return $http.post(appConfig.apiUrl + 'tributos/' +
                    appConfig.urlService.tributos.imovelrecadastramentotemp, imoveis);
    };

    this.excluirImovelTemp = function () {
        return $http.delete(appConfig.apiUrl + 'tributos/' + $rootScope.parametroAgente.NuCnpj + '/' +
                    appConfig.urlService.tributos.imovelrecadastramentotemp + '/' + $rootScope.parametroAgente.SqAgenteimobiliario);
    };

    this.incluirFatorImovel = function (fatores) {
        return $http.post(appConfig.apiUrl + 'tributos/' +
                    appConfig.urlService.tributos.fatorimovelrecadastramento, fatores);
    };

    this.incluirFatorImovelTemp = function (fatores) {
        return $http.post(appConfig.apiUrl + 'tributos/' +
                    appConfig.urlService.tributos.fatorimovelrecadastramentotemp, fatores);
    };

    this.incluirAreaImovel = function (areas) {
        return $http.post(appConfig.apiUrl + 'tributos/' +
                    appConfig.urlService.tributos.areaimovelrecadastramento, areas, {
                        headers: { 'Authorization': auth, 'sgUF': $rootScope.parametroAgente.SgUf }
                    });
    };

    this.incluirAreaImovelTemp = function (areas) {
        return $http.post(appConfig.apiUrl + 'tributos/' +
                    appConfig.urlService.tributos.areaimovelrecadastramentotemp, areas);
    };

    this.obterImovelRecadastramento = function () {
        return $http.get(appConfig.apiUrl + 'tributos/' +
            $rootScope.parametroAgente.NuCnpj + '/' + appConfig.urlService.tributos.imovelrecadastramento);
    };

    this.obterContribuinteRecadastramento = function () {
        return $http.get(appConfig.apiUrl + 'tributos/' +
            $rootScope.parametroAgente.NuCnpj + '/' + appConfig.urlService.tributos.contribuinterecadastramento);
    };

    this.incluirFotoImovel = function (fotos) {
        return $http.post(appConfig.apiUrl + 'tributos/' + $rootScope.parametroAgente.NuCnpj + '/' +
                    appConfig.urlService.tributos.fotoimovel, fotos);
    };

    this.exportarDados = function () {
        return $http.post(appConfig.apiUrl + 'tributos/' + $rootScope.parametroAgente.NuCnpj + '/' +
                    appConfig.urlService.tributos.exportacaorecadastramento + '/' + $rootScope.parametroAgente.SqAgenteimobiliario, null);
    };

    this.incluirEntrevistadoTemp = function (entrevistados) {
        return $http.post(appConfig.apiUrl + 'tributos/' +
                    appConfig.urlService.tributos.entrevistadorecadastramentotemp, entrevistados);
    };

    this.obterMaxCodEntrevistadoRecadastramento = function () {
        return $http.get(appConfig.apiUrl + 'tributos/' +
            $rootScope.parametroAgente.NuCnpj + '/' + appConfig.urlService.tributos.entrevistadorecadastramento_max_codigo +
            $rootScope.parametroAgente.SqAgenteimobiliario);
    };

    this.obterMaxCodImovelRecadastramento = function () {
        return $http.get(appConfig.apiUrl + 'tributos/' +
            $rootScope.parametroAgente.NuCnpj + '/' + appConfig.urlService.tributos.imovelrecadastramento_max_codigo +
            $rootScope.parametroAgente.SqAgenteimobiliario);
    };

    this.obterMaxCodContribuinteRecadastramento = function () {
        return $http.get(appConfig.apiUrl + 'tributos/' +
            $rootScope.parametroAgente.NuCnpj + '/' + appConfig.urlService.tributos.contribuinterecadastramento_max_codigo +
            $rootScope.parametroAgente.SqAgenteimobiliario);
    };
}]);