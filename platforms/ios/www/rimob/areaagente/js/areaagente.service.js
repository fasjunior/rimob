angular.module("Rimob")
    .service("areaagenteService", ["$dbOff", function ($dbOff) {
        this.obterAreasAgente = function () {
            return $dbOff.selectAll("Area_Agente", options = { orderby: "SqBairro asc" });
        };

        this.obterAreasAgentePorBairro = function (SqBairro) {
            return $dbOff.selectAll("Area_Agente", options = {
                where: "SqBairro = ?",
                parameters: [SqBairro],
                orderby: "SqLogradouro asc"
            });
        };

    }]);