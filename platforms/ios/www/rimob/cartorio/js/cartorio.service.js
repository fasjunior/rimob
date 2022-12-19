angular.module("Rimob")
    .service("cartorioService", ["$dbOff", function ($dbOff) {
        this.obterCartorios = function () {
            return $dbOff.selectAll("Cartorio");
        };
    }]);