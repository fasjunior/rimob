﻿angular.module("Rimob")
    .controller("imovelCtrl", ["$scope", "$rootScope", "$routeParams", "$mdDialog", "$timeout", "$location", "panels", "tipofatorService", "estadoService",
                               "municipioService", "logradouroService", "contribuinteService", "fatorimovelService", "fotoimovelService",
                               "areaimovelService", "tipoimovelService", "distritoService", "setorService", "quadraService", "imovelService", "paisService",
                               "condominioService", "secaoService", "faceService", "loteamentoService", "cartorioService", "entrevistadoService", "bairroService", "quadraService", function (
                                $scope, $rootScope, $routeParams, $mdDialog, $timeout, $location, panels, tipofatorService, estadoService,
                                municipioService, logradouroService, contribuinteService, fatorimovelService, fotoimovelService,
                                areaimovelService, tipoimovelService, distritoService, setorService, quadraService, imovelService, paisService,
                                condominioService, secaoService, faceService, loteamentoService, cartorioService, entrevistadoService, bairroService, quadraService) {

        $scope.imoveis = [];
        $scope.logradouro = {};
        $scope.logradouros = [];
        $scope.logradourosResponsavel = [];
        $scope.bairros = [];
        $scope.bairrosResponsavel = [];
        $scope.imovel = {};
        $scope.contribuinte = {};
        $scope.contribuinteResponsavel = {};
        $scope.novoContribuinte = null;
        $scope.municipioContribuinte = {};
        $scope.municipiosContribuinte = [];
        $scope.municipioResponsavel = {};
        $scope.municipiosResponsavel = [];
        $scope.municipioCorrespondencia = {};
        $scope.municipiosCorrespondencia = [];
        $scope.estados = [];
        $scope.tiposFatores = [];
        $scope.tiposFatoresTab = [];
        $scope.fatoresImovel = [];
        $scope.areasImovel = [];
        $scope.tiposImovel = [];
        $scope.tipoImovel = [];
        $scope.distritos = [];
        $scope.distritosDisplayed = [];
        $scope.setores = [];
        $scope.setoresDisplayed = [];
        $scope.quadra = {};
        $scope.quadras = [];
        $scope.quadrasDisplayed = [];
        $scope.condominios = [];
        $scope.condominiosDisplayed = [];
        $scope.secoes = [];
        $scope.secoesDisplayed = [];
        $scope.faces = [];
        $scope.facesDisplayed = [];
        $scope.loteamentos = [];
        $scope.loteamentosDisplayed = [];
        $scope.images = [];
        $scope.availableQuantity = [];
        $scope.exibePanel = false;
        $scope.SqBairro = $routeParams.SqBairro;
        $scope.SqLogradouro = $routeParams.SqLogradouro;
        $scope.exibeBtnAddImovel = false;
        $scope.paises = [];
        $scope.pais = {};
        $scope.cartorios = [];
        $scope.entrevistado = {};
        $scope.municipioIgualDaUG = false;
        $scope.municipioResponsavelIgualDaUG = false;
        let qtdItensInfiniteScroll = 20;
        let o = this;
        let date = new Date();
        let limiteFotosPorExportacao = 200;
        $scope.minDate = new Date(1900, 0);
        $scope.maxDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        $timeout(function () {
            $scope.exibeBtnAddImovel = true;
        }, 1000);

        if ($routeParams.SqBairro) {
            logradouroService.obterLogradouro($routeParams.SqBairro, $routeParams.SqLogradouro).then(function (result) {
                $scope.logradouro = (result && result.length > 0) ? result[0] : null;
            });
        }
        else {
            quadraService.obterQuadra($routeParams.SqSetor, $routeParams.SqQuadra).then(function (result) {
                $scope.quadra = (result && result.length > 0) ? result[0] : null;
            });
        }

        $scope.obterImoveis = function (dsBusca) {
            if ($routeParams.SqBairro) {
                return imovelService.obterImoveisComBusca($routeParams.SqBairro, $routeParams.SqLogradouro, dsBusca);
            }
            else {
                return imovelService.obterImoveisPorSetorEQuadraComBusca($routeParams.SqSetor, $routeParams.SqQuadra, dsBusca);
            }
        };

        $scope.novoImovel = function () {
            $location.path('/imovel/bairros/logradouros/imoveis/');
            
            $scope.$apply();
        };

        $scope.obterTiposImovel = function () {
            tipoimovelService.obterTiposImovel().then(function (result) {
                $scope.tiposImovel = result;
                return imovelService.obterImovel($routeParams.SqBairro, $routeParams.SqLogradouro, $routeParams.SqImovelrecadastramento);
            })
            .then(function (result) {
                if (result && result.length > 0) {
                    $scope.imovel = result[0];
                    if ($scope.imovel.NuLatitude && $scope.imovel.NuLongitude)
                        $scope.imovel.cbCoordenadas = true;
                    else
                        $scope.imovel.cbCoordenadas = false;
                }
                else {
                    $scope.imovel.SqImovelrecadastramento = 0;
                }
                
            })
        };

        $scope.setTipoImovel = function () {
            $rootScope.sqTipoImovel = document.querySelector('input[name="radio-group"]:checked').value;
            $scope.imovel.SqTipoimovel = $routeParams.SqTipoimovel;
            let url = '/imovel/bairros/logradouros/imoveis/' + $scope.imovel.SqBairro + '/' + $scope.imovel.SqLogradouro +'/'+ $scope.imovel.SqTipoimovel + '/' + $scope.imovel.SqImovelrecadastramento;
            $location.path(url);
        };

        $scope.obterDadosImovel = function () {
            $scope.currentNavItem = 'pgTerreno';
            $scope.qtTabsAdicionais = 0;
            //$scope.paises.push({ CdPais: 76, NmPais: 'Brasil', SgPais: 'BR' });
            //o.removeNavBar();

            //Calcula a quantidade de itens do Infinite Scroll, exibidos inicialmente, de acordo com a altura do dispositivo
            let heightScreen = screen.height;
            let fator = (heightScreen >= 800) ? ((heightScreen / 800) + 1) : 1;
            qtdItensInfiniteScroll = Math.floor(fator) * 20;

            tipofatorService.obterTiposFatores($routeParams.SqTipoimovel)
            .then(function (result) {
                $scope.tiposFatores = result;
                let qtdAbasIniciais = $scope.qtdAbasIniciais;
                $scope.tiposFatoresTab = result.filter((obj, pos, arr) => {
                    if (arr.map(mapObj => mapObj.SqTipofator).indexOf(obj.SqTipofator) === pos) {
                        obj.value = qtdAbasIniciais + 1;
                        qtdAbasIniciais++;
                        return true;
                    }
                });
                return distritoService.obterDistritos();
            })
            .then(function (result) {
                $scope.distritos = result;
                $scope.distritosDisplayed = $scope.distritos.slice(0, qtdItensInfiniteScroll);
                return tipoimovelService.obterTipoImovel($routeParams.SqTipoimovel);
            })
            .then(function (result) {
                $scope.tipoImovel = (result && result.length > 0) ? result[0] : null;
                return condominioService.obterCondominios();
            })
            .then(function (result) {
                $scope.condominios = result;
                $scope.condominiosDisplayed = $scope.condominios.slice(0, qtdItensInfiniteScroll);
                return secaoService.obterSecoes();
            })
            .then(function (result) {
                $scope.secoes = result;
                $scope.secoesDisplayed = $scope.secoes.slice(0, qtdItensInfiniteScroll);
                return loteamentoService.obterLoteamentos();
            })
            .then(function (result) {
                $scope.loteamentos = result;
                $scope.loteamentosDisplayed = $scope.loteamentos.slice(0, qtdItensInfiniteScroll);
                return cartorioService.obterCartorios();
            })
            .then(function (result) {
                $scope.cartorios = result;
                return fotoimovelService.obterQtFotosImovel();
            })
            .then(function (result) {
                //Verifica a quantidade de fotos inseridas e calcula a quantidade disponível, de acordo com o limite por exportação
                let qtTotalFotos = (result && result[0]) ? result[0].qtFotos : 0;
                $scope.availableQuantity = limiteFotosPorExportacao - qtTotalFotos;
            });

            //Se algum imóvel existente for selecionado, obtém seus dados para o usuário editá-los
            if ($routeParams.SqImovelrecadastramento != "0") {
                imovelService.obterImovel($routeParams.SqBairro, $routeParams.SqLogradouro, $routeParams.SqImovelrecadastramento)
                .then(function (result) {
                    $scope.imovel = (result && result.length > 0) ? result[0] : null;
                    $scope.imovel.CdPais = $scope.imovel.CdPais || 76;  //Se não existir, define o País padrão como Brasil
                    $scope.imovel.SqTipoimovel = $routeParams.SqTipoimovel;
                    if ($scope.imovel.NuLatitude && $scope.imovel.NuLongitude)
                        $scope.imovel.cbCoordenadas = true;
                    else
                        $scope.imovel.cbCoordenadas = false;
                    return fatorimovelService.obterFatoresImovel($scope.imovel.SqImovelrecadastramento);
                })
                .then(function (result) {
                    $scope.fatoresImovel = result;
                    return areaimovelService.obterAreasImovel($scope.imovel.SqImovelrecadastramento);
                })
                .then(function (result) {
                    $scope.areasImovel = result;
                    if ($scope.imovel.CdMunicipio) {
                        return municipioService.obterMunicipio($scope.imovel.CdMunicipio);
                    }
                    else {
                        return null;
                    }
                })
                .then(function (result) {
                    $scope.municipioCorrespondencia = (result && result.length > 0) ? result[0] : {};
                    if ($scope.municipioCorrespondencia) {
                        $scope.municipiosCorrespondencia = [
                                {
                                    CdMunicipio: $scope.municipioCorrespondencia.CdMunicipio,
                                    NmMunicipio: $scope.municipioCorrespondencia.NmMunicipio,
                                    SgUf: $scope.municipioCorrespondencia.SgUf
                                }];
                    }
                    return fotoimovelService.obterFotosImovel($scope.imovel.SqImovelrecadastramento);
                })
                .then(function (result) {
                    $scope.images = result;

                    let sqContribuinte;
                    if ($scope.imovel.SqContribuinterecadastramento && $scope.imovel.SqContribuinterecadastramento != 'undefined') {
                        sqContribuinte = $scope.imovel.SqContribuinterecadastramento;
                    }
                    else {
                        sqContribuinte = $scope.imovel.SqContribuinte;
                    }
                    return contribuinteService.obterContribuinte(sqContribuinte);
                })
                .then(function (result) {
                    $scope.contribuinte = (result && result.length > 0) ? result[0] : null;
                    $scope.contribuinte.NuCpfcnpjcontribuinte = o.addMaskCpfCnpj($scope.contribuinte.NuCpfcnpjcontribuinte);
                    $scope.contribuinte.NuCelular = o.addMaskTel($scope.contribuinte.NuCelular);
                    $scope.contribuinte.NuTelefone = o.addMaskTel($scope.contribuinte.NuTelefone);
                    $scope.contribuinte.FlEditado = 0;
                    if ($scope.contribuinte.CdPais)
                        return paisService.obterPais($scope.contribuinte.CdPais);
                    else
                        return null;
                })
                .then(function (result) {
                    let sqContribuinteResponsavel = null;
                    if (result && result.length > 0) {
                        $scope.pais = result[0];
                        $scope.paises.push(result[0]);
                    }
                    else {
                        $scope.pais = null;
                        $scope.paises.push({ CdPais: 76, NmPais: 'Brasil', SgPais: 'BR' });
                    }
                    if ($scope.imovel.SqContribuinterecadastramentoresponsavel && $scope.imovel.SqContribuinterecadastramentoresponsavel != 'undefined') {
                        sqContribuinteResponsavel = $scope.imovel.SqContribuinterecadastramentoresponsavel;
                    }
                    else if ($scope.imovel.SqContribuinteresponsavel && $scope.imovel.SqContribuinteresponsavel != 'undefined') {
                        sqContribuinteResponsavel = $scope.imovel.SqContribuinteresponsavel;
                    }

                    if (sqContribuinteResponsavel) {
                        return contribuinteService.obterContribuinte(sqContribuinteResponsavel);
                    }
                    else {
                        return null;
                    }

                })
                .then(function (result) {
                    if (result && result.length > 0) {
                        $scope.contribuinteResponsavel = result[0];
                        $scope.contribuinteResponsavel.NuCpfcnpjcontribuinte = o.addMaskCpfCnpj($scope.contribuinteResponsavel.NuCpfcnpjcontribuinte);
                        $scope.contribuinteResponsavel.NuCelular = o.addMaskTel($scope.contribuinteResponsavel.NuCelular);
                        $scope.contribuinteResponsavel.NuTelefone = o.addMaskTel($scope.contribuinteResponsavel.NuTelefone);
                        $scope.contribuinteResponsavel.FlEditado = 0;
                    }
                    else {
                        $scope.contribuinteResponsavel = null;
                    }

                    if ($scope.contribuinte.CdMunicipio)
                        return municipioService.obterMunicipio($scope.contribuinte.CdMunicipio);
                    else
                        return null;
                })
                .then(function (result) {
                    if (result && result.length > 0) {
                        $scope.municipioContribuinte = result[0];
                        $scope.municipiosContribuinte.push(result[0]);
                        $scope.verificaMunicipioContribuinteSelecionado($scope.municipioContribuinte.CdMunicipio);
                    }
                    else {
                        $scope.municipioContribuinte = null;
                    }

                    if ($scope.contribuinte.SqBairro && $scope.contribuinte.SqLogradouro)
                        return logradouroService.obterLogradouro($scope.contribuinte.SqBairro, $scope.contribuinte.SqLogradouro);
                    else
                        return null;
                })
                .then(function (result) {
                    if (result && result.length > 0) {
                        $scope.logradouroContribuinte = result[0];
                        $scope.logradouros.push($scope.logradouroContribuinte);
                        $scope.bairros = [{ SqBairro: $scope.logradouroContribuinte.SqBairro, NmBairro: $scope.logradouroContribuinte.NmBairro }];
                    }
                    else {
                        $scope.logradouroContribuinte = null;
                    }
                    if ($scope.contribuinteResponsavel && $scope.contribuinteResponsavel.CdPais)
                        return paisService.obterPais($scope.contribuinteResponsavel.CdPais);
                    else
                        return null;
                })
                .then(function (result) {
                    $scope.paisResponsavel = (result && result.length > 0) ? result[0] : null;
                    if ($scope.contribuinteResponsavel && $scope.contribuinteResponsavel.CdMunicipio)
                        return municipioService.obterMunicipio($scope.contribuinteResponsavel.CdMunicipio);
                    else
                        return null;
                })
                .then(function (result) {
                    if (result && result.length > 0) {
                        $scope.municipioResponsavel = result[0];
                        $scope.municipiosResponsavel.push(result[0]);
                        $scope.verificaMunicipioResponsavelSelecionado($scope.municipioResponsavel.CdMunicipio);
                    }
                    else {
                        $scope.municipioResponsavel = null;
                    }

                    if ($scope.contribuinteResponsavel && $scope.contribuinteResponsavel.SqBairro && $scope.contribuinteResponsavel.SqLogradouro)
                        return logradouroService.obterLogradouro($scope.contribuinteResponsavel.SqBairro, $scope.contribuinteResponsavel.SqLogradouro);
                    else
                        return null;
                })
                .then(function (result) {
                    if (result && result.length > 0) {
                        $scope.logradourosResponsavel.push(result[0]);
                        $scope.bairrosResponsavel = [{ SqBairro: result[0].SqBairro, NmBairro: result[0].NmBairro }];
                    }
                    return entrevistadoService.obterEntrevistado($scope.imovel.SqImovelrecadastramento);
                })
                .then(function (result) {
                    if (result && result.length > 0) {
                        $scope.entrevistado = result[0];
                        $scope.entrevistado.flIncluirEntrevistado = true;
                    }
                });
            }
            else {
                $scope.imovel.CdPais = 76;  //Atribuindo o País padrão como Brasil
                $scope.paises.push({ CdPais: 76, NmPais: 'Brasil', SgPais: 'BR' });
                $scope.imovel.NuPublico = "NOVO";
                $scope.imovel.SqTipoimovel = $routeParams.SqTipoimovel;
            }
        };

        $scope.verificaFatorSelecionado = function (SqTipofator, SqFator) {
            for (let i = 0; i < $scope.fatoresImovel.length; i++){
                if ($scope.fatoresImovel[i].SqTipofator === SqTipofator && $scope.fatoresImovel[i].SqFator === SqFator) {
                    return true;
                }
            }
            return false;
        }

        $scope.obterFatoresPorTipo = function (SqTipofator) {
            let fatores = [];
            fatores = $scope.tiposFatores.filter(function (fator) {
                  return fator.SqTipofator == SqTipofator;
            });
            return fatores;
        }

        $scope.updateSelection = function (position, entities) {
            angular.forEach(entities, function (subscription, index) {
                if (position != index)
                    subscription.checked = false;
            });
        }

        $scope.updateSelectionTipoImovel = function (position, entities) {
            $scope.updateSelection(position, entities);
            if (entities[position].checked) {
                $scope.imovel.SqTipoimovel = entities[position].SqTipoimovel;
            }
        }

        $scope.atualizaTipoImovel = function (position, entities) {
            if (entities[position].checked) {
                $scope.imovel.SqTipoimovel = entities[position].SqTipoimovel;
                $scope.imovel.NmTipoimovel = entities[position].NmTipoimovel;
                tipofatorService.obterTiposFatores($scope.imovel.SqTipoimovel).then(function (result) {
                    $scope.tiposFatores = result;
                });
            }
            else {
                $scope.imovel.SqTipoimovel = null;
                $scope.imovel.NmTipoimovel = null;
                $scope.tiposFatores = [];
            }
            $scope.updateSelection(position, entities);
        }

        $scope.atualizaDistrito = function (position, entities) {
            if (entities[position].checked) {
                $scope.imovel.SqDistrito = entities[position].SqDistrito;
                setorService.obterSetoresPorDistrito($scope.imovel.SqDistrito).then(function (result) {
                    $scope.setores = result;
                    $scope.setoresDisplayed = $scope.setores.slice(0, qtdItensInfiniteScroll);
                });
            }
            else {
                $scope.imovel.SqDistrito = null;
                $scope.imovel.SqSetor = null;
                $scope.imovel.NuSetor = null;
                $scope.imovel.SqQuadra = null;
                $scope.imovel.NuQuadra = null;
                $scope.setores = $scope.setoresDisplayed = [];
                $scope.quadras = $scope.quadrasDisplayed = [];
                $scope.faces = $scope.facesDisplayed = [];
            }
            $scope.updateSelection(position, entities);
        }

        $scope.atualizaSetor = function (position, entities) {
            if (entities[position].checked) {
                $scope.imovel.SqSetor = entities[position].SqSetor;
                $scope.imovel.NuSetor = entities[position].NuSetor;
                quadraService.obterQuadras($scope.imovel.SqSetor).then(function (result) {
                    $scope.quadras = result;
                    $scope.quadrasDisplayed = $scope.quadras.slice(0, qtdItensInfiniteScroll);
                });
            }
            else {
                $scope.imovel.SqSetor = null;
                $scope.imovel.NuSetor = null;
                $scope.imovel.SqQuadra = null;
                $scope.imovel.NuQuadra = null;
                $scope.quadras = $scope.quadrasDisplayed = [];
                $scope.faces = $scope.facesDisplayed = [];
            }
            $scope.updateSelection(position, entities);
        }

        $scope.atualizaQuadra = function (position, entities) {
            if (entities[position].checked) {
                $scope.imovel.SqQuadra = entities[position].SqQuadra;
                $scope.imovel.NuQuadra = entities[position].NuQuadra;
                faceService.obterFacesPorQuadra($scope.imovel.SqQuadra).then(function (result) {
                    $scope.faces = result;
                    $scope.facesDisplayed = $scope.faces.slice(0, qtdItensInfiniteScroll);
                });
            }
            else {
                $scope.imovel.SqQuadra = null;
                $scope.imovel.NuQuadra = null;
                $scope.faces = $scope.facesDisplayed = [];
            }
            $scope.updateSelection(position, entities);
        }

        $scope.atualizaCondominio = function (position, entities) {
            $scope.imovel.SqCondominio = (entities[position].checked) ? entities[position].SqCondominio : null;
            $scope.updateSelection(position, entities);
        }

        $scope.atualizaSecao = function (position, entities) {
            $scope.imovel.SqSecao = (entities[position].checked) ? entities[position].SqSecao : null;
            $scope.updateSelection(position, entities);
        }

        $scope.atualizaFace = function (position, entities) {
            $scope.imovel.SqFace = (entities[position].checked) ? entities[position].SqFace : null;
            $scope.updateSelection(position, entities);
        }

        $scope.atualizaLoteamento = function (position, entities) {
            $scope.imovel.SqLoteamento = (entities[position].checked) ? entities[position].SqLoteamento : null;
            $scope.updateSelection(position, entities);
        }

        estadoService.obterEstados().then(function (result) {
            $scope.estados = result;
        });

        $scope.obterPaises = function () {
            if (!$scope.paises || $scope.paises.length <= 1) {
                return $timeout(function () {
                    return paisService.obterPaises().then(function (result) {
                        $scope.paises = result;
                        return result;
                    });
                }, 0);
            }
        };

        //op - 0 (contribuinte) 
        //op - 1 (responsável)
        $scope.cadastrarContribuinte = function (op) {
            document.getElementById("btnFAB").style.visibility = "hidden";
            $scope.$broadcast('panelContribuinte', { estados: $scope.estados, option: op });
        };

        //op - 0 (contribuinte) 
        //op - 1 (responsável)
        $scope.pesquisarContribuinte = function (op) {
            document.getElementById("btnFAB").style.visibility = "hidden";
            $scope.$broadcast('panelPesquisaContribuinte', { option: op });
        };

        $scope.panelAreaImovel = function (areaImovel, op) {
            $scope.exibePanel = true;
            document.getElementById("areaImovelFAB").style.visibility = "hidden";
            $scope.$broadcast('panelAreaImovel', { imovel: $scope.imovel, area: areaImovel, opcao: op, exibePanel: $scope.exibePanel});
        };



        $scope.removerAreaImovel = function (ev, areaImovel) {
            var confirm = $mdDialog.confirm()
                      .title('Deseja excluir a área do imóvel?')
                      .textContent('A área escolhida será removida do imóvel')
                      .ariaLabel('Remover Área')
                      .targetEvent(ev)
                      .ok('Sim, excluir área!')
                      .cancel('Não');

            $mdDialog.show(confirm).then(function () {
                let indexAreaSelecionada = $scope.areasImovel.findIndex(i => i.SqAreaimovel === areaImovel.SqAreaimovel);
                $scope.areasImovel.splice(indexAreaSelecionada, 1);
            });
        };

        $scope.salvarImovel = function (ev, op) {
            var confirm = $mdDialog.confirm()
                      .title('Deseja salvar o cadastro do imóvel?')
                      .textContent('Todos os dados cadastrados do imóvel serão adicionados!')
                      .ariaLabel('Salvar Imóvel')
                      .targetEvent(ev)
                      .ok('Sim, salvar imóvel!')
                      .cancel('Não');

            $mdDialog.show(confirm).then(function () {

                if ($scope.contribuinteResponsavel && $scope.contribuinteResponsavel.SqContribuinterecadastramento == $scope.contribuinte.SqContribuinterecadastramento) {
                    $scope.contribuinteResponsavel.SqContribuinterecadastramento++;
                }

                $scope.imovel.SqLogradouro                              = $scope.logradouro.SqLogradouro;
                $scope.imovel.SqBairro                                  = $scope.logradouro.SqBairro;
                $scope.imovel.SqContribuinte                            = $scope.contribuinte.SqContribuinte;
                $scope.imovel.SqContribuinterecadastramento             = $scope.contribuinte.SqContribuinterecadastramento;
                $scope.imovel.SqContribuinteresponsavel                 = ($scope.contribuinteResponsavel && $scope.contribuinteResponsavel.SqContribuinte) ?
                                                                            $scope.contribuinteResponsavel.SqContribuinte : null;
                $scope.imovel.SqContribuinterecadastramentoresponsavel  = ($scope.contribuinteResponsavel && $scope.contribuinteResponsavel.SqContribuinterecadastramento) ?
                                                                            $scope.contribuinteResponsavel.SqContribuinterecadastramento : null;
                $scope.imovel.SqAgenteimobiliario                       = $rootScope.parametroAgente.SqAgenteimobiliario;
                $scope.imovel.NuCnpj                                    = $rootScope.parametroAgente.NuCnpj;
                
                //Converte a data para um formato válido para exportação
                if ($scope.imovel.DtEscritura) {
                    let dtEscritura = new Date($scope.imovel.DtEscritura).toISOString();
                    dtEscritura = dtEscritura.split('T');
                    $scope.imovel.DtEscritura = dtEscritura[0];
                }

                //Contribuinte
                if ($scope.novoContribuinte) {
                    $scope.novoContribuinte.NuCpfcnpjcontribuinte   = o.removeMask($scope.novoContribuinte.NuCpfcnpjcontribuinte);
                    $scope.novoContribuinte.NuCelular               = o.removeMask($scope.novoContribuinte.NuCelular);
                    $scope.novoContribuinte.NuTelefone              = o.removeMask($scope.novoContribuinte.NuTelefone);
                    $scope.novoContribuinte.FlEditado               = 0;
                    contribuinteService.inserirContribuinte($scope.novoContribuinte);
                }
                else if ($scope.contribuinte.FlEditado) {
                    $scope.contribuinte.NuCpfcnpjcontribuinte   = o.removeMask($scope.contribuinte.NuCpfcnpjcontribuinte);
                    $scope.contribuinte.NuCelular               = o.removeMask($scope.contribuinte.NuCelular);
                    $scope.contribuinte.NuTelefone              = o.removeMask($scope.contribuinte.NuTelefone);
                    contribuinteService.editarContribuinte($scope.contribuinte, $scope.contribuinte.SqContribuinterecadastramento);
                }
                //Responsável
                if ($scope.novoContribuinteResponsavel) {
                    $scope.novoContribuinteResponsavel.NuCpfcnpjcontribuinte    = o.removeMask($scope.novoContribuinteResponsavel.NuCpfcnpjcontribuinte);
                    $scope.novoContribuinteResponsavel.NuCelular                = o.removeMask($scope.novoContribuinteResponsavel.NuCelular);
                    $scope.novoContribuinteResponsavel.NuTelefone               = o.removeMask($scope.novoContribuinteResponsavel.NuTelefone);
                    $scope.novoContribuinteResponsavel.FlEditado                = 0;
                    contribuinteService.inserirContribuinte($scope.novoContribuinteResponsavel);
                }
                else if ($scope.contribuinteResponsavel && $scope.contribuinteResponsavel.FlEditado) {
                    $scope.contribuinteResponsavel.NuCpfcnpjcontribuinte    = o.removeMask($scope.contribuinteResponsavel.NuCpfcnpjcontribuinte);
                    $scope.contribuinteResponsavel.NuCelular                = o.removeMask($scope.contribuinteResponsavel.NuCelular);
                    $scope.contribuinteResponsavel.NuTelefone               = o.removeMask($scope.contribuinteResponsavel.NuTelefone);
                    contribuinteService.editarContribuinte($scope.contribuinteResponsavel, $scope.contribuinteResponsavel.SqContribuinterecadastramento);
                }

                //Contribuinte novo e já exportado                               
                if ($scope.contribuinte.FlNovo)
                    $scope.imovel.FlNovoContribuinte = 1;
                else
                    $scope.imovel.FlNovoContribuinte = 0;

                //Contribuinte novo e já exportado                               
                if ($scope.contribuinteResponsavel && $scope.contribuinteResponsavel.FlNovo)
                    $scope.imovel.FlNovoResponsavel = 1;
                else
                    $scope.imovel.FlNovoResponsavel = 0;

                imovelService.obterSqImovelRecadMax().then(function (result) {
                    let sqImovelRecadMax = (result && result.length > 0) ? result[0].max : null;
                    $scope.imovel.NuPublico = o.obterInscricaoImobiliaria();
                    //Adiciona ou edita o imóvel
                    if ($routeParams.SqImovelrecadastramento != "0") {
                        if ($scope.imovel.FlModificado != 2) {
                            $scope.imovel.FlModificado = 1; // 0-sem alteração, 1-alterado, 2-novo
                        }
                        imovelService.editarImovel($scope.imovel, $scope.imovel.SqImovelrecadastramento);
                    }
                    else {
                        $scope.imovel.SqImovelrecadastramento = (sqImovelRecadMax && sqImovelRecadMax > 0) ? (sqImovelRecadMax + 1) : 1;
                        $scope.imovel.FlModificado = 2; // 0-sem alteração, 1-alterado, 2-novo
                        imovelService.inserirImovel($scope.imovel);
                    }

                    //Adiciona os fatores cadastrados ao imóvel inserido
                    let fatoresImovel = [];
                    for (let i = 0; i < $scope.tiposFatores.length; i++) {
                        if ($scope.tiposFatores[i].checked) {
                            fatoresImovel.push({
                                NuCnpj: $rootScope.parametroAgente.NuCnpj,
                                SqImovelrecadastramento: $scope.imovel.SqImovelrecadastramento,
                                SqFator: $scope.tiposFatores[i].SqFator,
                                SqTipofator: $scope.tiposFatores[i].SqTipofator
                            });
                        }
                    }
                    fatorimovelService.excluirFatoresImovel($scope.imovel.SqImovelrecadastramento).then(function (result) {
                        if (fatoresImovel.length > 0) {
                            fatorimovelService.inserirFatoresImovel(fatoresImovel);
                        }
                    });

                    //Adiciona as áreas do imóvel
                    for (let i = 0; i < $scope.areasImovel.length; i++) {
                        $scope.areasImovel[i].SqImovelrecadastramento = $scope.imovel.SqImovelrecadastramento;
                    }
                    if ($routeParams.SqImovelrecadastramento != "0") {
                        areaimovelService.excluirAreasImovel($scope.imovel.SqImovelrecadastramento).then(function (result) {
                            areaimovelService.inserirAreaImovel($scope.areasImovel);
                        });
                    }
                    else {
                        areaimovelService.inserirAreaImovel($scope.areasImovel);
                    }

                    //Adiciona ou edita os dados do entrevistado
                    if ($scope.entrevistado && $scope.entrevistado.flIncluirEntrevistado) {
                        if ($scope.entrevistado.SqImovelrecadastramento) {
                            entrevistadoService.editarEntrevistado($scope.entrevistado, $scope.entrevistado.SqImovelrecadastramento);
                        }
                        else {
                            $scope.entrevistado.SqImovelrecadastramento = $scope.imovel.SqImovelrecadastramento;
                            $scope.entrevistado.NuCnpj = $scope.imovel.NuCnpj;
                            $scope.entrevistado.SqAgenteimobiliario = $scope.imovel.SqAgenteimobiliario;
                            entrevistadoService.inserirEntrevistado($scope.entrevistado);
                        }
                    }
                    else {
                        entrevistadoService.excluirEntrevistado($scope.imovel.SqImovelrecadastramento);
                    }

                    o.salvarFotos();

                });
            });
        };

        //Controle da Wizard
        let infoFixedTabs = [
            "Contribuinte",
            "Responsável",
            "Distrito",
            "Setor",
            "Quadra",
            "Condomínio",
            "Seção",
            "Face",
            "Loteamento",
            "Localização",
            "Correspondência",
            "Escritura",
            "Dimensões",
            "Fotos",
            "Entrevistado",
            "Finalizar"
        ];
        $scope.disableNext = false;
        $scope.infoTab = infoFixedTabs[0].toUpperCase();
        $scope.currentNavIndex = 1;
        $scope.qtdAbasIniciais = 12;
        $scope.qtdAbasFinais = 4;

        $scope.nextTab = function (event) {
            let index = parseInt($scope.currentNavIndex);
            let totalAbas = $scope.tiposFatoresTab.length + $scope.qtdAbasIniciais + $scope.qtdAbasFinais;
            if (index < totalAbas) {
                $scope.currentNavIndex = index + 1;
            }
            o.setDisableNext();
            o.setInfoTab();
        };

        $scope.previousTab = function (event) {
            let index = parseInt($scope.currentNavIndex);
            if (index > 1) {
                $scope.currentNavIndex = index - 1;
            }
            o.setDisableNext();
            o.setInfoTab();
        };

        $scope.lastTab = function () {
            let totalAbas = $scope.tiposFatoresTab.length + $scope.qtdAbasIniciais + $scope.qtdAbasFinais;
            $scope.currentNavIndex = totalAbas;
            o.setDisableNext();
            o.setInfoTab();
        };

        $scope.firstTab = function () {
            $scope.currentNavIndex = 1;
            o.setDisableNext();
            o.setInfoTab();
        };

        this.setDisableNext = function () {
            let totalAbas = $scope.tiposFatoresTab.length + $scope.qtdAbasIniciais + $scope.qtdAbasFinais;
            $scope.disableNext = ($scope.currentNavIndex >= totalAbas);
        };

        this.setInfoTab = function () {
            if($scope.currentNavIndex <= $scope.qtdAbasIniciais){
                $scope.infoTab = infoFixedTabs[$scope.currentNavIndex - 1].toUpperCase();
            }
            else if ($scope.currentNavIndex > ($scope.qtdAbasIniciais + $scope.tiposFatoresTab.length)) {
                $scope.infoTab = infoFixedTabs[$scope.currentNavIndex - $scope.tiposFatoresTab.length - 1].toUpperCase();
            }
            else {
                $scope.infoTab = "FATOR";
            }
        };

        this.carregaDadosContribuinte = function (contribuinte, option) {
            if (contribuinte.CdPais) {
                $scope.paises = [];
                paisService.obterPais(contribuinte.CdPais).then(function (result) {
                    $scope.paises = result;
                });
            }

            if (contribuinte.CdMunicipio) {
                municipioService.obterMunicipio(contribuinte.CdMunicipio).then(function (result) {
                    if (option) {
                        $scope.municipiosResponsavel = [];
                        if (result && result.length > 0) {
                            $scope.municipioResponsavel = result[0];
                            $scope.municipiosResponsavel.push(result[0]);
                            $scope.verificaMunicipioResponsavelSelecionado($scope.municipioResponsavel.CdMunicipio);
                        }
                        else {
                            $scope.municipioResponsavel = null;
                            $scope.municipioResponsavelIgualDaUG = false;
                        }
                    }
                    else {
                        $scope.municipiosContribuinte = [];
                        if (result && result.length > 0) {
                            $scope.municipioContribuinte = result[0];
                            $scope.municipiosContribuinte.push(result[0]);
                            $scope.verificaMunicipioContribuinteSelecionado($scope.municipioContribuinte.CdMunicipio);
                        }
                        else {
                            $scope.municipioContribuinte = null;
                            $scope.municipioIgualDaUG = false;
                        }
                    }                    
                });
            }
            else {
                if (option) {
                    $scope.municipioResponsavel = {};
                }
                else {
                    $scope.municipioContribuinte = {};
                }
            }

            if (contribuinte.SqBairro && contribuinte.SqLogradouro) {
                logradouroService.obterLogradouro(contribuinte.SqBairro, contribuinte.SqLogradouro).then(function (result) {
                    if (option) {
                        $scope.logradourosResponsavel = [];
                        if (result && result.length > 0) {
                            $scope.logradouroResponsavel = result[0];
                            $scope.logradourosResponsavel.push($scope.logradouroResponsavel);
                            $scope.bairrosResponsavel = [{ SqBairro: $scope.logradouroResponsavel.SqBairro, NmBairro: $scope.logradouroResponsavel.NmBairro }];
                        }
                        else {
                            $scope.logradouroResponsavel = null;
                        }
                    }
                    else {
                        $scope.logradouros = [];
                        if (result && result.length > 0) {
                            $scope.logradouroContribuinte = result[0];
                            $scope.logradouros.push($scope.logradouroContribuinte);
                            $scope.bairros = [{ SqBairro: $scope.logradouroContribuinte.SqBairro, NmBairro: $scope.logradouroContribuinte.NmBairro }];
                        }
                        else {
                            $scope.logradouroContribuinte = null;
                        }
                    }
                    
                });
            }
            else {
                if (option) {
                    $scope.logradouroResponsavel = {};
                }
                else {
                    $scope.logradouroContribuinte = {};
                }
            }
        };        

        $scope.$on('imovelScope', function (event, args) {
            
            //Se option = 1, o contribuinte é o responsável pelo imóvel
            if (args.option) {
                if (args.contribuinte.FlAdicionar)
                    $scope.novoContribuinteResponsavel = args.contribuinte;
                else
                    $scope.novoContribuinteResponsavel = null;
                $scope.contribuinteResponsavel = args.contribuinte;
                $scope.contribuinteResponsavel.NuCpfcnpjcontribuinte = o.addMaskCpfCnpj($scope.contribuinteResponsavel.NuCpfcnpjcontribuinte);
                $scope.contribuinteResponsavel.NuCelular = o.addMaskTel($scope.contribuinteResponsavel.NuCelular);
                $scope.contribuinteResponsavel.NuTelefone = o.addMaskTel($scope.contribuinteResponsavel.NuTelefone);
            }
            else {
                if (args.contribuinte.FlAdicionar)
                    $scope.novoContribuinte = args.contribuinte;
                else
                    $scope.novoContribuinte = null;
                $scope.contribuinte = args.contribuinte;
                $scope.contribuinte.NuCpfcnpjcontribuinte = o.addMaskCpfCnpj($scope.contribuinte.NuCpfcnpjcontribuinte);
                $scope.contribuinte.NuCelular = o.addMaskTel($scope.contribuinte.NuCelular);
                $scope.contribuinte.NuTelefone = o.addMaskTel($scope.contribuinte.NuTelefone);
            }
            o.carregaDadosContribuinte(args.contribuinte, args.option);
            
        });

        $scope.$on('imovelScopeAreaImovel', function (event, args) {
            let area = args.areaImovel;
            if (area) {
                if (args.opcao == 'editar') {
                    let indexAreaEditada = $scope.areasImovel.findIndex(i => i.SqAreaimovel === area.SqAreaimovel);
                    $scope.areasImovel.splice(indexAreaEditada, 1);
                }
                else {
                    area.SqAreaimovel = $scope.areasImovel.length + 1;
                }
                $scope.areasImovel.push(area);
            }
        });

        this.preencherZerosAEsquerda = function (valor, qt) {
            let valorStr = valor.toString();
            if (valorStr.length < qt) {
                 let qtZeros = qt - valorStr.length;
                 for (let i = 0; i < qtZeros; i++) {
                     valorStr = '0' + valorStr;
                 }
            }
            return valorStr;
        };

        this.preencherZeros = function (qt) {
            let valorStr = '';
            for (let i = 0; i < qt; i++) {
                valorStr += '0';
            }
            return valorStr;
        };

        this.blobToBase64 = function (blob, cb) {
            var reader = new FileReader();
            reader.onload = function () {
                var dataUrl = reader.result;
                var base64 = dataUrl.split(',')[1];
                cb(base64);
            };
            reader.readAsDataURL(blob);
        };

        this.dataURItoBlob = function (dataURI) {
            let byteCharacters = window.atob(dataURI.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
            let byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters
                        .charCodeAt(i);
            }
            let byteArray = new Uint8Array(byteNumbers);
            let blob = new Blob([byteArray], {
                type: 'image/jpeg'
            });

            return blob;
        };

        this.salvarFotos = function () {
            fotoimovelService.excluirFotosImovel($scope.imovel.SqImovelrecadastramento).then(function (result) {
                if ($scope.images.length > 0) {
                    let foto = {};
                    let fotosImovel = [];
                    for (let i = 0; i < $scope.images.length; i++) {
                        foto = $scope.images[i];
                        foto.SqImovelrecadastramento = $scope.imovel.SqImovelrecadastramento;
                        foto.Imagem = $scope.images[i].Imagem; //o.dataURItoBlob($scope.images[i].src);
                        fotosImovel.push(foto);
                    }
         
                    return fotoimovelService.inserirFotosImovel(fotosImovel).then(function () {
                        window.history.go(-2);
                    });
                }
                else {
                    window.history.go(-2);
                }
            });
            
        };

        this.addMaskCpfCnpj = function (number) {
            if (number) {
                number = number.replace(/[^0-9]+/g, "");
                if (number.length == 11) {
                    number = number.substring(0, 3) + "." + number.substring(3, 6) + "." + number.substring(6, 9) + "-" + number.substring(9, 11);
                }
                else if (number.length == 14) {
                    number = number.substring(0, 2) + "." + number.substring(2, 5) + "." + number.substring(5, 8) + "/" + number.substring(8, 12) + "-" + number.substring(12, 14);
                }
                return number;
            }
            else
                return null;
            
        };
                      
        this.removeMask = function (number) {
            if (number) {
                number = number.replace(/[^0-9]+/g, "");
                return number;
            }
            else
                return null;
        };

        this.addMaskTel = function (number) {
            if (number) {
                number = number.replace(/\D/g, '');
                if (number.length === 11) {
                    number = number.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                } else {
                    number = number.replace(/^(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                }
                return number;
            }
            else
                return null;
            
        };

        this.obterInscricaoImobiliaria = function () {
            let formula = $rootScope.parametroAgente.DsFormulanumpublico;
            let inscricaoImob = "";
            let limiteQt = 0;
            let qt = 0;
            for (let i = 0; i < formula.length; i++) {
                switch (formula[i]) {
                    case 'T':
                        limiteQt = formula.indexOf(')', i);
                        qt = formula.substring(i + 3, limiteQt);
                        if ($scope.imovel.NuSetor) {
                            inscricaoImob += o.preencherZerosAEsquerda($scope.imovel.NuSetor, qt);
                        }
                        else
                        {
                            inscricaoImob += o.preencherZeros(qt);
                        }
                        break;
                    case 'R':
                        limiteQt = formula.indexOf(')', i);
                        qt = formula.substring(i + 3, limiteQt);
                        if ($scope.imovel.NuQuadra) {
                            inscricaoImob += o.preencherZerosAEsquerda($scope.imovel.NuQuadra, qt);
                        }
                        else
                        {
                            inscricaoImob += o.preencherZeros(qt);
                        }
                        break;
                    case 'D':
                        limiteQt = formula.indexOf(')', i);
                        qt = formula.substring(i + 3, limiteQt);
                        if ($scope.imovel.SqDistrito) {
                            inscricaoImob += o.preencherZerosAEsquerda($scope.imovel.SqDistrito, qt);
                        }
                        else {
                            inscricaoImob += o.preencherZeros(qt);
                        }
                        break;
                    case 'S':
                        limiteQt = formula.indexOf(')', i);
                        qt = formula.substring(i + 3, limiteQt);
                        if ($scope.imovel.SqSetor) {
                            inscricaoImob += o.preencherZerosAEsquerda($scope.imovel.SqSetor, qt);
                        }
                        else {
                            inscricaoImob += o.preencherZeros(qt);
                        }
                        break;
                    case 'Q':
                        limiteQt = formula.indexOf(')', i);
                        qt = formula.substring(i + 3, limiteQt);
                        if ($scope.imovel.SqQuadra) {
                            inscricaoImob += o.preencherZerosAEsquerda($scope.imovel.SqQuadra, qt);
                        }
                        else {
                            inscricaoImob += o.preencherZeros(qt);
                        }
                        break;
                    case 'L':
                        limiteQt = formula.indexOf(')', i);
                        qt = formula.substring(i + 3, limiteQt);
                        if ($scope.imovel.NuLote) {
                            inscricaoImob += o.preencherZerosAEsquerda($scope.imovel.NuLote, qt);
                        }
                        else {
                            inscricaoImob += o.preencherZeros(qt);
                        }
                        break;
                    case 'U':
                        limiteQt = formula.indexOf(')', i);
                        qt = formula.substring(i + 3, limiteQt);
                        if ($scope.imovel.NuUnidade) {
                            inscricaoImob += o.preencherZerosAEsquerda($scope.imovel.NuUnidade, qt);
                        }
                        else {
                            inscricaoImob += o.preencherZeros(qt);
                        }
                        break;
                    case 'B':
                        limiteQt = formula.indexOf(')', i);
                        qt = formula.substring(i + 3, limiteQt);
                        if ($scope.imovel.SqBairro) {
                            inscricaoImob += o.preencherZerosAEsquerda($scope.imovel.SqBairro, qt);
                        }
                        else {
                            inscricaoImob += o.preencherZeros(qt);
                        }
                        break;
                    case 'G':
                        limiteQt = formula.indexOf(')', i);
                        qt = formula.substring(i + 3, limiteQt);
                        if ($scope.imovel.SqLogradouro) {
                            inscricaoImob += o.preencherZerosAEsquerda($scope.imovel.SqLogradouro, qt);
                        }
                        else {
                            inscricaoImob += o.preencherZeros(qt);
                        }
                        break;
                    case 'N':
                        limiteQt = formula.indexOf(')', i);
                        qt = formula.substring(i + 3, limiteQt);
                        if ($scope.imovel.NuLogradouro) {
                            inscricaoImob += o.preencherZerosAEsquerda($scope.imovel.NuLogradouro, qt);
                        }
                        else {
                            inscricaoImob += o.preencherZeros(qt);
                        }
                        break;
                    case 'I':
                        limiteQt = formula.indexOf(')', i);
                        qt = formula.substring(i + 3, limiteQt);
                        if ($scope.imovel.SqImovelrecadastramento) {
                            inscricaoImob += o.preencherZerosAEsquerda($scope.imovel.SqImovelrecadastramento, qt);
                        }
                        else {
                            inscricaoImob += o.preencherZeros(qt);
                        }
                        break;
                    case '.':
                        inscricaoImob += formula[i];
                        break;
                    case ' ':
                        inscricaoImob += formula[i];
                        break;
                }                
            }
            return inscricaoImob;

        };

        //$scope.obterBairros = function (CdMunicipio) {
        //    return $timeout(function () {
        //        if ((CdMunicipio === $rootScope.parametroAgente.CdMunicipio) && ($scope.bairros.length <= 1)) {
        //            return bairroService.obterBairros().then(function (result) {
        //                $scope.bairros = result;
        //            });
        //        }
                
        //    }, 0);
        //};

        $scope.obterBairros = function (CdMunicipio, array) {
            return $timeout(function () {
                if ((CdMunicipio === $rootScope.parametroAgente.CdMunicipio) && (array.length <= 1)) {
                    return bairroService.obterBairros().then(function (result) {
                        array = result;
                    });
                }

            }, 0);
        };

        //$scope.obterLogradouros = function (SqBairro) {
        //    return $timeout(function () {
        //        if (SqBairro) {
        //            logradouroService.obterLogradouroPorBairro(SqBairro).then(function (result) {
        //                $scope.logradouros = result;
        //            });
        //        }
        //    }, 0);
        //};

        $scope.obterLogradouros = function (SqBairro, array) {
            return $timeout(function () {
                if (SqBairro) {
                    logradouroService.obterLogradouroPorBairro(SqBairro).then(function (result) {
                        array = result;
                    });
                }
            }, 0);
        };

        $scope.obterMunicipiosCorrespondencia = function (SgUf) {
            $scope.imovel.CdMunicipio = null;
            return $timeout(function () {
                if (SgUf && ($scope.municipiosCorrespondencia.length <= 1)) {
                    return municipioService.obterMunicipiosPorUf(SgUf).then(function (result) {
                        $scope.municipiosCorrespondencia = result;
                    });
                }
                else {
                    return $scope.municipiosCorrespondencia;
                }
            }, 0);
        };

        $scope.obterMunicipiosContribuinte = function (SgUf) {
            $scope.contribuinte.CdMunicipio = null;
            return $timeout(function () {
                if (SgUf && ($scope.municipiosContribuinte.length <= 1)) {
                    return municipioService.obterMunicipiosPorUf(SgUf).then(function (result) {
                        $scope.municipiosContribuinte = result;
                    });
                }
                else {
                    return $scope.municipiosContribuinte;
                }
            }, 0);
        };

        $scope.obterMunicipiosResponsavel = function (SgUf) {
            $scope.contribuinteResponsavel.CdMunicipio = null;
            return $timeout(function () {
                if (SgUf && ($scope.municipiosResponsavel.length <= 1)) {
                    return municipioService.obterMunicipiosPorUf(SgUf).then(function (result) {
                        $scope.municipiosResponsavel = result;
                    });
                }
                else {
                    return $scope.municipiosResponsavel;
                }

            }, 0);
            

        };

        $scope.verificaPaisCorrespodenciaSelecionado = function () {
            if ($scope.imovel.CdPais != 76) {
                $scope.municipioCorrespondencia.SgUf = $scope.imovel.CdMunicipio = null;
            }
        };

        $scope.verificaPaisContribuinteSelecionado = function () {
            if ($scope.contribuinte.CdPais != 76) {
                $scope.municipioContribuinte.SgUf = $scope.contribuinte.CdMunicipio = null;
                $scope.municipioIgualDaUG = false;
            }
        };

        $scope.verificaPaisResponsavelSelecionado = function () {
            if ($scope.contribuinteResponsavel.CdPais != 76) {
                $scope.municipioResponsavel.SgUf = $scope.contribuinteResponsavel.CdMunicipio = null;
                $scope.municipioResponsavelIgualDaUG = false;
            }
        };

        $scope.verificaEstadoCorrespondenciaSelecionado = function () {
            if ($scope.municipiosCorrespondencia.length > 0 && ($scope.municipioCorrespondencia.SgUf != $scope.municipiosCorrespondencia[0].SgUf)) {
                $scope.imovel.CdMunicipio = null;
                $scope.municipiosCorrespondencia = [];
            }
            
        };

        $scope.verificaEstadoContribuinteSelecionado = function () {
            if ($scope.municipiosContribuinte.length > 0 && ($scope.municipioContribuinte.SgUf != $scope.municipiosContribuinte[0].SgUf)) {
                $scope.contribuinte.CdMunicipio = null;
                $scope.bairros = $scope.logradouros = $scope.municipiosContribuinte = [];
                $scope.municipioIgualDaUG = false;
            }
        };

        $scope.verificaEstadoResponsavelSelecionado = function () {
            if ($scope.municipiosResponsavel.length > 0 && ($scope.municipioResponsavel.SgUf != $scope.municipiosResponsavel[0].SgUf)) {
                $scope.contribuinteResponsavel.CdMunicipio = null;
                $scope.bairrosResponsavel = $scope.logradourosResponsavel = $scope.municipiosResponsavel = [];
                $scope.municipioResponsavelIgualDaUG = false;
            }
        };

        $scope.verificaMunicipioContribuinteSelecionado = function (cdMunicipio) {
            $scope.municipioIgualDaUG = (cdMunicipio === $rootScope.parametroAgente.CdMunicipio);
        };

        $scope.verificaMunicipioResponsavelSelecionado = function (cdMunicipio) {
            $scope.municipioResponsavelIgualDaUG = (cdMunicipio === $rootScope.parametroAgente.CdMunicipio);
        };
      
        $scope.verificaBairroContribuinteSelecionado = function () {
            $scope.logradouros = [];
        };

        $scope.verificaBairroResponsavelSelecionado = function () {
            $scope.logradourosResponsavel = [];
        };

        $scope.obterLocalizacao = function () {
            if ($scope.imovel.cbCoordenadas) {
                $scope.loadingLocation = true;
                let positionOptions = { timeout: 3000, enableHighAccuracy: true };
                navigator.geolocation.getCurrentPosition(function (pos) {
                    $scope.loadingLocation = false;
                    $scope.imovel.NuLatitude = pos.coords.latitude;
                    $scope.imovel.NuLongitude = pos.coords.longitude;
                    $scope.initMap(pos.coords.latitude, pos.coords.longitude)
                   
                }, function (err) {
                    $scope.imovel.cbCoordenadas = false;
                    $scope.loadingLocation = false;
                    $scope.$apply();
                    $mdDialog.show(
                      $mdDialog.alert()
                        .clickOutsideToClose(false)
                        .escapeToClose(false)
                        .title('Atenção')
                        .textContent('Falha ao obter a localização. Verifique se o GPS do aparelho está ativo ou se está conectado à Internet.')
                        .ariaLabel('Localização do Imóvel')
                        .ok('  OK  ')
                    );
                    
                }, positionOptions);
            }
            else {
                $scope.loadingLocation = false;
                $scope.imovel.NuLatitude = '';
                $scope.imovel.NuLongitude = '';
            }
        };

        $scope.initMap = function (NuLatitude, NuLongitude) {
            let latitude = Number(NuLatitude);
            let longitude = Number(NuLongitude);
            window.scrollTo(0, 0);

            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'rimob/imovel/views/localizacaoImovel.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: false, // Only for -xs, -sm breakpoints.
                locals: {
                    lat: latitude,
                    lng: longitude
                },
                onComplete: function () {
                    let myLatLng = { lat: latitude, lng: longitude };

                    // Create a map object and specify the DOM element for display.
                    let map = new google.maps.Map(document.getElementById('map'), {
                        center: myLatLng,
                        zoomControl: true,
                        scaleControl: true,
                        zoom: 20,
                        mapTypeControl: true,
                        streetViewControl: true,
                        fullscreenControl: true
                    });

                    // Create a marker and set its position.
                    let marker = new google.maps.Marker({
                        map: map,
                        position: myLatLng,
                        title: 'Localização do imóvel'
                    });
                }
            });


        };

        function DialogController($scope, $mdDialog, lat, lng) {
            $scope.lat = lat;
            $scope.lng = lng;
            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };
        }

        //Infinite Scroll
        let totalItemsScroll = 20;
        let lastScrollTop = 0;
     
        this.addItems = function(startIndex, endIndex, obj, objDisplayed, _method) {
            for (let i = startIndex; i < endIndex; ++i) {
                objDisplayed[_method](obj[i]);
            }
        };

        this.appendItems = function(startIndex, endIndex, obj, objDisplayed) {
            o.addItems(startIndex, endIndex, obj, objDisplayed, 'push');
        };

        $scope.infiniteScroll = function (obj, objDisplayed) {
            if (obj && obj.length > 0) {
                let st           = window.pageYOffset || document.documentElement.scrollTop;
                totalItemsScroll = objDisplayed.length;
                //Down Scroll
                if ((st > lastScrollTop)) {
                    totalItemsScroll += 10;
                    if (totalItemsScroll > obj.length) {
                        totalItemsScroll = obj.length;
                    }
                    o.appendItems(objDisplayed.length, totalItemsScroll, obj, objDisplayed);
                }               
                lastScrollTop = (st <= 0) ? 0 : st;
            }
        };
    }]);

