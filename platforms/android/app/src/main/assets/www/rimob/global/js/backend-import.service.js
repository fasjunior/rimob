angular.module('Rimob').service("backendImportService", ["$http", "$rootScope", "appConfig", function ($http, $rootScope, appConfig) {
    this.obterBairro = function () {
        return $http.get(appConfig.apiUrl + 'tributos/' +
            $rootScope.parametroAgente.NuCnpj + '/' + appConfig.urlService.tributos.bairro);
    };

    this.obterLogradouro = function () {
        return $http.get(appConfig.apiUrl + 'tributos/' +
            $rootScope.parametroAgente.NuCnpj + '/' + appConfig.urlService.tributos.logradourocombairro);
    };

    this.obterTipoImovel = function () {
        return $http.get(appConfig.apiUrl + 'tributos/' +
            $rootScope.parametroAgente.NuCnpj + '/' + appConfig.urlService.tributos.tipoimovel);
    };

    this.obterAreaAgente = function () {
        return $http.get(appConfig.apiUrl + 'tributos/' +
            $rootScope.parametroAgente.NuCnpj + '/' + appConfig.urlService.tributos.areaagente,
            { params: { sqAgenteImobiliario: $rootScope.parametroAgente.SqAgenteimobiliario } });
    };

    this.obterDistrito = function () {
        return $http.get(appConfig.apiUrl + 'tributos/' +
            $rootScope.parametroAgente.NuCnpj + '/' + appConfig.urlService.tributos.distrito);
    };

    this.obterImovel = function () {
        return $http.get(appConfig.apiUrl + 'tributos/' +
            $rootScope.parametroAgente.NuCnpj + '/' + appConfig.urlService.tributos.imovelporagente,
            { params: { sqAgenteImobiliario: $rootScope.parametroAgente.SqAgenteimobiliario } });
    };

    this.obterContribuinte = function () {
        return $http.get(appConfig.apiUrl + 'tributos/' +
            $rootScope.parametroAgente.NuCnpj + '/' + appConfig.urlService.tributos.contribuinte);
    };

    this.obterDados = function () {
        return $http.get(appConfig.dados);
    };

    this.obterTipoFator = function () {
        return $http.get(appConfig.apiUrl + 'tributos/' +
            $rootScope.parametroAgente.NuCnpj + '/' + appConfig.urlService.tributos.tipofator);
    };

    this.obterFatorImovel = function () {
        return $http.get(appConfig.apiUrl + 'tributos/' +
            $rootScope.parametroAgente.NuCnpj + '/' + appConfig.urlService.tributos.fatorimovelporagente,
            { params: { sqAgenteImobiliario: $rootScope.parametroAgente.SqAgenteimobiliario } });
    };

    this.obterAreaImovel = function () {
        return $http.get(appConfig.apiUrl + 'tributos/' +
            $rootScope.parametroAgente.NuCnpj + '/' + appConfig.urlService.tributos.areaimovelporagente,
            { params: { sqAgenteImobiliario: $rootScope.parametroAgente.SqAgenteimobiliario } });
    };

    this.obterSetorMunicipio = function () {
        return $http.get(appConfig.apiUrl + 'tributos/' +
            $rootScope.parametroAgente.NuCnpj + '/' + appConfig.urlService.tributos.setormunicipio);
    };

    this.obterQuadraSetor = function () {
        return $http.get(appConfig.apiUrl + 'tributos/' +
            $rootScope.parametroAgente.NuCnpj + '/' + appConfig.urlService.tributos.quadrasetor);
    };

    this.obterCondominio = function () {
        return $http.get(appConfig.apiUrl + 'tributos/' +
            $rootScope.parametroAgente.NuCnpj + '/' + appConfig.urlService.tributos.condominios);
    };

    this.obterSecao = function () {
        return $http.get(appConfig.apiUrl + 'tributos/' +
            $rootScope.parametroAgente.NuCnpj + '/' + appConfig.urlService.tributos.secoes);
    };

    this.obterLoteamento = function () {
        return $http.get(appConfig.apiUrl + 'tributos/' +
            $rootScope.parametroAgente.NuCnpj + '/' + appConfig.urlService.tributos.loteamentos);
    };

    this.obterFace = function () {
        return $http.get(appConfig.apiUrl + 'tributos/' +
            $rootScope.parametroAgente.NuCnpj + '/' + appConfig.urlService.tributos.faces);
    };

    this.obterCartorio = function () {
        return $http.get(appConfig.apiUrl + 'tributos/' +
            $rootScope.parametroAgente.NuCnpj + '/' + appConfig.urlService.tributos.cartorios);
    };

}]);