angular.module("Rimob")
    .service("imovelService", ["$dbOff", function ($dbOff) {

        this.obterSqImovelRecadMax = function () {
            return $dbOff.selectAll("Imovel", options = {
                max: "SqImovelrecadastramento"
            });
        };

        this.obterTodosImoveis = function () {
            return $dbOff.selectAll("Imovel", options = {
                orderby: "NuPublico asc"
            });
        };

        this.obterImoveis = function (SqBairro, SqLogradouro) {
            return $dbOff.selectAll("Imovel", options = {
                where: "SqBairro = ? and SqLogradouro = ?",
                parameters: [SqBairro, SqLogradouro],
                orderby: "NuPublico asc"
            });
        };

        this.obterImoveisComBusca = function (SqBairro, SqLogradouro, DsBusca) {
            return $dbOff.selectAll("Imovel", options = {
                where: "FlExportado is ? and SqBairro = ? and SqLogradouro = ? and (NuLogradouro like('%?%') or NuPublico like('%?%') or NuQuadralogradouro like('%?%') or NuLotelogradouro like('%?%'))",
                parameters: ['null', SqBairro, SqLogradouro, DsBusca, DsBusca, DsBusca, DsBusca],
                orderby: "NuPublico asc"
            });
        };

        this.obterImoveisPorSetorEQuadraComBusca = function (SqSetor, SqQuadra, DsBusca) {
            return $dbOff.selectAll("Imovel", options = {
                where: "FlExportado is ? and SqSetor = ? and SqQuadra = ? and (NuLogradouro like('%?%') or NuPublico like('%?%') or NuQuadralogradouro like('%?%') or NuLotelogradouro like('%?%'))",
                parameters: ['null', SqSetor, SqQuadra, DsBusca, DsBusca, DsBusca, DsBusca],
                orderby: "NuPublico asc"
            });
        };

        this.obterImovel = function (SqBairro, SqLogradouro, SqImovelrecadastramento) {
            return $dbOff.selectAll("Imovel", options = {
                where: "SqBairro = ? and SqLogradouro = ? and SqImovelrecadastramento = ?",
                parameters: [SqBairro, SqLogradouro, SqImovelrecadastramento]
            });
        };

        this.inserirImovel = function (imovel) {
            $dbOff.insert("Imovel", [imovel]);
        };

        this.editarImovel = function (Imovel, SqImovelrecadastramento) {
            return $dbOff.update("Imovel", options = {
                where: "SqImovelrecadastramento = ?",
                parameters: [SqImovelrecadastramento],
                object: Imovel
            });
        };

        this.obterCoordenadasImovel = function () {
            let positionOptions = { timeout: 10000, enableHighAccuracy: true };
           // return $cordovaGeolocation.getCurrentPosition(positionOptions);
        };


    }]);