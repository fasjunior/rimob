angular.module("Rimob")
    .service("estadoService", ["$dbOff", function ($dbOff) {

        this.obterEstados = function () {
            return $dbOff.selectAll("Estado", options = { orderby: "NmEstado asc" });

        };

    }]);