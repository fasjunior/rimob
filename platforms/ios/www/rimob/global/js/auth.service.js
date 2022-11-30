angular.module('Rimob').service("authService", ["$http", "$rootScope", "appConfig", function ($http, $rootScope, appConfig) {
    this.obterToken = function () {
        return $http({
            method: 'POST',
            url: appConfig.apiUrl + appConfig.urlService.dominus.token,
            processData: false,
            contentType: 'application/x-www-form-urlencoded',
            data: "grant_type=password&username=" + appConfig.credential.user +
                   "&password=" + appConfig.credential.password + '&sq_sistema=' + appConfig.credential.sqSistema,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    };

    this.obterSituacaoEmpresa = function (nuCnpj) {
        let data = new Date();
        let ano = data.getFullYear();
        return $http.get(appConfig.apiUrl + 'dominus/sistema/' + appConfig.credential.sqSistema + '/' +
            appConfig.urlService.dominus.situacaoempresa + '/' + nuCnpj + '/' + ano);
    };

}]);