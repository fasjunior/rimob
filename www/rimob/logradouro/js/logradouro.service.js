angular.module("Rimob")
    .service("logradouroService", ["$dbOff", function ($dbOff) {
        this.obterLogradouroPorBairro = function (SqBairro) {
            return $dbOff.selectAll("Logradouro", options = {
                where: "SqBairro = ?",
                parameters: [SqBairro],
                orderby: "NmLogradouro asc"
            });
        };

        this.obterLogradouroPorBairroDoAgente = function (DsBusca, SqBairro) {
            return $dbOff.selectAll("Logradouro", options = {
                where: "SqLogradouro in (select SqLogradouro from Area_Agente where SqBairro = ?) and SqBairro = ? and NmLogradouro like('%?%')",
                parameters: [SqBairro, SqBairro, DsBusca],
                orderby: "NmLogradouro asc"
            });
        };

        this.obterLogradouroPorBairroDoAgenteQtImoveis = function (DsBusca, SqBairro) {
            return $dbOff.selectAll("Logradouro", options = {
                count: "Imovel.SqLogradouro",
                ascount: "qtImoveis",
                leftjoin: "Imovel",
                columnsjoin: ["SqBairro", "SqLogradouro"],
                onjoin: "Imovel.FlModificado is null",
                where: "Logradouro.SqLogradouro in (select SqLogradouro from Area_Agente where SqBairro = ?) and Logradouro.SqBairro = ? and Logradouro.NmLogradouro like('%?%')",
                parameters: [SqBairro, SqBairro, DsBusca],
                groupby: "Logradouro.SqLogradouro",
                orderby: "Logradouro.NmLogradouro asc"
            });
        };

        this.obterLogradouro = function (SqBairro, SqLogradouro) {
            return $dbOff.selectAll("Logradouro", options = {
                where: "SqBairro = ? and SqLogradouro = ?",
                parameters: [SqBairro, SqLogradouro]
            });
        };

        this.obterLogradourosPorSqs = function (SqBairro, SqsLogradouro) {
            return $dbOff.selectAll("Logradouro", options = {
                where: "SqBairro = ? and SqLogradouro in ?",
                parameters: [SqBairro, SqsLogradouro]
            });
        };
    }]);