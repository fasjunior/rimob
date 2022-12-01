angular.module("Rimob")
    .service("areaimovelService", ["$dbOff", function ($dbOff) {
        this.obterAreasImovel = function (SqImovelrecadastramento) {
            return $dbOff.selectAll("Area_Imovel", options = {
                where: "SqImovelrecadastramento = ?",
                parameters: [SqImovelrecadastramento]
            });
        };

        this.excluirAreaImovel = function (SqImovelrecadastramento, SqAreaimovel) {
            return $dbOff.delete("Area_Imovel", options = {
                where: "SqImovelrecadastramento = ? and SqAreaimovel = ?",
                parameters: [SqImovelrecadastramento, SqAreaimovel]
            });
        };

        this.excluirAreasImovel = function (SqImovelrecadastramento) {
            return $dbOff.delete("Area_Imovel", options = {
                where: "SqImovelrecadastramento = ?",
                parameters: [SqImovelrecadastramento]
            });
        };

        this.editarAreaImovel = function (AreaImovel) {
            return $dbOff.update("Area_Imovel", options = {
                where: "SqImovelrecadastramento = ? and SqAreaimovel = ?",
                parameters: [AreaImovel.SqImovelrecadastramento, AreaImovel.SqAreaimovel],
                object: AreaImovel
            });
        };

        this.inserirAreaImovel = function (AreasImovel) {
            return $dbOff.insert("Area_Imovel", AreasImovel);
        };

    }]);