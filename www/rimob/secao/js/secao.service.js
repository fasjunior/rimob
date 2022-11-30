angular.module("Rimob")
    .service("secaoService", ["$dbOff", function ($dbOff) {
        this.obterSecoes = function () {
            return $dbOff.selectAll("Secao");
        };
    }]);