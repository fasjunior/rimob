angular.module("Rimob")
    .service("exportacaoService", ["$dbOff", function ($dbOff) {
        this.obterExportacoes = function () {
            return $dbOff.selectAll("Exportacao");
        };

        this.obterExportacoesNaoRealizadas = function () {
            return $dbOff.selectAll("Exportacao", options = {
                where: "FlExportada = ?",
                parameters: [0]
            });
        };

    }]);