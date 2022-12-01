angular.module("Rimob")
    .service("setorService", ["$dbOff", function ($dbOff) {
        this.obterSetores = function () {
            return $dbOff.selectAll("Setor", options = { orderby: "NmSetor asc" });
        };

        this.obterSetoresPorDistrito = function (SqDistrito) {
            return $dbOff.selectAll("Setor", options = {
                where: "SqDistrito = ?",
                parameters: [SqDistrito]
            });
        };

        this.obterSetoresDoAgenteQtImoveis = function (DsBusca) {
            return $dbOff.selectAll("Setor", options = {
                count: "Imovel.SqSetor",
                ascount: "qtImoveis",
                leftjoin: "Imovel",
                columnsjoin: ["SqSetor"],
                onjoin: "Imovel.FlModificado is null",
                where: "Setor.SqSetor in (select SqSetor from Area_Agente) and Setor.NmSetor like('%?%')",
                parameters: [DsBusca],
                groupby: "Setor.SqSetor",
                orderby: "Setor.NmSetor asc"
            });
        };

        this.obterSetor = function (SqSetor) {
            return $dbOff.selectAll("Setor", options = {
                where: "SqSetor = ?",
                parameters: [SqSetor]
            });
        };
    }]);