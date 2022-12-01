angular.module("Rimob").service("bairroService", ["$dbOff", function ($dbOff) {
    this.obterBairros = function () {
        return $dbOff.selectAll("Bairro", options = { orderby: "NmBairro asc" });

    };

    this.obterBairrosDoAgente = function (DsBusca) {
        return $dbOff.selectAll("Bairro", options = {
            where: "SqBairro in (select SqBairro from Area_Agente) and NmBairro like('%?%')",
            orderby: "SqBairro asc",
            parameters: [DsBusca]

        });

    };

    this.obterBairrosDoAgenteQtImoveis = function (DsBusca) {
        return $dbOff.selectAll("Bairro", options = {
            count: "Imovel.SqBairro",
            ascount: "qtImoveis",
            leftjoin: "Imovel",
            columnsjoin: ["SqBairro"],
            onjoin: "Imovel.FlModificado is null",
            where: "Bairro.SqBairro in (select SqBairro from Area_Agente) and Bairro.NmBairro like('%?%')",
            parameters: [DsBusca],
            groupby: "Bairro.SqBairro",
            orderby: "Bairro.SqBairro asc"
        });
    };

    this.obterBairro = function (SqBairro) {
        return $dbOff.selectAll("Bairro", options = {
            where: "SqBairro = ?",
            parameters: [SqBairro]
        });
    };
}]);