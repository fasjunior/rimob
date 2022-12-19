angular.module("Rimob").controller("loginCtrl", [
  "$scope",
  "$rootScope",
  "$location",
  "$mdDialog",
  "$timeout",
  "$dbOff",
  "parametroService",
  "exportacaoService",
  "notificacaoService",
  "loginService",
  "authService",
  "appConfig",
  function (
    $scope,
    $rootScope,
    $location,
    $mdDialog,
    $timeout,
    $dbOff,
    parametroService,
    exportacaoService,
    notificacaoService,
    loginService,
    authService,
    appConfig
  ) {
    $scope.mensagem = "";
    let o = this;
    $scope.obterAgenteImobiliario = function (agente) {
      $rootScope.loading = true;
      $rootScope.SgUf = agente.SgUf;
      authService
        .obterToken()
        .then(function (response) {
          let auth = angular.fromJson(response.data);
          $rootScope.accessAuth = auth.token_type + " " + auth.access_token;
          return loginService.obterAgenteImobiliario(
            null,
            agente.NuCpf,
            agente.DsSenha
          );
        })
        .then(function (result) {
          let agentesImob = angular.fromJson(result.data);
          if (agentesImob.length > 1) {
            $rootScope.unidadesGestora = agentesImob;
            o.setAgente(agentesImob[0]);
            $location.path("/login/unidadegestora");
          } else if (agentesImob.length > 0) {
            o.login(agentesImob[0]);
          } else {
            $rootScope.loading = false;
            $rootScope.parametroAgente = null;
            $mdDialog.show(
              $mdDialog
                .alert()
                .clickOutsideToClose(true)
                .title("Aviso")
                .textContent("Dados inválidos!")
                .ariaLabel("Aviso Login")
                .ok("Ok")
            );
          }
        });
    };

    $scope.logoutAgente = function () {
      let confirm = $mdDialog
        .confirm()
        .title("Deseja finalizar sua sessão no Rimob?")
        .textContent(
          "O Rimob removerá todos os dados e depois será reinicializado."
        )
        .ariaLabel("Logout")
        .ok("Sim")
        .cancel("Não");

      $mdDialog.show(confirm).then(function () {
        $rootScope.loading = true;
        $rootScope.unidadesGestora = null;
        $timeout(function () {
          $dbOff.dropAllTables().then(function () {
            $rootScope.parametroAgente = null;
            $rootScope.exibePainel = false;
            $location.path("/login").replace();
          });
        }, 1500);
      });
    };

    $scope.controlSideBarMenu = function (option) {
      let route = $location.path();
      if (
        !route.includes("/imovel/bairros/logradouros/imoveis/") &&
        route != "/login"
      ) {
        $("#body").removeClass();
        if (option == 0) {
          $("#body").addClass("skin-purple-light sidebar-mini ng-scope");
        } else {
          $("#body").addClass(
            "skin-purple-light sidebar-mini ng-scope sidebar-open"
          );
        }
      }
    };

    $scope.selecionaUnidadeGestora = function (unidadeGestora) {
      $rootScope.loading = true;
      $rootScope.parametroAgente = unidadeGestora;
      o.login(unidadeGestora);
    };

    this.adicionaMensagemInicial = function () {
      let data = new Date().toLocaleDateString("pt-BR");
      let msg =
        "Bem-vindo ao Rimob! Antes de começar a utilizar o Rimob é necessário importar os dados. A opção está disponível na tela principal do Rimob.";
      let notificacaoInicial = {
        TpNotificacao: 3,
        SqNotificacao: 1,
        DsTitulo: "Equipe Rimob",
        DsConteudo: msg,
        DtNotificacao: data,
        FlLida: 0,
      };
      notificacaoService.inserirNotificacao(notificacaoInicial);
    };

    this.setAgente = function (agente) {
      $rootScope.parametroAgente = {
        NmAgenteimobiliario: agente.NmAgenteimobiliario,
        NmUnidgestora: "",
      };
    };

    this.login = function (agente) {
      authService.obterSituacaoEmpresa(agente.NuCnpj).then(function (response) {
        let situacaoEmpresa = angular.fromJson(response.data[0]);
        let msg = "";

        if (situacaoEmpresa.FlSistemabloqueado) {
          msg =
            "Unidade Gestora inválida. Não é possível entrar no Rimob. Contate o suporte.";
        }
        if (!situacaoEmpresa.FlPossuiacessoaosistema) {
          msg = "A Unidade Gestora não possui acesso ao Rimob.";
        }
        if (msg != "") {
          $rootScope.loading = false;
          $mdDialog.show(
            $mdDialog
              .alert()
              .clickOutsideToClose(true)
              .title("Aviso")
              .textContent(msg)
              .ariaLabel("Aviso Situação Empresa")
              .ok("Ok")
          );
          return;
        }
        agente.SgUf = $rootScope.SgUf;
        $rootScope.unidadesGestora = null;
        $rootScope.parametroAgente = agente;
        o.adicionaMensagemInicial();
        $dbOff
          .createDataBase()
          .then(function () {
            agente.RelImoveis = 1;
            return parametroService.inserirParametro(agente);
          })
          .then(function () {
            return $dbOff.insert("Db_Version", [{ id: appConfig.dbVersion }]);
          })
          .then(function () {
            $location.path("/");
          });
      });
    };
  },
]);
