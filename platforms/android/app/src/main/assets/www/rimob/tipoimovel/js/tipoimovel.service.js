angular.module("Rimob")
    .service("tipoimovelService", ["$dbOff", function ($dbOff) {
        this.obterTiposImovel = function () {
            return $dbOff.selectAll("Tipo_Imovel");
        };

        this.obterTipoImovel = function (SqTipoimovel) {
            return $dbOff.selectAll("Tipo_Imovel", options = {
                where: "SqTipoimovel = ?",
                parameters: [SqTipoimovel]
            });
        };
    }]);