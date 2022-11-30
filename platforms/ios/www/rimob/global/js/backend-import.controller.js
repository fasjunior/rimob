angular.module('Rimob').controller("backendImportCtrl", ["$scope", "$rootScope", "$timeout", "$dbOff", "$q", "$mdDialog", "backendImportService", "authService", "loginService",
                function ($scope, $rootScope, $timeout, $dbOff, $q, $mdDialog, backendImportService, authService, loginService) {

    $scope.value        = 0;
    $scope.bufferValue  = 10;
    $scope.status       = "Iniciando importação. Aguarde...";
    $scope.importCompleted = 0;
    let o = this;
    let dadosLocal;
    let areas = [];
    let areasAgente = [];
    $scope.startImport = function () {
        $scope.status = "Verificando conexão...";
        authService.obterToken()
        .then(function (response) {
            let auth = angular.fromJson(response.data);
            $rootScope.accessAuth = auth.token_type + ' ' + auth.access_token;
            return authService.obterSituacaoEmpresa($rootScope.parametroAgente.NuCnpj);
        })
        .then(function (response) {
            let situacaoEmpresa = angular.fromJson(response.data[0]);
            let msg = '';

            if (situacaoEmpresa.FlSistemabloqueado) {
                msg = 'Unidade Gestora inválida. Não é possível realizar a importação. Contate o suporte.';
            }
            if (!situacaoEmpresa.FlPossuiacessoaosistema) {
                msg = 'A Unidade Gestora não possui acesso ao Rimob.';
            }
            if (msg != '')
            {
                $mdDialog.show(
                      $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('Aviso')
                        .textContent(msg)
                        .ariaLabel('Aviso Situação Empresa')
                        .ok('Ok')
                );
                return;
            }
            $timeout(function () {
                loginService.obterAgenteImobiliario($rootScope.parametroAgente.NuCnpj, $rootScope.parametroAgente.NuCpf, null)
                .then(function (response) {
                    let agente = angular.fromJson(response.data);
                    if(agente && agente.length > 0){
                        $dbOff.createDataBase();
                        $scope.status = "Limpando a base local...";
                        o.clearDataBase();
                    }
                    else {
                        $mdDialog.show(
                        $mdDialog.alert()
                          .clickOutsideToClose(true)
                          .title('Aviso')
                          .textContent('Sua conta foi desativada!')
                          .ariaLabel('Aviso Importação')
                          .ok('Ok')
                        );
                    }
                });
                
            }, 1500);
        });
    };

    this.clearDataBase = function () {
        $dbOff.delete("Area_Agente")
        .then(function () {
            return $dbOff.delete("Area_Imovel");
        })
        .then(function () {
            return $dbOff.delete("Bairro");
        })
        .then(function () {
            return $dbOff.delete("Contribuinte");
        })
        .then(function () {
            return $dbOff.delete("Distrito");
        })
        .then(function () {
            return $dbOff.delete("Estado");
        })
        .then(function () {
            return $dbOff.delete("Fator_Imovel");
        })
        .then(function () {
            return $dbOff.delete("Imovel");
        })
        .then(function () {
            return $dbOff.delete("Logradouro");
        })
        .then(function () {
            return $dbOff.delete("Municipio");
        })
        .then(function () {
            return $dbOff.delete("Pais");
        })
        .then(function () {
            return $dbOff.delete("Quadra_Setor");
        })
        .then(function () {
            return $dbOff.delete("Setor");
        })
        .then(function () {
            return $dbOff.delete("Tipo_Fator");
        })
        .then(function () {
            return $dbOff.delete("Tipo_Imovel");
        })
        .then(function () {
            return $dbOff.delete("Foto");
        })
        .then(function () {
            return $dbOff.delete("Importacao");
        })
        .then(function () {
            return $dbOff.delete("Condominio");
        })
        .then(function () {
            return $dbOff.delete("Secao");
        })
        .then(function () {
            return $dbOff.delete("Face");
        })
        .then(function () {
            return $dbOff.delete("Loteamento");
        })
        .then(function () {
            return $dbOff.delete("Cartorio");
        })
        .then(function () {
            return $dbOff.delete("Entrevistado");
        })
        .then(function () {
            o.importDataBase();
        });
    };

    this.importDataBase = function () {
        
        $dbOff.getDBModel()
        .then(function (response) {
            o.inserirTabsImportacao(response);
            return o.apagarNotificacaoImportacao();
        })
        .then(function () {
            $scope.status = "Importando Bairros...";
            return backendImportService.obterBairro();
        })
        .then(function (response) {
            $dbOff.insert("Bairro", angular.fromJson(response.data));
            $scope.incValue();
            return o.atualizarTabImportacao('Bairro', 1);
        })
        .then(function () {
            $scope.status = "Importando Logradouros...";
            return backendImportService.obterLogradouro();
        })
        .then(function (response) {
            $dbOff.insert("Logradouro", angular.fromJson(response.data));
            $scope.incValue();
            return o.atualizarTabImportacao('Logradouro', 1);
        })
        .then(function () {
            $scope.status = "Importando Tipos de Imóveis...";
            return backendImportService.obterTipoImovel();
        })
        .then(function (response) {
            $dbOff.insert("Tipo_Imovel", angular.fromJson(response.data));
            $scope.incValue();
            return o.atualizarTabImportacao('Tipo_Imovel', 1);
        })
        .then(function () {
            $scope.status = "Importando Áreas do Agente...";
            return backendImportService.obterAreaAgente();
        })
        .then(function (response) {
            areasAgente = angular.fromJson(response.data);
            $dbOff.insert("Area_Agente", areasAgente);
            $scope.incValue();
            return o.atualizarTabImportacao('Area_Agente', 1);
        })
        .then(function () {
            $scope.status = "Importando Distritos...";
            return backendImportService.obterDistrito();
        })
        .then(function (response) {
            $dbOff.insert("Distrito", angular.fromJson(response.data));
            $scope.incValue();
            return o.atualizarTabImportacao('Distrito', 1);
        })
        .then(function () {
            $scope.status = "Importando Imóveis...";
            return backendImportService.obterImovel();
        })
        .then(function (response) {
            let imoveis = angular.fromJson(response.data);
            for (let i = 0; i < imoveis.length; i++) {
                imoveis[i].SqAgenteimobiliario = $rootScope.parametroAgente.SqAgenteimobiliario;
                imoveis[i].SqImovelrecadastramento = imoveis[i].SqImovel;
            }
            $dbOff.insert("Imovel", imoveis);
            $scope.incValue();
            return o.atualizarTabImportacao('Imovel', 1);
        })
        .then(function () {
            $scope.status = "Importando Contribuintes...";
            return backendImportService.obterContribuinte();
        })
        .then(function (response) {
            let contribuintes = angular.fromJson(response.data);
            for (let i = 0; i < contribuintes.length; i++) {
                contribuintes[i].SqAgenteimobiliario = $rootScope.parametroAgente.SqAgenteimobiliario;
                contribuintes[i].SqContribuinterecadastramento = contribuintes[i].SqContribuinte;
            }
            $dbOff.insert("Contribuinte", contribuintes);
            $scope.incValue();
            return o.atualizarTabImportacao('Contribuinte', 1);
        })
        .then(function () {
            $scope.status = "Importando Tipos de Fatores...";
            return backendImportService.obterTipoFator();
        })
        .then(function (response) {
            $dbOff.insert("Tipo_Fator", angular.fromJson(response.data));
            $scope.incValue();
            return o.atualizarTabImportacao('Tipo_Fator', 1);
        })
        .then(function () {
            $scope.status = "Importando Fatores dos Imóveis...";
            return backendImportService.obterFatorImovel();
        })
        .then(function (response) {
            $dbOff.insert("Fator_Imovel", angular.fromJson(response.data));
            $scope.incValue();
            return $dbOff.update("Fator_Imovel", options = {
                set: "SqImovelrecadastramento = ?",
                parametersSet: ['SqImovel']
            });
        })
        .then(function () {
            return o.atualizarTabImportacao('Fator_Imovel', 1);
        })
        .then(function () {
            $scope.status = "Importando Áreas dos Imóveis...";
            return backendImportService.obterAreaImovel();
        })
        .then(function (response) {
            let areas = angular.fromJson(response.data);
            for (let i = 0; i < areas.length; i++) {
                areas[i].SqImovelrecadastramento = areas[i].SqImovel;
                areas[i].SqAreaimovelrecadastramento = areas[i].SqAreaimovel;
            }
            $dbOff.insert("Area_Imovel", areas);
            $scope.incValue();
            return o.atualizarTabImportacao('Area_Imovel', 1);
        })
        .then(function () {
            $scope.status = "Importando Setores...";
            return backendImportService.obterSetorMunicipio();
        })
        .then(function (response) {
            $dbOff.insert("Setor", angular.fromJson(response.data));
            $scope.incValue();
            return o.atualizarTabImportacao('Setor', 1);
        })
        .then(function () {
            $scope.status = "Importando Quadras...";
            return backendImportService.obterQuadraSetor();
        })
        .then(function (response) {
            $dbOff.insert("Quadra_Setor", angular.fromJson(response.data));
            $scope.incValue();
            return o.atualizarTabImportacao('Quadra_Setor', 1);
        })
        .then(function () {
            $scope.status = "Importando Condomínios...";
            return backendImportService.obterCondominio();
        })
        .then(function (response) {
            $dbOff.insert("Condominio", angular.fromJson(response.data));
            $scope.incValue();
            return o.atualizarTabImportacao('Condominio', 1);
        })
        .then(function () {
            $scope.status = "Importando Seções...";
            return backendImportService.obterSecao();
        })
        .then(function (response) {
            $dbOff.insert("Secao", angular.fromJson(response.data));
            $scope.incValue();
            return o.atualizarTabImportacao('Secao', 1);
        })
        .then(function () {
            $scope.status = "Importando Faces...";
            return backendImportService.obterFace();
        })
        .then(function (response) {
            $dbOff.insert("Face", angular.fromJson(response.data));
            $scope.incValue();
            return o.atualizarTabImportacao('Face', 1);
        })
        .then(function () {
            $scope.status = "Importando Loteamentos...";
            return backendImportService.obterLoteamento();
        })
        .then(function (response) {
            $dbOff.insert("Loteamento", angular.fromJson(response.data));
            $scope.incValue();
            return o.atualizarTabImportacao('Loteamento', 1);
        })
        .then(function () {
            $scope.status = "Importando Cartórios...";
            return backendImportService.obterCartorio();
        })
        .then(function (response) {
            $dbOff.insert("Cartorio", angular.fromJson(response.data));
            $scope.incValue();
            return o.atualizarTabImportacao('Cartorio', 1);
        })
        .then(function () {
            $scope.status = "Importando Dados Local...";
            return backendImportService.obterDados();
        })
        .then(function (response) {
            dadosLocal = response.data;
            $dbOff.insert("Pais", angular.fromJson(dadosLocal.paises));
            return o.atualizarTabImportacao('Pais', 1);
        })
        .then(function () {
            $dbOff.insert("Estado", angular.fromJson(dadosLocal.estados));
            return o.atualizarTabImportacao('Estado', 1);
        })
        .then(function () {
            $dbOff.insert("Municipio", angular.fromJson(dadosLocal.municipios));
            return o.atualizarTabImportacao('Municipio', 1);
        })
        .then(function () {
            $scope.incValue();
            $scope.status = "Importação Concluída!";
            $scope.importCompleted = 1;
            o.initRelImoveis();
        });
    };

    this.inserirTabsImportacao = function (dbModel) {
        let tabelas = [];
        for(let table of dbModel.tables)
        {
            if (table.tableName != 'Importacao' &&
                table.tableName != 'Exportacao' &&
                table.tableName != 'Notificacao' &&
                table.tableName != 'Parametro' &&
                table.tableName != 'Entrevistado' &&
                table.tableName != 'Foto' &&
                table.tableName != 'Db_Version') {
                tabelas.push({ NmTabela: table.tableName, FlImportada: 0 });
            }
        }
        $dbOff.insert("Importacao", tabelas);
    };

    this.atualizarTabImportacao = function (tabela, status) {
        return $dbOff.update("Importacao", options = {
            set: "FlImportada = ?",
            parametersSet: [status],
            where: "NmTabela like '?'",
            parameters: [tabela]
        });
    };

    this.apagarNotificacaoImportacao = function () {
        return $dbOff.delete("Notificacao", options = {
            where: "TpNotificacao = ? and SqNotificacao = ?",
            parameters: [1, 1]
        });
    };
    //Inicializa a opção de relação dos imóveis
    this.initRelImoveis = function (){
        let disableBairroLogradouro = (areasAgente &&
                                       areasAgente.length > 0 &&
                                       areasAgente.findIndex(a => a.SqBairro == null || a.SqLogradouro == null) > -1
                                      ) || 
                                      !areasAgente;
        let disableSetorQuadra      = (areasAgente &&
                                       areasAgente.length > 0 &&
                                       areasAgente.findIndex(a => a.SqSetor == null || a.SqQuadra == null) > -1
                                      ) || 
                                      !areasAgente;
        $rootScope.disableBairroLogradouro  = disableBairroLogradouro;
        $rootScope.disableSetorQuadra       = disableSetorQuadra;
        let RelImoveis                      = $rootScope.parametroAgente.RelImoveis ? $rootScope.parametroAgente.RelImoveis : 
                                                                        ($rootScope.disableBairroLogradouro ? 2 : 1); 
        if (!$rootScope.parametroAgente.RelImoveis) {
            $dbOff.update("Parametro", options = {
                set: "RelImoveis = ?",
                parametersSet: [RelImoveis]
            });
        }
    };

    $scope.incValue = function () {
        $scope.value += 5.6;
        $scope.bufferValue = $scope.value * 2;
    }

}]);