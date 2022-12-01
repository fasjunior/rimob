angular.module("Rimob")
    .service("quadraService", ["$dbOff", function ($dbOff) {
        this.obterQuadras = function (SqSetor) {
            return $dbOff.selectAll("Quadra_Setor", options = {
                where: "SqSetor = ?",
                parameters: [SqSetor]
            });
        };

        this.obterQuadrasPorSetorDoAgenteQtImoveis = function (DsBusca, SqSetor) {
            return $dbOff.selectAll("Quadra_Setor", options = {
                count: "Imovel.SqQuadra",
                ascount: "qtImoveis",
                leftjoin: "Imovel",
                columnsjoin: ["SqSetor", "SqQuadra"],
                onjoin: "Imovel.FlModificado is null",
                where: "Quadra_Setor.SqQuadra in (select SqQuadra from Area_Agente where SqSetor = ?) and Quadra_Setor.SqSetor = ? and Quadra_Setor.NmQuadra like('%?%')",
                parameters: [SqSetor, SqSetor, DsBusca],
                groupby: "Quadra_Setor.SqQuadra",
                orderby: "Quadra_Setor.NmQuadra asc"
            });
        };

        this.obterQuadra = function (SqSetor, SqQuadra) {
            return $dbOff.selectAll("Quadra_Setor", options = {
                where: "SqSetor = ? and SqQuadra = ?",
                parameters: [SqSetor, SqQuadra]
            });
        };
    }]);