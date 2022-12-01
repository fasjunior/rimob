angular.module("Rimob").service("loginService", [
  "$http",
  "appConfig",
  function ($http, appConfig) {
    this.obterAgenteImobiliario = function (NuCnpj, NuCpf, DsSenha) {
      return $http.get(
        appConfig.apiUrl +
          "tributos/" +
          appConfig.urlService.tributos.agenteimobiliario,
        { params: { nuCnpj: NuCnpj, nuCpf: NuCpf, dsSenha: DsSenha } }
      );
    };

    this.teste = function () {
      return $http({
        method: "POST",
        url: "https://2b0d-177-125-253-204.sa.ngrok.io/security/token",
        data: "grant_type=password&username=Rimob&password=XLkVnion5n73xWW2MSIR0WbHePnAIfCSGKBCJVXIDW0=&sq_sistema=25",
      });
    };
  },
]);