angular.module("Rimob")
    .controller('panelCtrl', ['$scope', '$rootScope', '$element', '$mdDialog', '$timeout', 'panels', 'logradouroService', 'bairroService',
                              'municipioService', 'contribuinteService', 'areaimovelService', 'paisService', function (
                               $scope, $rootScope, $element, $mdDialog, $timeout, panels, logradouroService, bairroService,
                               municipioService, contribuinteService, areaimovelService, paisService) {

        $scope.municipios = [];
        $scope.municipio = {};
        $scope.bairros = [];
        $scope.logradouros = [];
        $scope.novaAreaImovel = {};
        $scope.imovel = [];
        $scope.forms = {};
        $scope.option = 0;
        $scope.paises = [{ CdPais: 76, NmPais: 'Brasil', SgPais: 'BR' }];
        $scope.novoContribuinte = {};
        $scope.novoContribuinte.CdPais = 76;  //Atribuindo o País padrão como Brasil
        $scope.novoContribuinteResponsavel = {};

        $scope.$on('panelContribuinte', function (event, args) {
            $scope.estados = args.estados;
            $scope.exibePanel = true;
            $scope.option = args.option;
            $scope.novoContribuinte = {};
            $scope.novoContribuinte.CdPais = 76;  //Atribuindo o País padrão como Brasil
            panels.open("panelNovoContrib");
        });

        $scope.$on('panelPesquisaContribuinte', function (event, args) {
            $scope.exibePanel = true;
            $scope.option = args.option;
            panels.open("panelPesquisaContrib");
        });

        $scope.obterContribuintes = function (dsBusca) {
            return contribuinteService.obterContribuintesBusca(dsBusca);
        };

        $scope.$on('panelAreaImovel', function (event, args) {
            $scope.imovel = args.imovel;
            $scope.opcao = args.opcao;
            $scope.exibePanel = true;
            $scope.currentNavItem = 'pgTerreno';
            $scope.novaAreaImovel = (args.opcao == 'incluir') ? {} : angular.copy(args.area);
            $scope.novaAreaImovel.FlIrregular = $scope.novaAreaImovel.FlIrregular ? $scope.novaAreaImovel.FlIrregular : '0';
            panels.open("panelNovaAreaImovel");

        });

        $scope.obterMunicipios = function (SgUf) {
            $scope.novoContribuinte.CdMunicipio = null;
            return $timeout(function () {
                if (SgUf && ($scope.municipios.length <= 1)) {
                    return municipioService.obterMunicipiosPorUf(SgUf).then(function (result) {
                        $scope.municipios = result;
                    });
                }
                else {
                    return $scope.municipios;
                }
            }, 0);
        };


        $scope.obterBairros = function (CdMunicipio) {
            if (CdMunicipio === $rootScope.parametroAgente.CdMunicipio) {
                bairroService.obterBairros().then(function (result) {
                    $scope.bairros = result;
                });
            }
            else {
                $scope.bairros = [];
                $scope.logradouros = [];
            }

        };

        $scope.obterLogradouros = function (SqBairro) {
            if (SqBairro) {
                logradouroService.obterLogradouroPorBairro(SqBairro).then(function (result) {
                    $scope.logradouros = result;
                });
            }
            else {
                $scope.logradouros = [];
            }
            
        };

        //pesquisa no md-select
        $scope.searchTerm;
        $scope.clearSearchTerm = function () {
            $scope.searchTerm = '';
        };
        $element.find('input').on('keydown', function (ev) {
            ev.stopPropagation();
        });

        $scope.salvarContribuinte = function () {
            let vm = this;
            contribuinteService.obterSqContribuinteRecadMax()
            .then(function (result) {
                let sqContribuinteRecad = (result[0] && result[0].max && result[0].max > 0) ? (result[0].max + 1) : 1;
                let t = $scope.contribuinteResponsavel;
                $scope.novoContribuinte.SqContribuinterecadastramento = sqContribuinteRecad;
                $scope.novoContribuinte.SqAgenteimobiliario = $rootScope.parametroAgente.SqAgenteimobiliario;
                $scope.novoContribuinte.NuCnpj = $rootScope.parametroAgente.NuCnpj;
                $scope.novoContribuinte.FlAdicionar = true;

                //Enviando o contribuinte inserido para o imovelCtrl
                $rootScope.$broadcast('imovelScope', { contribuinte: $scope.novoContribuinte, option: $scope.option });
                vm.close();
            });
        };

        $scope.selecionarContribuinte = function (contribuinteSelecionado) {
            if (contribuinteSelecionado) {
                contribuinteSelecionado.FlAdicionar = false;
                //Enviando o contribuinte pesquisado para o imovelCtrl
                $rootScope.$broadcast('imovelScope', { contribuinte: contribuinteSelecionado, option: $scope.option });
                this.close();
            }
        };

        $scope.calcularAreasImovel = function () {
            if (!$scope.novaAreaImovel.FlIrregular || $scope.novaAreaImovel.FlIrregular == '0') {
                $scope.novaAreaImovel.VlTotalterreno = (($scope.novaAreaImovel.VlFrenteterreno + $scope.novaAreaImovel.VlFundoterreno) / 2) *
                                             (($scope.novaAreaImovel.VlLadoesquerdoterreno + $scope.novaAreaImovel.VlLadodireitoterreno) / 2);
                $scope.novaAreaImovel.VlTotalconstruido = (($scope.novaAreaImovel.VlFrenteconstrucao + $scope.novaAreaImovel.VlFundoconstrucao) / 2) *
                                     (($scope.novaAreaImovel.VlLadoesquerdoconstrucao + $scope.novaAreaImovel.VlLadodireitoconstrucao) / 2);
            }
        };

        $scope.salvarAreaImovel = function (areaImovel) {
            if ($scope.forms.terrenoForm.$invalid || $scope.forms.construidaForm.$invalid || $scope.forms.descAreaForm.$invalid) {
                 $mdDialog.show(
                      $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('Aviso')
                        .textContent('Os campos obrigatórios devem ser preenchidos!')
                        .ariaLabel('Aviso Campos Obrigatórios')
                        .ok('Ok')
                    );
            }
            else {
                if (areaImovel) {
                    areaImovel.NuCnpj = $rootScope.parametroAgente.NuCnpj;
                    $rootScope.$broadcast('imovelScopeAreaImovel', { areaImovel: areaImovel, opcao: $scope.opcao });
                }
                $scope.forms.terrenoForm.$setUntouched();
                $scope.forms.construidaForm.$setUntouched();
                $scope.forms.descAreaForm.$setUntouched();
                this.close();
            }
            
        };

        $scope.obterPaises = function () {
            if (!$scope.paises || $scope.paises.length <= 1) {
                return $timeout(function () {
                    return paisService.obterPaises().then(function (result) {
                        $scope.paises = result;
                        return result;
                    });
                }, 0);
            }
        };


        $scope.verificaEstadoSelecionado = function () {
            if ($scope.municipios.length > 0 && ($scope.municipio.SgUf != $scope.municipios[0].SgUf)) {
                $scope.novoContribuinte.CdMunicipio = null;
                $scope.municipios = [];
            }

        };

        $scope.verificaPaisSelecionado = function () {
            if ($scope.novoContribuinte.CdPais != 76) {
                $scope.municipio.SgUf = $scope.novoContribuinte.CdMunicipio = null;
            }
        };

        $scope.close = function () {
            $scope.exibePanel = false;
            panels.close();
        };

        $scope.closeArea = function () {
            $scope.close();
        };

        $scope.panelClose = function () {
            document.getElementById("btnFAB").style.visibility = "visible";
            document.getElementById("areaImovelFAB").style.visibility = "visible";
            
        };
    }]);