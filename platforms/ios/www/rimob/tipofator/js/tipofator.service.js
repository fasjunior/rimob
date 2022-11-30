angular.module("Rimob")
    .service("tipofatorService", ["$dbOff", function ($dbOff) {
        this.obterTiposFatores = function (SqTipoimovel) {
            return $dbOff.selectAll("Tipo_Fator", options = {
                where: "SqTipoimovel = ?",
                parameters: [SqTipoimovel]
            });
        };
    }]);