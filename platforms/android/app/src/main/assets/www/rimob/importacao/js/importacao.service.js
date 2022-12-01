angular.module("Rimob")
    .service("importacaoService", ["$dbOff", function ($dbOff) {
        this.obterImportacoes = function () {
            return $dbOff.selectAll("Importacao");
        };

        this.obterImportacoesNaoRealizadas = function () {
            return $dbOff.selectAll("Importacao", options = {
                where: "FlImportada = ?",
                parameters: [0]
            });
        };

    }]);