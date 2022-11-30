angular.module("Rimob")
    .service("notificacaoService", ["$dbOff", function ($dbOff) {
        this.obterNotificacoesPorTipo = function (TpNotificacao) {
            return $dbOff.selectAll("Notificacao", options = {
                where: "TpNotificacao = ?",
                parameters: [TpNotificacao]
            });
        };

        this.obterNotificacao = function (TpNotificacao, SqNotificacao) {
            return $dbOff.selectAll("Notificacao", options = {
                where: "TpNotificacao = ? and SqNotificacao = ?",
                parameters: [TpNotificacao, SqNotificacao]
            });
        };

        this.apagarNotificacao = function (TpNotificacao, SqNotificacao) {
            return $dbOff.delete("Notificacao", options = {
                where: "TpNotificacao = ? and SqNotificacao = ?",
                parameters: [TpNotificacao, SqNotificacao]
            });
        };

        this.apagarNotificacoes = function (TpNotificacao, SqsNotificacao) {
            return $dbOff.delete("Notificacao", options = {
                where: "TpNotificacao = ? and SqNotificacao in ?",
                parameters: [TpNotificacao, SqsNotificacao]
            });
        };

        this.obterNotificacoes = function () {
            return $dbOff.selectAll("Notificacao", options = { orderby: "TpNotificacao asc" });
        };

        this.inserirNotificacao = function (notificacao) {
            return $dbOff.insert("Notificacao", [notificacao]);
        };

        this.atualizarNotificacao = function (TpNotificacao, FlLida) {
            $dbOff.update("Notificacao", options = {
                set: "FlLida = ?",
                parametersSet: [FlLida],
                where: "TpNotificacao = ?",
                parameters: [TpNotificacao]
            });
        };

    }]);