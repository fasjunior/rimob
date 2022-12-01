angular.module("Rimob")
    .service("condominioService", ["$dbOff", function ($dbOff) {
        this.obterCondominios = function () {
            return $dbOff.selectAll("Condominio");
        };
    }]);