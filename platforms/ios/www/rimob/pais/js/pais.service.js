angular.module("Rimob")
    .service("paisService", ["$dbOff", function ($dbOff) {

        this.obterPaises = function () {
            return $dbOff.selectAll("Pais", options = { orderby: "NmPais asc" });
        };

        this.obterPais = function (CdPais) {
            return $dbOff.selectAll("Pais", options = {
                where: "CdPais = ?",
                parameters: [CdPais]
            });
        };

    }]);