angular.module("Rimob")
    .service("entrevistadoService", ["$dbOff", function ($dbOff) {
        this.obterEntrevistados = function () {
            return $dbOff.selectAll("Entrevistado");
        };

        this.obterEntrevistado = function (SqImovelRecad) {
            return $dbOff.selectAll("Entrevistado", options = {
                where: "SqImovelrecadastramento = ?",
                parameters: [SqImovelRecad]
            });
        };

        this.inserirEntrevistado = function (Entrevistado) {
            return $dbOff.insert("Entrevistado", [Entrevistado]);
        };

        this.editarEntrevistado = function (Entrevistado, SqImovelrecadastramento) {
            return $dbOff.update("Entrevistado", options = {
                where: "SqImovelrecadastramento = ?",
                parameters: [SqImovelrecadastramento],
                object: Entrevistado
            });
        };

        this.excluirEntrevistado = function (SqImovelrecadastramento) {
            return $dbOff.delete("Entrevistado", options = {
                where: "SqImovelrecadastramento = ?",
                parameters: [SqImovelrecadastramento]
            });
        };
    }]);