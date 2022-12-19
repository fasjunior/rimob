rimobApp.config([
  "$routeProvider",
  function ($routeProvider) {
    $routeProvider.when("/", {
      templateUrl: "rimob/global/views/default-content.html",
      controller: "showBackEndImportCtrl",
      resolve: {
        dbModel: function ($dbOff) {
          return $dbOff.getDBModel();
        },
      },
    });

    $routeProvider.when("/imovel/bairros", {
      templateUrl: "rimob/bairro/views/bairro.html",
      controller: "bairroCtrl",
      resolve: {
        dbModel: function ($dbOff) {
          return $dbOff.getDBModel();
        },
      },
    });

    $routeProvider.when("/imovel/bairros/logradouros/:SqBairro", {
      templateUrl: "rimob/logradouro/views/logradouro.html",
      controller: "logradouroCtrl",
      resolve: {
        dbModel: function ($dbOff) {
          return $dbOff.getDBModel();
        },
      },
    });

    $routeProvider.when(
      "/imovel/bairros/logradouros/imoveis/:SqBairro/:SqLogradouro",
      {
        templateUrl: "rimob/imovel/views/imovel.html",
        controller: "imovelCtrl",
        resolve: {
          dbModel: function ($dbOff) {
            return $dbOff.getDBModel();
          },
        },
      }
    );

    $routeProvider.when(
      "/imovel/bairros/logradouros/imoveis/:SqBairro/:SqLogradouro/:SqTipoimovel/:SqImovelrecadastramento",
      {
        templateUrl: "rimob/imovel/views/wizardImovel.html",
        controller: "imovelCtrl",
        resolve: {
          dbModel: function ($dbOff) {
            return $dbOff.getDBModel();
          },
        },
      }
    );

    $routeProvider.when(
      "/imovel/bairros/logradouros/imoveis/:SqBairro/:SqLogradouro/:SqImovelrecadastramento",
      {
        templateUrl: "rimob/imovel/views/tipoImovel.html",
        controller: "imovelCtrl",
        resolve: {
          dbModel: function ($dbOff) {
            return $dbOff.getDBModel();
          },
        },
      }
    );

    $routeProvider.when("/exportacao", {
      templateUrl: "rimob/exportacao/views/exportacao.html",
      controller: "exportacaoCtrl",
      resolve: {
        dbModel: function ($dbOff) {
          return $dbOff.getDBModel();
        },
      },
    });

    $routeProvider.when("/importacao", {
      templateUrl: "rimob/importacao/views/importacao.html",
      controller: "importacaoCtrl",
      resolve: {
        dbModel: function ($dbOff) {
          return $dbOff.getDBModel();
        },
      },
    });

    $routeProvider.when("/login", {
      templateUrl: "rimob/login/views/login.html",
      controller: "loginCtrl",
      resolve: {
        dbModel: function ($dbOff) {
          return $dbOff.getDBModel();
        },
      },
    });

    $routeProvider.when("/login/unidadegestora", {
      templateUrl: "rimob/login/views/unidadegestora.html",
      controller: "loginCtrl",
      resolve: {
        dbModel: function ($dbOff) {
          return $dbOff.getDBModel();
        },
      },
    });

    $routeProvider.when("/usuario", {
      templateUrl: "rimob/usuario/views/usuario.html",
      controller: "usuarioCtrl",
      resolve: {
        dbModel: function ($dbOff) {
          return $dbOff.getDBModel();
        },
      },
    });

    $routeProvider.when("/usuario/alterarSenha", {
      templateUrl: "rimob/usuario/views/senhaUsuario.html",
      controller: "usuarioCtrl",
      resolve: {
        dbModel: function ($dbOff) {
          return $dbOff.getDBModel();
        },
      },
    });

    $routeProvider.when("/mensagem", {
      templateUrl: "rimob/mensagem/views/mensagem.html",
      controller: "mensagemCtrl",
      resolve: {
        dbModel: function ($dbOff) {
          return $dbOff.getDBModel();
        },
      },
    });

    $routeProvider.when("/mensagem/:SqNotificacao", {
      templateUrl: "rimob/mensagem/views/detalhe-mensagem.html",
      controller: "mensagemCtrl",
      resolve: {
        dbModel: function ($dbOff) {
          return $dbOff.getDBModel();
        },
      },
    });

    //Rotas de Imóvel por Setor e Quadra

    $routeProvider.when("/imovel/setores", {
      templateUrl: "rimob/setor/views/setor.html",
      controller: "setorCtrl",
      resolve: {
        dbModel: function ($dbOff) {
          return $dbOff.getDBModel();
        },
      },
    });

    $routeProvider.when("/imovel/setores/quadras/:SqSetor", {
      templateUrl: "rimob/quadra/views/quadra.html",
      controller: "quadraCtrl",
      resolve: {
        dbModel: function ($dbOff) {
          return $dbOff.getDBModel();
        },
      },
    });

    $routeProvider.when("/imovel/setores/quadras/imoveis/:SqSetor/:SqQuadra", {
      templateUrl: "rimob/imovel/views/imovel.html",
      controller: "imovelCtrl",
      resolve: {
        dbModel: function ($dbOff) {
          return $dbOff.getDBModel();
        },
      },
    });

    $routeProvider.otherwise({
      redirectTo: "/",
    });
  },
]);

rimobApp.config([
  "$locationProvider",
  function ($locationProvider) {
    $locationProvider.hashPrefix("");
  },
]);
