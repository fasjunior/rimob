angular.module('Rimob').controller("backendExportCtrl", ["$scope", "$rootScope", "$timeout", "$dbOff", "$q", "$mdDialog", "backendExportService", "authService", "loginService",
                function ($scope, $rootScope, $timeout, $dbOff, $q, $mdDialog, backendExportService, authService, loginService) {

    $scope.value        = 0;
    $scope.bufferValue  = 10;
    $scope.status = "Iniciando exportação. Aguarde...";
    $rootScope.maxSqImovelRecadastramento = 0;
    $scope.maxSqContribuinteRecadastramento = 0;
    $scope.exportCompleted = 0;
    let o = this;
    let sqImovelArray = [];
    let sqContribuinteRecadArrayAnterior = [];
    let sqContribuinteRecadEditadoArrayAnterior = [];
    let sqContribuinteRecadArray = [];
    let sqContribuinteRecadEditadoArray = [];
    let reenviarDados = false;
    let imoveisFinalizadosNaoExportados = [];
    let novosContribuintes = [];
    let maxSqEntrevistadoRecadastramento = 0;
    $scope.startExport = function () {
        $rootScope.loadingDisabled = true;

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
                msg = 'Unidade Gestora inválida. Não é possível realizar a exportação. Contate o suporte.';
            }
            if (!situacaoEmpresa.FlPossuiacessoaosistema) {
                msg = 'A Unidade Gestora não possui acesso ao Rimob.';
            }
            if (msg != '') {
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
                    if (agente && agente.length > 0) {
                        o.exportDataBase();
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

    this.exportDataBase = function () {
        o.inserirTabsExportacao();
        o.apagarNotificacaoExportacao()
        .then(function () {
            return backendExportService.excluirImovelTemp();
        })
        .then(function () {
            return backendExportService.excluirContribuinteTemp();
        })
        .then(function () {
            $scope.status = "Verificando Contribuintes Adicionados...";
            return backendExportService.obterMaxCodContribuinteRecadastramento();
        })
        .then(function (result) {
            $scope.maxSqContribuinteRecadastramento = (result && result.data.length > 0 && result.data[0].maxSq) ? result.data[0].maxSq : 0;
            return $dbOff.selectAll("Contribuinte", options = {
                where: "SqContribuinte is ? or FlEditado = ?",
                parameters: ['null', 1]
            });
        })
        .then(function (result) {
            novosContribuintes = result.filter(function (contrib) {
                //Armazena os códigos anteriores para que, depois da exportação, os contribuintes sejam atualizados com os novos códigos gerados
                if (contrib.FlEditado) {
                    sqContribuinteRecadEditadoArrayAnterior.push(contrib.SqContribuinterecadastramento);
                    contrib.SqContribuinterecadastramentoAnterior = contrib.SqContribuinterecadastramento;
                    contrib.SqContribuinterecadastramento = ++$scope.maxSqContribuinteRecadastramento;
                    sqContribuinteRecadEditadoArray.push(contrib.SqContribuinterecadastramento);
                }
                else {
                    sqContribuinteRecadArrayAnterior.push(contrib.SqContribuinterecadastramento);
                    contrib.SqContribuinterecadastramentoAnterior = contrib.SqContribuinterecadastramento;
                    contrib.SqContribuinterecadastramento = ++$scope.maxSqContribuinteRecadastramento;
                    sqContribuinteRecadArray.push(contrib.SqContribuinterecadastramento);
                }
                return true;
            });
            $scope.incValue();
            $scope.status = "Exportando Novos Contribuintes...";

            return backendExportService.incluirContribuinteTemp(novosContribuintes);
        })
        .then(function () {
            return $dbOff.selectAll("Parametro");
        })
        .then(function (response) {
            $rootScope.parametroAgente = response[0];
            $scope.status = "Verificando Imóveis já cadastrados...";
            $scope.incValue();
            return backendExportService.obterMaxCodImovelRecadastramento();
        })
        .then(function (result) {
            $scope.maxSqImovelRecadastramento = (result && result.data.length > 0 && result.data[0].maxSq) ? result.data[0].maxSq : 0;

            $scope.status = "Obtendo Imóveis Finalizados...";
            $scope.incValue();
            return $dbOff.selectAll("Imovel", options = {
                where: "FlModificado is not null and ifnull(FlExportado, 0) <> ?",
                parameters: [1]
            });
        })
        .then(function (result) {
            imoveisFinalizadosNaoExportados = result.filter(function (imovel) {
                imovel.FlIncidenciaimovel = imovel.FlIncidenciaimovel != null ? imovel.FlIncidenciaimovel : '1100';
                sqImovelArray.push(imovel.SqImovelrecadastramento);
                //Se o imóvel não for associado a um novo contribuinte que já foi exportado
                if (!imovel.FlNovoContribuinte) {
                    //Imóvel cadastrado com contribuinte existente
                    if (imovel.SqContribuinte && imovel.SqContribuinte != 'undefined')
                        imovel.SqContribuinterecadastramento = null;
                        //Imóvel cadastrado com novo contribuinte que ainda não foi exportado
                    else {
                        //imovel.SqContribuinterecadastramento += $scope.maxSqContribuinteRecadastramento;
                        imovel.SqContribuinterecadastramento = o.obterSqContribuinteRecadGerado(imovel.SqContribuinterecadastramento);
                        imovel.SqContribuinte = null; //imovel.SqContribuinte = imovel.SqContribuinterecadastramento;
                    }

                }
                //Caso esteja associado a um novo contribuinte que já foi exportado, não é necessário calcular o SqContribuinteRecadastramento
                else {
                    //Como é um novo contribuinte já exportado, é atribuido o SqContribuinte ao SqContribuinteRecadastramento, igual ao cadastrado no banco
                    imovel.SqContribuinterecadastramento = imovel.SqContribuinte;
                    imovel.SqContribuinte = null;
                }
                //Se o imóvel não for associado a um novo responsável que já foi exportado
                if (!imovel.FlNovoResponsavel) {
                    //Imóvel cadastrado com responsável existente
                    if (imovel.SqContribuinteresponsavel && imovel.SqContribuinteresponsavel != 'undefined')
                        imovel.SqContribuinterecadastramentoresponsavel = null;
                        //Imóvel cadastrado com novo responsável que ainda não foi exportado
                    else if (imovel.SqContribuinterecadastramentoresponsavel) {
                        imovel.SqContribuinterecadastramentoresponsavel = o.obterSqContribuinteRecadGerado(imovel.SqContribuinterecadastramentoresponsavel);
                        imovel.SqContribuinteresponsavel = null;
                    }
                    else {
                        imovel.SqContribuinterecadastramentoresponsavel = imovel.SqContribuinteresponsavel = null;
                    }
                }
                    //Caso esteja associado a um novo responsável que já foi exportado, não é necessário calcular o SqContribuinteRecadastramento
                else {
                    //Como é um novo responsável já exportado, é atribuido o SqContribuinteresponsavel ao SqContribuinterecadastramentoresponsavel, igual ao cadastrado no banco
                    imovel.SqContribuinterecadastramentoresponsavel = imovel.SqContribuinteresponsavel;
                    imovel.SqContribuinteresponsavel = null;
                }
                imovel.SqImovelrecadastramentoAnterior  = imovel.SqImovelrecadastramento;
                imovel.SqImovelrecadastramento          = ++$scope.maxSqImovelRecadastramento;
                return true;
            });
            $scope.status = "Exportando Imóveis Finalizados...";
            return backendExportService.incluirImovelTemp(imoveisFinalizadosNaoExportados);
        })
        .then(function (result) {
            $scope.status = "Obtendo os Fatores dos Imóveis...";
            $scope.incValue();
            return $dbOff.selectAll("Fator_Imovel", options = {
                where: "SqImovelrecadastramento in ?",
                parameters: [sqImovelArray]
            });
        })
        .then(function (result) {
            let fatores = result.filter(function (fator) {
                fator.SqImovelrecadastramento = o.obterSqImovelRecadGerado(fator.SqImovelrecadastramento);
                fator.SqAgenteimobiliario = $rootScope.parametroAgente.SqAgenteimobiliario;
                return true;
            });
            $scope.status = "Exportando os Fatores dos Imóveis...";
            $scope.incValue();
            return backendExportService.incluirFatorImovelTemp(fatores);
        })
        .then(function (result) {
            $scope.status = "Obtendo as Áreas dos Imóveis...";
            $scope.incValue();
            return $dbOff.selectAll("Area_Imovel", options = {
                where: "SqImovelrecadastramento in ?",
                parameters: [sqImovelArray]
            });
        })
        .then(function (result) {
            let areas = result.filter(function (area) {
                area.SqImovelrecadastramento = o.obterSqImovelRecadGerado(area.SqImovelrecadastramento);
                area.SqAgenteimobiliario = $rootScope.parametroAgente.SqAgenteimobiliario;
                return true;
            });
            $scope.status = "Exportando as Áreas dos Imóveis...";
            $scope.incValue();
            return backendExportService.incluirAreaImovelTemp(areas);
        })
        .then(function () {
            $scope.status = "Verificando Entrevistados já cadastrados...";
            $scope.incValue();
            return backendExportService.obterMaxCodEntrevistadoRecadastramento();
        })
        .then(function (result) {
            maxSqEntrevistadoRecadastramento = (result && result.data.length > 0 && result.data[0].maxSq) ? result.data[0].maxSq : 0;
            $scope.status = "Obtendo os Entrevistados...";
            $scope.incValue();
            return $dbOff.selectAll("Entrevistado", options = {
                where: "SqImovelrecadastramento in ?",
                parameters: [sqImovelArray]
            });
        })
        .then(function (result) {
            let entrevistados = result.filter(function (entrevistado) {
                entrevistado.SqEntrevistadorecadastramento  = ++maxSqEntrevistadoRecadastramento;
                entrevistado.SqImovelrecadastramento        = o.obterSqImovelRecadGerado(entrevistado.SqImovelrecadastramento);
                entrevistado.SqAgenteimobiliario            = $rootScope.parametroAgente.SqAgenteimobiliario;
                return true;
            });
            $scope.status = "Exportando os Entrevistados...";
            $scope.incValue();
            return backendExportService.incluirEntrevistadoTemp(entrevistados);
        })
        .then(function () {
            $scope.incValue();
            $scope.status = "Obtendo as Fotos dos Imóveis...";
            return $dbOff.selectAll("Foto", options = {
                where: "SqImovelrecadastramento in ?",
                parameters: [sqImovelArray]
            });
        })
        .then(function (result) {
            let fotos = result.filter(function (foto) {
                foto.SqImovelrecadastramento = o.obterSqImovelRecadGerado(foto.SqImovelrecadastramento);
                foto.NuCpf = $rootScope.parametroAgente.NuCpf;
                foto.SqAgenteimobiliario = $rootScope.parametroAgente.SqAgenteimobiliario;
                return true;
            });
            $scope.status = "Exportando as Fotos dos Imóveis...";
            $scope.incValue();
            return backendExportService.incluirFotoImovel(fotos);
        })
        .then(function () {
            $scope.status = "Finalizando a exportação...";
            $scope.incValue();
            return backendExportService.exportarDados();
        })
        .then(function () {
            $scope.incValue();
            $scope.status = "Atualizando as Fotos dos Imóveis...";
            return $dbOff.delete("Foto", options = {
                where: "SqImovelrecadastramento in ?",
                parameters: [sqImovelArray]
            });
        })
        .then(function () {
            return o.atualizarTabExportacao('Foto', 1);
        })
        .then(function () {
            $scope.incValue();
            $scope.status = "Atualizando as Áreas dos Imóveis...";
            return $dbOff.delete("Area_Imovel", options = {
                where: "SqImovelrecadastramento in ?",
                parameters: [sqImovelArray]
            });
        })
        .then(function () {
            return o.atualizarTabExportacao('Area_Imovel', 1);
        })
        .then(function () {
            $scope.incValue();
            $scope.status = "Atualizando os Fatores dos Imóveis...";
            return $dbOff.delete("Fator_Imovel", options = {
                where: "SqImovelrecadastramento in ?",
                parameters: [sqImovelArray]
            });
        })
        .then(function () {
            return o.atualizarTabExportacao('Fator_Imovel', 1);
        })
        .then(function () {
            $scope.incValue();
            $scope.status = "Atualizando os Entrevistados...";
            return $dbOff.delete("Entrevistado", options = {
                where: "SqImovelrecadastramento in ?",
                parameters: [sqImovelArray]
            });
        })
        .then(function () {
            return o.atualizarTabExportacao('Entrevistado', 1);
        })
        .then(function () {
            $scope.incValue();
            $scope.status = "Atualizando os Imóveis...";
            return $dbOff.update("Imovel", options = {
                set: "FlExportado = ?",
                parametersSet: [1],
                where: "SqImovelrecadastramento in ?",
                parameters: [sqImovelArray]
            });
        })
        .then(function () {
            return o.atualizarTabExportacao('Imovel', 1);
        })
        .then(function () {
            $scope.incValue();
            $scope.status = "Atualizando os Contribuintes Novos...";
            return o.atualizaContribuintes(1, sqContribuinteRecadArrayAnterior, sqContribuinteRecadArray);
        })
        .then(function () {
            $scope.incValue();
            $scope.status = "Atualizando os Contribuintes Editados...";
            return o.atualizaContribuintes(0, sqContribuinteRecadEditadoArrayAnterior, sqContribuinteRecadEditadoArray);
        })
        .then(function () {
            return o.atualizarTabExportacao('Contribuinte', 1);
        })
        .then(function (result) {
            $scope.status = "Exportação Concluída!";
            $scope.exportCompleted = 1;
        });
    };

    //this.atualizaContribuintes = function () {
    //    let promises = [];
    //    for (let i = 0; i < sqContribuinteRecadArrayAnterior.length; i++) {
    //        let promise = $dbOff.update("Contribuinte", options = {
    //                where: "SqContribuinterecadastramento = ?",
    //                parameters: [sqContribuinteRecadArrayAnterior[i]],
    //                set: "SqContribuinte = ?, FlNovo = ?",
    //                parametersSet: [sqContribuinteRecadArray[i], 1]
    //        });
    //        promises.push(promise);
    //    }

    //    return $q.all(promises);
    //};
    //op = 0 (Editado), op = 1 (Novo)
    this.atualizaContribuintes = function (flNovo, sqAnteriorArray, sqArray) {
        let promises = [];
        for (let i = 0; i < sqAnteriorArray.length; i++) {
            let promise = $dbOff.update("Contribuinte", options = {
                where: "SqContribuinterecadastramento = ?",
                parameters: [sqAnteriorArray[i]],
                set: "SqContribuinte = ?, FlNovo = ?, FlEditado = ?",
                parametersSet: [sqArray[i], flNovo, 0]
            });
            promises.push(promise);
        }

        return $q.all(promises);
    };

    this.inserirTabsExportacao = function () {
        $dbOff.delete("Exportacao")
       .then(function () {
           let tabelas = [];
           if ($rootScope.novosContribuintes > 0) {
               tabelas.push({ NmTabela: 'Contribuinte', FlExportada: 0 });
           }
           if ($rootScope.imoveisFinalizadosNaoExportados.length > 0) {
               tabelas.push({ NmTabela: 'Imovel', FlExportada: 0 });
               tabelas.push({ NmTabela: 'Fator_Imovel', FlExportada: 0 });
               tabelas.push({ NmTabela: 'Area_Imovel', FlExportada: 0 });
               tabelas.push({ NmTabela: 'Entrevistado', FlExportada: 0 });
               tabelas.push({ NmTabela: 'Foto', FlExportada: 0 });
           }
           $dbOff.insert("Exportacao", tabelas);
       });
       
    };

    this.atualizarTabExportacao = function (tabela, status) {
        return $dbOff.update("Exportacao", options = {
            set: "FlExportada = ?",
            parametersSet: [status],
            where: "NmTabela like '?'",
            parameters: [tabela]
        });
    };

    this.apagarNotificacaoExportacao = function () {
        return $dbOff.delete("Notificacao", options = {
            where: "TpNotificacao = ?",
            parameters: [1]
        });
    };

    this.obterSqImovelRecadGerado = function (sqImovelRecadAnterior) {
        let imovel = imoveisFinalizadosNaoExportados.find(i => i.SqImovelrecadastramentoAnterior == sqImovelRecadAnterior);
        return imovel.SqImovelrecadastramento;
    };

    this.obterSqContribuinteRecadGerado = function (sqContribuinteRecadAnterior) {
        let contribuinte = novosContribuintes.find(i => i.SqContribuinterecadastramentoAnterior == sqContribuinteRecadAnterior);
        return contribuinte.SqContribuinterecadastramento;
    };

    $scope.incValue = function () {
        $scope.value += (100/16);
        $scope.bufferValue = $scope.value * 2;
    }

}]);