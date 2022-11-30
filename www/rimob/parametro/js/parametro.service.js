angular.module("Rimob")
    .service("parametroService", ["$dbOff", function ($dbOff) {
        this.obterParametro = function () {
            return $dbOff.selectAll("Parametro");
        };

        this.excluirParametro = function () {
            return $dbOff.delete("Parametro");
        };

        this.inserirParametro = function (Parametro) {
            return $dbOff.insert("Parametro", [Parametro]);
        };

        this.atualizarSqImovelRecadastramentoMax = function (SqImovelrecadastramentomax) {
            return $dbOff.update("Parametro", options = {
                set: "SqImovelrecadastramentomax = ?",
                parametersSet: [SqImovelrecadastramentomax]
            });
        };
    }]);