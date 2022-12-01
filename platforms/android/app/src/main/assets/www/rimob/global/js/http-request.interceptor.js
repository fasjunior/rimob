angular.module('Rimob').factory('httpRequestInterceptor', ["$rootScope", function ($rootScope) {
    return {
        request: function (config) {

            if ($rootScope.accessAuth && !config.url.includes('security/token')) {
                config.headers['Authorization'] = $rootScope.accessAuth;
                config.headers['sgUF'] = $rootScope.parametroAgente ? $rootScope.parametroAgente.SgUf : $rootScope.SgUf;
            }

            return config;
        }
    };
}]);
