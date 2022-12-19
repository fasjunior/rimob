angular.module("Rimob", [
  "ngRoute",
  "ngAnimate",
  "ngMaterial",
  "ngDbOff",
  "Tauro",
  "ngMdIcons",
  "angular.panels",
  "swipe",
  "ngMessages",
  "angularUtils.directives.dirPagination",
  "infinite-scroll",
]);

var rimobApp = angular.module("Rimob");

rimobApp.config([
  "$qProvider",
  "$httpProvider",
  "$mdDateLocaleProvider",
  "panelsProvider",
  function ($qProvider, $httpProvider, $mdDateLocaleProvider, panelsProvider) {
    //Desabilita os erros gerados quando uma promessa rejeitada não é tratada
    $qProvider.errorOnUnhandledRejections(false);

    $httpProvider.interceptors.push("errorInterceptor");
    $httpProvider.interceptors.push("loadingInterceptor");
    $httpProvider.interceptors.push("httpRequestInterceptor");

    //Configura formato do md-datepicker
    $mdDateLocaleProvider.shortMonths = [
      "Jan",
      "Fev",
      "Mar",
      "Abril",
      "Maio",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
    $mdDateLocaleProvider.Months = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    $mdDateLocaleProvider.days = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sabado",
    ];
    $mdDateLocaleProvider.shortDays = ["D", "S", "T", "Q", "Q", "S", "S"];
    moment.locale("pt-BR");

    $mdDateLocaleProvider.formatDate = function (date) {
      let m = moment(date);
      return m.isValid() ? m.format("L") : "";
    };

    $mdDateLocaleProvider.parseDate = function (dateString) {
      let m = moment(dateString, "L", true);
      return m.isValid() ? m.toDate() : new Date(NaN);
    };

    panelsProvider
      .add({
        id: "panelNovoContrib",
        position: "bottom",
        size: "100%",
        templateUrl: "rimob/contribuinte/views/novoContribuinte.html",
        controller: "panelCtrl",
        closeCallbackFunction: "panelClose",
        trapFocus: false,
      })
      .add({
        id: "panelPesquisaContrib",
        position: "bottom",
        size: "100%",
        templateUrl: "rimob/contribuinte/views/pesquisaContribuinte.html",
        controller: "panelCtrl",
        closeCallbackFunction: "panelClose",
      })
      .add({
        id: "panelNovaAreaImovel",
        position: "bottom",
        size: "100%",
        templateUrl: "rimob/areaimovel/views/areaImovel.html",
        controller: "panelCtrl",
        closeCallbackFunction: "panelClose",
        trapFocus: false,
      });
  },
]);

rimobApp.constant("appConfig", {
  apiUrl: "http://api.3tecnos.com.br/", // 'http://10.0.0.154:5074/', //
  baseUrl: "/",
  dataBase: "Rimob.db",
  dados: "lib/ngDbOff/dboff.data.json",
  version: "1.3.2",
  dbVersion: 3, //Controla a atualização do banco do Rimob. Se necessário a atualização,
  //incrementar essa variável e incluir os scripts no arquivo scripts.sql.json (Lembrar de incluir a query de atualizar o id na tabela Db_Version).
  credential: {
    user: "Rimob",
    password: "XLkVnion5n73xWW2MSIR0WbHePnAIfCSGKBCJVXIDW0=",
    sqSistema: 25,
  },
  urlService: {
    tributos: {
      bairro: "bairro",
      logradourocombairro: "logradouro-com-bairro",
      tipoimovel: "tipoimovel",
      agenteimobiliario: "agenteimobiliario",
      distrito: "distrito",
      imovelporagente: "imovel-por-agente",
      imovelrecadastramento: "imovelrecadastramento",
      imovelrecadastramentotemp: "imovelrecadastramentotemp",
      contribuinte: "contribuinte",
      contribuinterecadastramento: "contribuinterecadastramento",
      contribuinterecadastramentotemp: "contribuinterecadastramentotemp",
      tipofator: "tipofator",
      fator: "fator",
      tipofatorimovel: "tipofatorimovel",
      fatorimovelporagente: "fatorimovel-por-agente",
      fatorimovelrecadastramento: "fatorimovelrecadastramento",
      fatorimovelrecadastramentotemp: "fatorimovelrecadastramentotemp",
      areaimovelporagente: "areaimovel-por-agente",
      areaimovelrecadastramento: "areaimovelrecadastramento",
      areaimovelrecadastramentotemp: "areaimovelrecadastramentotemp",
      setormunicipio: "setormunicipio",
      quadrasetor: "quadrasetor",
      areaagente: "areaagente",
      fotoimovel: "fotoimovel",
      exportacaorecadastramento: "exportacaorecadastramento",
      condominios: "condominios",
      secoes: "secoes",
      loteamentos: "loteamentos",
      faces: "faces",
      cartorios: "cartorios",
      entrevistadorecadastramentotemp: "entrevistadorecadastramentotemp",
      entrevistadorecadastramento_max_codigo:
        "entrevistadorecadastramento/max-codigo-por-agente/",
      imovelrecadastramento_max_codigo:
        "imovelrecadastramento/max-codigo-por-agente/",
      contribuinterecadastramento_max_codigo:
        "contribuinterecadastramento/max-codigo-por-agente/",
    },
    dominus: {
      token: "security/token",
      situacaoempresa: "situacao-empresa",
    },
  },
});

