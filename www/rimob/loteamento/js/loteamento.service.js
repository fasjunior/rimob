angular.module("Rimob")
    .service("loteamentoService", ["$dbOff", function ($dbOff) {
        this.obterLoteamentos = function () {
            return $dbOff.selectAll("Loteamento");
        };
    }]);