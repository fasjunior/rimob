angular.module('Rimob').factory("loadingInterceptor", ["$q", "$rootScope", "$timeout", function ($q, $rootScope, $timeout) {
    return {
        request: function (config) {
           //if ($rootScope.loadingDisabled) {
           //    $rootScope.loading = false;
           //}  
           //else {
           //    $rootScope.loading = true;
           //}
   
            return config;
        },
        requestError: function (rejection) {
            $rootScope.loading = false;
            return $q.reject(rejection);
        },
        response: function (response) {
           // $rootScope.loading = false;
            return response;
        },
        responseError: function (rejection) {
            $rootScope.loading = false;
            return $q.reject(rejection);
        }
    };
}]);