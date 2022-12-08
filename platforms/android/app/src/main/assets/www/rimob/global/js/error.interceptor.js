angular.module("Rimob").factory("errorInterceptor", [
  "$q",
  "$window",
  "$rootScope",
  function ($q, $window, $rootScope) {
    return {
      responseError: function (error) {
        if (error.status == 500) {
          $rootScope.$broadcast("responseErrorInterceptor", {
            exceptionMessage: error.data.ExceptionMessage,
          });
        } else if (error.status == 403) {
          let errorMsg =
            "Acesso negado ao servidor. Número de requisições excedeu o limite permitido.";
          $rootScope.$broadcast("responseErrorInterceptor", {
            exceptionMessage: errorMsg,
          });
        } else if (error.status == 401) {
          let errorMsg = "Requisição não autorizada.";
          $rootScope.$broadcast("responseErrorInterceptor", {
            exceptionMessage: errorMsg,
          });
        } else if (error.status == 400) {
          $rootScope.$broadcast("responseErrorInterceptor", {
            exceptionMessage: error.data.error_description,
          });
        } else {
          let errorMsg =
            "Não foi possível conectar-se ao servidor. Verifique se está conectado à internet e tente novamente.";
          $rootScope.$broadcast("responseErrorInterceptor", {
            exceptionMessage: error,
          });
        }

        return $q.reject(error);
      },
    };
  },
]);

angular.module("Rimob").service("errorInterceptorService", [
  "$mdDialog",
  function ($mdDialog) {
    this.showErrorMessage = function (errorMessage) {
      $mdDialog.show(
        $mdDialog
          .alert()
          .clickOutsideToClose(false)
          .escapeToClose(false)
          .title("Atenção")
          .textContent(errorMessage)
          .ariaLabel("Falha")
          .ok("  OK  ")
      );
    };
  },
]);
