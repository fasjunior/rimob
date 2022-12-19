angular.module("Rimob")
    .service("distritoService", ["$dbOff", function ($dbOff) {
        this.obterDistritos = function () {
            return $dbOff.selectAll("Distrito");
        };
    }]);