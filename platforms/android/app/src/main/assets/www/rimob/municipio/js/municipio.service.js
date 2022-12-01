angular.module("Rimob")
    .service("municipioService", ["$dbOff", function ($dbOff) {
        this.obterMunicipio = function (CdMunicipio) {
            return $dbOff.selectAll("Municipio", options = {
                where: "CdMunicipio like '%?%'",
                parameters: [CdMunicipio]
            });
        };

        this.obterMunicipiosPorUf = function (SgUf) {
            return $dbOff.selectAll("Municipio", options = {
                where: "SgUf like '%?%'",
                parameters: [SgUf]
            });
        };

        this.obterMunicipios = function () {
            return $dbOff.selectAll("Municipio", options = { orderby: "CdMunicipio asc" });

        };

    }]);