angular.module("Rimob")
    .controller("mensagemCtrl", ["$scope", "$rootScope", "$route", "$routeParams", "$location", "$mdDialog", "notificacaoService", function ($scope, $rootScope, $route, $routeParams, $location, $mdDialog, notificacaoService) {
        $scope.cbSelecionaTodas = false;
        $scope.mensagens = [];
        $scope.qtdMsgSelecionadas = 0;
        $scope.obterMensagens = function () {
            notificacaoService.obterNotificacoesPorTipo(3).then(function (result) {
                $scope.mensagens = result;
            });
        };

        $scope.obterMensagem = function () {
            notificacaoService.obterNotificacao(3, $routeParams.SqNotificacao).then(function (result) {
                $scope.mensagem = result[0];
            });
        };

        $scope.selecionaTodas = function () {
            $scope.cbSelecionaTodas = !$scope.cbSelecionaTodas;
            if ($scope.cbSelecionaTodas) {
                $scope.qtdMsgSelecionadas = $scope.mensagens.length;
                document.getElementById("cbSelecionaTodas").className ="fa fa-check-square-o";
            }
            else {
                $scope.qtdMsgSelecionadas = 0;
                document.getElementById("cbSelecionaTodas").className = "fa fa-square-o";
            }
            for (let i = 0; i < $scope.mensagens.length; i++) {
                if ($scope.cbSelecionaTodas) {
                    $scope.mensagens[i].checked = true;
                }
                else {
                    $scope.mensagens[i].checked = false;
                }
                
            }            
        };

        $scope.apagarMensagem = function (SqNotificacao) {
            let confirm = $mdDialog.confirm()
                     .title('Deseja apagar esta mensagem?')
                    // .textContent('O Rimob irá remover a mensagens selecionadas.')
                     .ariaLabel('Excluir mensagem')
                     //.targetEvent(ev)
                     .ok('Sim, excluir!')
                     .cancel('Não');

            $mdDialog.show(confirm).then(function () {
                notificacaoService.apagarNotificacao(3, SqNotificacao).then(function () {
                    $location.path('/mensagem');
                });
            });
           
        };

        $scope.apagarMensagens = function (mensagens) {
            let confirm = $mdDialog.confirm()
                     .title('Atenção!')
                     .textContent('O Rimob irá remover todas as mensagens selecionadas.')
                     .ariaLabel('Excluir mensagens')
                     //.targetEvent(ev)
                     .ok('Sim, excluir!')
                     .cancel('Não');

            $mdDialog.show(confirm).then(function () {
                let sqsNotificacoes = [];
                for (let i = 0; i < mensagens.length; i++) {
                    if (mensagens[i].checked) {
                        sqsNotificacoes.push(mensagens[i].SqNotificacao);
                    }
                }
                notificacaoService.apagarNotificacoes(3, sqsNotificacoes).then(function () {
                    $route.reload();
                });
            });
            
        };

        $scope.selecionaMensagem = function (msg) {
            if(msg.checked){
                $scope.qtdMsgSelecionadas++;
            }                
            else {
                $scope.qtdMsgSelecionadas--;
            }
        };

    }]);