rimobApp.run([
  "$rootScope",
  "$dbOff",
  "$location",
  "$q",
  "$mdSidenav",
  "parametroService",
  "exportacaoService",
  "notificacaoService",
  "importacaoService",
  "errorInterceptorService",
  "appConfig",
  function (
    $rootScope,
    $dbOff,
    $location,
    $q,
    $mdSidenav,
    parametroService,
    exportacaoService,
    notificacaoService,
    importacaoService,
    errorInterceptorService,
    appConfig
  ) {
    //Deixa o conteúdo do index.html visível. A tela inicial não será exibida quando não houver usuário logado, apenas a tela de login.
    $("#mainContainer").css("visibility", "visible");

    $rootScope.version = appConfig.version;

    //Inicia o modelo de dados definido no arquivo json
    //$dbOff.getDataBaseModel();
    //Evento disparado após os loads dos 'ng-includes'
    $rootScope.exibePainel = false;
    $rootScope.$on("$includeContentLoaded", function (event, templateName) {
      //Após incluir o template SidebarMenu.html irá executar a função que atribue os 'onclick' Jquery dinamicamente ao menu
      if (templateName.indexOf("SidebarMenu") >= 0) {
        // initSidebar();
      }
    });

    $rootScope.$on("responseErrorInterceptor", function (event, args) {
      console.log("responseErrorInterceptor", args);
      errorInterceptorService.showErrorMessage(args.exceptionMessage);
    });

    $rootScope.$on("$routeChangeStart", function (evt, next, current) {
      $mdSidenav("right").close();
      let o = this;
      $rootScope.loading = false;
      let nextRoute = next.$$route.originalPath;
      let route = $location.path();
      if (route == "/login") {
        $rootScope.slideRight = false;
        $("#body").removeClass();
        $("#body").addClass("skin-purple-light sidebar-collapse ng-scope");
        o.changeStatusBarBgColor("#999999");
      } else {
        o.changeStatusBarBgColor("#605ca8");
        $rootScope.slideRight = true;
        $dbOff
          .getDBModel()
          .then(function () {
            return o.checkParametro(nextRoute);
          })
          .then(function () {
            if (
              route != "/login/unidadegestora" &&
              $rootScope.parametroAgente != null
            )
              return $dbOff.checkDB();
            else return null;
          })
          .then(function () {
            return o.checkExportacao();
          })
          .then(function () {
            return o.checkImportacao();
          })
          .then(function () {
            return o.checkNotificacoes();
          })
          .then(function () {});
      }
      if (nextRoute == "/login/unidadegestora" && !$rootScope.unidadesGestora) {
        $location.path("/login");
      }
    });

    this.changeStatusBarBgColor = function (color) {
      document.addEventListener(
        "deviceready",
        function () {
          navigator.splashscreen.hide();
          StatusBar.backgroundColorByHexString(color);
        },
        false
      );
    };

    //Verifica se há notificações
    this.checkNotificacoes = function () {
      let deferred = $q.defer();
      notificacaoService.obterNotificacoes().then(function (result) {
        $rootScope.mensagens = [];
        $rootScope.alertas = [];
        $rootScope.qtMensagensNaoLidas = null;
        $rootScope.qtMensagens = 0;
        $rootScope.qtAlertasNaoLidos = null;
        $rootScope.qtAlertas = 0;
        if (result) {
          result.filter(function (notificacao) {
            if (notificacao.TpNotificacao == 3) {
              $rootScope.mensagens.push(notificacao);
              $rootScope.qtMensagens = $rootScope.qtMensagens + 1;
              if (notificacao.FlLida == 0) {
                $rootScope.qtMensagensNaoLidas =
                  $rootScope.qtMensagensNaoLidas + 1;
              }
            }
            if (
              notificacao.TpNotificacao == 1 ||
              notificacao.TpNotificacao == 2
            ) {
              $rootScope.alertas.push(notificacao);
              $rootScope.qtAlertas = $rootScope.qtAlertas + 1;
              if (notificacao.FlLida == 0) {
                $rootScope.qtAlertasNaoLidos = $rootScope.qtAlertasNaoLidos + 1;
              }
            }
          });
        }
        deferred.resolve();
      });

      return deferred.promise;
    };

    //Verifica se houve erro na exportação e depois gera o alerta
    this.checkExportacao = function () {
      let deferred = $q.defer();
      exportacaoService
        .obterExportacoesNaoRealizadas()
        .then(function (tabelas) {
          //$rootScope.tabelasNaoExportadas = tabelas;
          if (tabelas.length > 0) {
            notificacaoService
              .obterNotificacao(1, 2)
              .then(function (notificacoes) {
                if (notificacoes == undefined || notificacoes.length == 0) {
                  let msg = " tabelas não foram exportadas";
                  if (tabelas.length == 1) {
                    msg = " tabela não foi exportada";
                  }
                  msg = tabelas.length + msg;
                  let data = new Date().toLocaleDateString("pt-BR");
                  //TpNotificacao = 1 - Alerta, 2 - Aviso, 3 - Mensagem
                  let notificacao = {
                    TpNotificacao: 1,
                    SqNotificacao: 2,
                    DsTitulo: "Exportação",
                    DsConteudo: msg,
                    DtNotificacao: data,
                    FlLida: 0,
                  };
                  notificacaoService.inserirNotificacao(notificacao);
                }

                deferred.resolve();
              });
          } else {
            deferred.resolve();
          }
        });
      return deferred.promise;
    };

    //Verifica se houve erro na importação e depois gera o alerta
    this.checkImportacao = function () {
      let deferred = $q.defer();
      importacaoService
        .obterImportacoesNaoRealizadas()
        .then(function (tabelas) {
          $rootScope.tabelasNaoImportadas = tabelas;
          if (tabelas.length > 0) {
            notificacaoService
              .obterNotificacao(1, 1)
              .then(function (notificacoes) {
                if (notificacoes == undefined || notificacoes.length == 0) {
                  let msg = " tabelas não foram importadas";
                  if (tabelas.length == 1) {
                    msg = " tabela não foi importada";
                  }
                  msg = tabelas.length + msg;
                  let data = new Date().toLocaleDateString("pt-BR");
                  let notificacao = {
                    TpNotificacao: 1,
                    SqNotificacao: 1,
                    DsTitulo: "Importação",
                    DsConteudo: msg,
                    DtNotificacao: data,
                    FlLida: 0,
                  };
                  notificacaoService.inserirNotificacao(notificacao);
                }
                deferred.resolve();
              });
          } else {
            deferred.resolve();
          }
        });
      return deferred.promise;
    };

    //Função que oculta o menu lateral e verifica se existe Agente logado no app
    this.checkParametro = function (nextRoute) {
      let deferred = $q.defer();
      let route = $location.path();

      console.log("$rootScope.parametroAgente", $rootScope.parametroAgente);

      //Oculta o sidebar-menu, quando necessário
      let cssMenu = "skin-purple-light sidebar-mini ng-scope";
      if ($("#body").hasClass("sidebar-collapse")) {
        cssMenu += " sidebar-collapse";
      }
      $("#body").removeClass();
      if ($rootScope.unidadesGestora) {
        $("#body").addClass(cssMenu);
        $rootScope.exibePainel = true;
        if (nextRoute != "/login/unidadegestora") {
          $location.path("/login/unidadegestora");
        }
        deferred.resolve();
      } else if ($rootScope.parametroAgente) {
        $("#body").addClass(cssMenu);
        $rootScope.exibePainel = true;
        if (nextRoute == "/login") {
          $location.path("/");
        }
        deferred.resolve();
        //return $rootScope.parametroAgente;
      } else {
        parametroService
          .obterParametro()
          .then(
            function (result) {
              if (result.length > 0) {
                $rootScope.parametroAgente = result[0];

                //Oculta o sidebar-menu, quando necessário
                $("#body").addClass(cssMenu);
                $rootScope.exibePainel = true;
                if (nextRoute == "/login") {
                  $location.path("/");
                }
                //return $rootScope.parametroAgente;
              } else {
                //Remove o sidebar-menu
                $("#body").addClass(
                  "skin-purple-light sidebar-collapse ng-scope"
                );
                $rootScope.parametroAgente = null;
                $location.path("/login");
              }
              deferred.resolve();
              return new Array($rootScope.parametroAgente);
            },
            function (erro) {
              return $dbOff.executeQuery(
                "select SqAgenteimobiliario, NmAgenteimobiliario, NuCpf, NuCnpj, NmUnidgestora, CdMunicipio, DsFormulanumpublico, SqImovelrecadastramentomax, SgUf from Parametro;"
              );
            }
          )
          .then(
            function (result) {
              if (result && result[0]) {
                $rootScope.parametroAgente = result[0];
                //Oculta o sidebar-menu, quando necessário
                $("#body").addClass(cssMenu);
                $rootScope.exibePainel = true;
                if (nextRoute == "/login") {
                  $location.path("/");
                }
              } else {
                //Remove o sidebar-menu
                $("#body").addClass(
                  "skin-purple-light sidebar-collapse ng-scope"
                );
                $rootScope.parametroAgente = null;
                $location.path("/login");
              }
              deferred.resolve();
            },
            function (erro) {
              //Remove o sidebar-menu
              $("#body").addClass(
                "skin-purple-light sidebar-collapse ng-scope"
              );
              $rootScope.parametroAgente = null;
              $location.path("/login");
            }
          );
      }
      return deferred.promise;
    };
  },
]);
